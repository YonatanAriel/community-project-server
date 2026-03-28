import Database from "better-sqlite3";

export const createIndustriesTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS industries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      industry_name TEXT UNIQUE NOT NULL,
      category TEXT, -- Technology, Finance, Healthcare, Education, etc.
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};

export const createUserIndustriesTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS user_industries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      industry_id INTEGER NOT NULL,
      experience_level TEXT DEFAULT 'familiar', -- familiar, experienced, expert
      years_in_industry INTEGER DEFAULT 0,
      is_current BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE CASCADE,
      UNIQUE(user_id, industry_id)
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};
