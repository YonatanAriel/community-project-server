import Database from "better-sqlite3";

export const createGroupsTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_name TEXT UNIQUE NOT NULL,
      description TEXT,
      group_type TEXT, -- Professional, Social, Interest-based
      is_active BOOLEAN DEFAULT 1,
      created_by INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};

export const createUserGroupsTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS user_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      group_id INTEGER NOT NULL,
      role TEXT DEFAULT 'member', -- member, admin, moderator
      joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
      UNIQUE(user_id, group_id)
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};

export const createEventsTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_name TEXT NOT NULL,
      description TEXT,
      event_date TEXT,
      location TEXT,
      event_type TEXT, -- Workshop, Networking, Conference, etc.
      max_participants INTEGER,
      is_active BOOLEAN DEFAULT 1,
      created_by INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};

export const createUserEventsTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS user_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      participation_status TEXT DEFAULT 'registered', -- registered, attended, cancelled
      registration_date TEXT DEFAULT CURRENT_TIMESTAMP,
      attendance_confirmed BOOLEAN DEFAULT 0,
      feedback TEXT,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      UNIQUE(user_id, event_id)
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};
