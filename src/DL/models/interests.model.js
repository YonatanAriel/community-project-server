import Database from "better-sqlite3";

export const createInterestsTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      interest_name TEXT UNIQUE NOT NULL,
      category TEXT, -- Technology, Business, Arts, Sports, etc.
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};

export const createUserInterestsTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS user_interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      interest_id INTEGER NOT NULL,
      interest_level TEXT DEFAULT 'casual', -- casual, serious, professional
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE,
      UNIQUE(user_id, interest_id)
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};
