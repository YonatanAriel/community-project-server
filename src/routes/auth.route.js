import express from 'express';
import axios from 'axios';

const router = express.Router();

// =========================================================
//      נקודת קצה לטיפול ב-Callback מלינקדאין
// =========================================================
router.get('/linkedin/callback', async (req, res) => {
  // לינקדאין שולחת בחזרה קוד אישור ב-URL
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Error: LinkedIn authorization code not found.');
  }

  try {
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

    const accessToken = tokenResponse.data.access_token;

    // שלב 2: קבלת פרטי המשתמש באמצעות ה-Access Token
    const profileResponse = await axios.get(
      'https://api.linkedin.com/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userProfile = profileResponse.data;
    console.log('LinkedIn User Profile:', userProfile);

    // =========================================================
    // שלב 3: כאן תטפל ברישום/התחברות במערכת שלך
    // 1. חפש ב-DB שלך אם קיים משתמש עם userProfile.sub (זה ה-ID הייחודי של לינקדאין)
    // 2. אם לא קיים, צור משתמש חדש עם הפרטים: userProfile.name, userProfile.email וכו'.
    // 3. אם קיים, התחבר למשתמש הקיים.
    // 4. צור אסימון אימות פנימי למערכת שלך (JWT)
    // =========================================================

    // כרגע נשלח טוקן דמה. בהמשך נחליף אותו ב-JWT אמיתי.
    const myInternalToken = 'dummy-internal-jwt-token-for-now';

    // שלב 4: הפניית המשתמש בחזרה ל-React עם הטוקן הפנימי
    // ודא ש-http://localhost:3000 הוא הכתובת של ה-React frontend שלך
    res.redirect(`http://localhost:3000/login-success?token=${myInternalToken}&name=${encodeURIComponent(userProfile.name)}`);

  } catch (error) {
    console.error('Error during LinkedIn authentication:', error.response ? error.response.data : error.message);
    res.redirect('http://localhost:3000/login-error');
  }
});

export default router;
