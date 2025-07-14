import { db, initializeDB } from "./src/DL/DB.js";

// Initialize database first
initializeDB();

// Insert fake data for testing AI recommendations
const insertFakeMatchingProfiles = () => {
  const fakeProfiles = [
    {
      user_id: 1,
      full_name: "Liran Bar",
      location: "Tel Aviv, Israel",
      skills: JSON.stringify([
        "React",
        "Node.js",
        "TypeScript",
        "PostgreSQL",
        "AWS",
      ]),
      interests: JSON.stringify([
        "Startups",
        "AI",
        "Open Source",
        "Web Development",
      ]),
      job_titles: JSON.stringify([
        "Senior Frontend Developer",
        "Full Stack Developer",
      ]),
      industries: JSON.stringify(["FinTech", "HealthTech", "EdTech"]),
      summary:
        "Experienced full-stack developer with 5+ years in building modern web applications. Passionate about clean code and user experience. Looking to connect with startup founders and fellow developers.",
      custom_keywords: JSON.stringify([
        "team player",
        "independent",
        "detail-oriented",
        "problem solver",
      ]),
      open_to_connect: 1,
    },
    {
      user_id: 2,
      full_name: "Maya Cohen",
      location: "New York, USA",
      skills: JSON.stringify([
        "Python",
        "Machine Learning",
        "Data Science",
        "TensorFlow",
        "AWS",
      ]),
      interests: JSON.stringify([
        "AI",
        "Data Analytics",
        "Healthcare",
        "Research",
      ]),
      job_titles: JSON.stringify(["Data Scientist", "ML Engineer"]),
      industries: JSON.stringify(["Healthcare", "FinTech", "Research"]),
      summary:
        "Data scientist with expertise in machine learning and AI. Worked on healthcare analytics and financial modeling. Interested in AI startups and research collaborations.",
      custom_keywords: JSON.stringify([
        "analytical",
        "research-oriented",
        "innovative",
        "collaborative",
      ]),
      open_to_connect: 1,
    },
    {
      user_id: 3,
      full_name: "David Kim",
      location: "San Francisco, USA",
      skills: JSON.stringify([
        "JavaScript",
        "React",
        "Node.js",
        "GraphQL",
        "Docker",
      ]),
      interests: JSON.stringify([
        "Startups",
        "Technology",
        "Entrepreneurship",
        "Innovation",
      ]),
      job_titles: JSON.stringify([
        "CTO",
        "Technical Co-founder",
        "Senior Developer",
      ]),
      industries: JSON.stringify(["FinTech", "E-commerce", "SaaS"]),
      summary:
        "Serial entrepreneur and tech leader with experience building and scaling startups. Expert in full-stack development and technical leadership. Looking for co-founders and investment opportunities.",
      custom_keywords: JSON.stringify([
        "leader",
        "entrepreneur",
        "strategic",
        "mentor",
      ]),
      open_to_connect: 1,
    },
    {
      user_id: 4,
      full_name: "Sarah Johnson",
      location: "London, UK",
      skills: JSON.stringify([
        "Product Management",
        "UX Design",
        "Analytics",
        "Agile",
        "SQL",
      ]),
      interests: JSON.stringify([
        "Product Strategy",
        "User Experience",
        "Market Research",
        "Innovation",
      ]),
      job_titles: JSON.stringify(["Product Manager", "Senior Product Owner"]),
      industries: JSON.stringify(["FinTech", "EdTech", "Healthcare"]),
      summary:
        "Product manager with 7+ years experience in fintech and healthcare. Specialized in user-centered design and data-driven product decisions. Seeking opportunities in innovative startups.",
      custom_keywords: JSON.stringify([
        "user-focused",
        "data-driven",
        "strategic",
        "communicator",
      ]),
      open_to_connect: 1,
    },
    {
      user_id: 5,
      full_name: "Alex Rodriguez",
      location: "Austin, USA",
      skills: JSON.stringify([
        "Blockchain",
        "Solidity",
        "Web3",
        "Smart Contracts",
        "DeFi",
      ]),
      interests: JSON.stringify([
        "Cryptocurrency",
        "DeFi",
        "Blockchain",
        "Financial Innovation",
      ]),
      job_titles: JSON.stringify([
        "Blockchain Developer",
        "Smart Contract Engineer",
      ]),
      industries: JSON.stringify(["FinTech", "Cryptocurrency", "DeFi"]),
      summary:
        "Blockchain developer specializing in DeFi protocols and smart contract development. 4+ years in crypto space with focus on financial innovation. Open to consulting and full-time opportunities.",
      custom_keywords: JSON.stringify([
        "innovative",
        "technical",
        "crypto-native",
        "problem-solver",
      ]),
      open_to_connect: 1,
    },
  ];

  // Insert each profile
  fakeProfiles.forEach((profile) => {
    try {
      const statement = db.prepare(`
        INSERT OR REPLACE INTO matching_profiles (
          user_id, full_name, location, skills, interests, 
          job_titles, industries, summary, custom_keywords, open_to_connect
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      statement.run(
        profile.user_id,
        profile.full_name,
        profile.location,
        profile.skills,
        profile.interests,
        profile.job_titles,
        profile.industries,
        profile.summary,
        profile.custom_keywords,
        profile.open_to_connect
      );

      console.log(`✅ Inserted profile for ${profile.full_name}`);
    } catch (error) {
      console.error(
        `❌ Error inserting profile for ${profile.full_name}:`,
        error
      );
    }
  });

  // Also insert corresponding users if they don't exist
  const fakeUsers = [
    { id: 1, full_name: "Liran Bar", email: "liran@example.com" },
    { id: 2, full_name: "Maya Cohen", email: "maya@example.com" },
    { id: 3, full_name: "David Kim", email: "david@example.com" },
    { id: 4, full_name: "Sarah Johnson", email: "sarah@example.com" },
    { id: 5, full_name: "Alex Rodriguez", email: "alex@example.com" },
  ];

  fakeUsers.forEach((user) => {
    try {
      const statement = db.prepare(`
        INSERT OR REPLACE INTO users (id, full_name, email) VALUES (?, ?, ?)
      `);

      statement.run(user.id, user.full_name, user.email);
      console.log(`✅ Inserted user ${user.full_name}`);
    } catch (error) {
      console.error(`❌ Error inserting user ${user.full_name}:`, error);
    }
  });

  console.log("🎉 Fake data insertion completed!");
};

// Run the function
insertFakeMatchingProfiles();
