import Database from "better-sqlite3";

export const createUsersTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      linkedin_url TEXT,
      profile_image_url TEXT,
      is_admin BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};
