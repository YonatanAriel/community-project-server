import Database from "better-sqlite3";

export const createMatchingProfilesTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS matching_profiles (
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
      last_updated TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};
