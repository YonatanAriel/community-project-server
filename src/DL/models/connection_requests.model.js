import Database from "better-sqlite3";

export const createConnectionRequestsTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS connection_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_user_id INTEGER,
      to_user_id INTEGER,
      reason TEXT,
      status TEXT DEFAULT 'pending',
      requested_at TEXT DEFAULT CURRENT_TIMESTAMP,
      responded_at TEXT,
      FOREIGN KEY (from_user_id) REFERENCES users(id),
      FOREIGN KEY (to_user_id) REFERENCES users(id)
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};
