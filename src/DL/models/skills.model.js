import Database from "better-sqlite3";

export const createSkillsTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      skill_name TEXT UNIQUE NOT NULL,
      category TEXT, -- Technical, Soft Skills, Industry, etc.
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};

export const createUserSkillsTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS user_skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      skill_id INTEGER NOT NULL,
      proficiency_level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced, expert
      years_experience INTEGER DEFAULT 0,
      is_primary BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
      UNIQUE(user_id, skill_id)
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};
