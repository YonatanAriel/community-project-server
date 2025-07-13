import { Database } from "better-sqlite3";

export const createUsersTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT,
      photo_url TEXT,
      client_id TEXT,
      is_active BOOLEAN NOT NULL DEFAULT 1,
      preferred_language TEXT DEFAULT 'en'
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};
