import Database from "better-sqlite3";

const db = new Database("community.db");

db.exec(`DROP TABLE IF EXISTS matching_profiles;`);
db.exec(`DROP TABLE IF EXISTS users;`);

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT,
    email TEXT UNIQUE,
    linkedin_url TEXT,
    profile_image_url TEXT,
    is_admin BOOLEAN DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE matching_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    full_name TEXT,
    location TEXT,
    skills TEXT,
    interests TEXT,
    job_titles TEXT,
    industries TEXT,
    summary TEXT,
    custom_keywords TEXT,
    open_to_connect BOOLEAN DEFAULT 1,
    last_updated TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const users = [
  { id: 1, full_name: "Liran Bar", email: "liran@example.com" },
  { id: 2, full_name: "Maya Cohen", email: "maya@example.com" },
  { id: 3, full_name: "David Kim", email: "david@example.com" },
  { id: 4, full_name: "Sarah Johnson", email: "sarah@example.com" },
  { id: 5, full_name: "Alex Rodriguez", email: "alex@example.com" },
];

const userStmt = db.prepare(
  "INSERT OR REPLACE INTO users (id, full_name, email) VALUES (?, ?, ?)"
);

users.forEach((user) => {
  userStmt.run(user.id, user.full_name, user.email);
  console.log(`✅ Inserted user: ${user.full_name}`);
});

const profiles = [
  {
    user_id: 1,
    full_name: "Liran Bar",
    location: "Tel Aviv, Israel",
    skills: '["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"]',
    interests: '["Startups", "AI", "Open Source", "Web Development"]',
    job_titles: '["Senior Frontend Developer", "Full Stack Developer"]',
    industries: '["FinTech", "HealthTech", "EdTech"]',
    summary:
      "Experienced full-stack developer with 5+ years in building modern web applications. Passionate about clean code and user experience. Looking to connect with startup founders and fellow developers.",
    custom_keywords:
      '["team player", "independent", "detail-oriented", "problem solver"]',
  },
  {
    user_id: 2,
    full_name: "Maya Cohen",
    location: "New York, USA",
    skills:
      '["Python", "Machine Learning", "Data Science", "TensorFlow", "AWS"]',
    interests: '["AI", "Data Analytics", "Healthcare", "Research"]',
    job_titles: '["Data Scientist", "ML Engineer"]',
    industries: '["Healthcare", "FinTech", "Research"]',
    summary:
      "Data scientist with expertise in machine learning and AI. Worked on healthcare analytics and financial modeling. Interested in AI startups and research collaborations.",
    custom_keywords:
      '["analytical", "research-oriented", "innovative", "collaborative"]',
  },
  {
    user_id: 3,
    full_name: "David Kim",
    location: "San Francisco, USA",
    skills: '["JavaScript", "React", "Node.js", "GraphQL", "Docker"]',
    interests: '["Startups", "Technology", "Entrepreneurship", "Innovation"]',
    job_titles: '["CTO", "Technical Co-founder", "Senior Developer"]',
    industries: '["FinTech", "E-commerce", "SaaS"]',
    summary:
      "Serial entrepreneur and tech leader with experience building and scaling startups. Expert in full-stack development and technical leadership. Looking for co-founders and investment opportunities.",
    custom_keywords: '["leader", "entrepreneur", "strategic", "mentor"]',
  },
  {
    user_id: 4,
    full_name: "Sarah Johnson",
    location: "London, UK",
    skills: '["Product Management", "UX Design", "Analytics", "Agile", "SQL"]',
    interests:
      '["Product Strategy", "User Experience", "Market Research", "Innovation"]',
    job_titles: '["Product Manager", "Senior Product Owner"]',
    industries: '["FinTech", "EdTech", "Healthcare"]',
    summary:
      "Product manager with 7+ years experience in fintech and healthcare. Specialized in user-centered design and data-driven product decisions. Seeking opportunities in innovative startups.",
    custom_keywords:
      '["user-focused", "data-driven", "strategic", "communicator"]',
  },
  {
    user_id: 5,
    full_name: "Alex Rodriguez",
    location: "Austin, USA",
    skills: '["Blockchain", "Solidity", "Web3", "Smart Contracts", "DeFi"]',
    interests:
      '["Cryptocurrency", "DeFi", "Blockchain", "Financial Innovation"]',
    job_titles: '["Blockchain Developer", "Smart Contract Engineer"]',
    industries: '["FinTech", "Cryptocurrency", "DeFi"]',
    summary:
      "Blockchain developer specializing in DeFi protocols and smart contract development. 4+ years in crypto space with focus on financial innovation. Open to consulting and full-time opportunities.",
    custom_keywords:
      '["innovative", "technical", "crypto-native", "problem-solver"]',
  },
];

const profileStmt = db.prepare(`
  INSERT OR REPLACE INTO matching_profiles (
    user_id, full_name, location, skills, interests, 
    job_titles, industries, summary, custom_keywords, open_to_connect
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

profiles.forEach((profile) => {
  profileStmt.run(
    profile.user_id,
    profile.full_name,
    profile.location,
    profile.skills,
    profile.interests,
    profile.job_titles,
    profile.industries,
    profile.summary,
    profile.custom_keywords
  );
  console.log(`✅ Inserted profile: ${profile.full_name}`);
});

console.log("🎉 All fake data inserted successfully!");
db.close();
