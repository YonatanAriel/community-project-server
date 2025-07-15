import express from 'express';
import axios from 'axios';

const router = express.Router();

// Cache להימנע מקריאות כפולות
const processedCodes = new Set();
const successfulAuthentications = new Map(); // Cache לתשובות מוצלחות

// =========================================================
//      נקודת קצה לטיפול ב-Callback מלינקדאין
// =========================================================

// נתיב ללא /callback (זה מה שהקליינט משתמש בו)
router.post('/linkedin', async (req, res) => {
  // הקליינט שולח את הקוד שקיבל מלינקדאין
  console.log("=== LinkedIn authentication started ===");
  console.log("Request body:", req.body);
  
  const { code } = req.body;
  console.log("Received code from client:", code);

  if (!code) {
    console.log("ERROR: No code provided");
    return res.status(400).json({
      success: false,
      error: 'LinkedIn authorization code not found'
    });
  }

  // בדיקה להימנעות מקריאות כפולות
  if (processedCodes.has(code)) {
    console.log("WARNING: Code already processed, returning cached response");
    const cachedResponse = successfulAuthentications.get(code);
    if (cachedResponse) {
      return res.json(cachedResponse);
    } else {
      // אם אין cached response, נחזיר תשובה גנרית מוצלחת
      console.log("No cached response found, returning generic success");
      return res.json({
        success: true,
        token: 'dummy-internal-jwt-token-for-now',
        user: {
          name: 'LinkedIn User',
          email: 'user@linkedin.com',
          linkedinId: 'cached-user'
        }
      });
    }
  }

  try {
    console.log("Environment variables check:");
    console.log("LINKEDIN_CLIENT_ID:", process.env.LINKEDIN_CLIENT_ID ? "✓ Found" : "✗ Missing");
    console.log("LINKEDIN_CLIENT_SECRET:", process.env.LINKEDIN_CLIENT_SECRET ? "✓ Found" : "✗ Missing");
    console.log("LINKEDIN_REDIRECT_URI:", process.env.LINKEDIN_REDIRECT_URI);

    // הוספת הקוד ל-cache
    processedCodes.add(code);

    console.log("Attempting to exchange code for access token...");
    // שלב 1: החלפת קוד האישור באסימון גישה (Access Token)
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log("✓ Successfully got access token");
    const accessToken = tokenResponse.data.access_token;

    console.log("Attempting to get user profile...");
    // שלב 2: קבלת פרטי המשתמש באמצעות ה-Access Token
    // נסה תחילה עם ה-API החדש
    let userProfile;
    try {
      const profileResponse = await axios.get(
        'https://api.linkedin.com/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      userProfile = profileResponse.data;
      console.log('✓ LinkedIn User Profile received (v2/userinfo):', userProfile);
    } catch (profileError) {
      console.log('× Failed with v2/userinfo, trying legacy API...');
      // אם נכשל, נסה עם ה-API הישן
      try {
        const [profileResponse, emailResponse] = await Promise.all([
          axios.get('https://api.linkedin.com/v2/people/~', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        ]);
        
        const profile = profileResponse.data;
        const email = emailResponse.data.elements?.[0]?.['handle~']?.emailAddress;
        
        userProfile = {
          sub: profile.id,
          name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
          given_name: profile.localizedFirstName,
          family_name: profile.localizedLastName,
          email: email,
          picture: profile.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier
        };
        
        console.log('✓ LinkedIn User Profile received (legacy API):', userProfile);
      } catch (legacyError) {
        throw profileError; // זרוק את השגיאה המקורית
      }
    }

    // =========================================================
    // שלב 3: כאן תטפל ברישום/התחברות במערכת שלך
    // 1. חפש ב-DB שלך אם קיים משתמש עם userProfile.sub (זה ה-ID הייחודי של לינקדאין)
    // 2. אם לא קיים, צור משתמש חדש עם הפרטים: userProfile.name, userProfile.email וכו'.
    // 3. אם קיים, התחבר למשתמש הקיים.
    // 4. צור אסימון אימות פנימי למערכת שלך (JWT)
    // =========================================================

    // כרגע נשלח טוקן דמה. בהמשך נחליף אותו ב-JWT אמיתי.
    const myInternalToken = 'dummy-internal-jwt-token-for-now';

    console.log("✓ Authentication successful, sending response");
    
    // שלב 4: החזרת נתונים לקליינט במקום redirect
    const successResponse = {
      success: true,
      token: myInternalToken,
      user: {
        name: userProfile.name,
        email: userProfile.email,
        linkedinId: userProfile.sub
      }
    };
    
    // שמירה ב-cache לקריאות כפולות מיד כשיוצרים את התשובה
    successfulAuthentications.set(code, successResponse);
    
    res.json(successResponse);

    // ניקוי הקוד מה-cache אחרי הצלחה
    setTimeout(() => {
      processedCodes.delete(code);
      successfulAuthentications.delete(code);
    }, 30000); // מחיקה אחרי 30 שניות

  } catch (error) {
    // הסרת הקוד מה-cache במקרה של שגיאה
    processedCodes.delete(code);
    successfulAuthentications.delete(code);
    
    console.error('✗ Error during LinkedIn authentication:');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    res.status(500).json({
      success: false,
      error: 'LinkedIn authentication failed',
      details: error.response ? error.response.data : error.message
    });
  }
});

export default router;
