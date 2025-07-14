import Database from "better-sqlite3";

export const createCompaniesTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT UNIQUE NOT NULL,
      industry TEXT,
      size TEXT, -- Startup, Small, Medium, Large, Enterprise
      location TEXT,
      website TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};

export const createJobTitlesTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS job_titles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_name TEXT UNIQUE NOT NULL,
      category TEXT, -- Engineering, Marketing, Sales, Management, etc.
      seniority_level TEXT, -- Junior, Mid, Senior, Lead, Manager, Director
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};

export const createUserExperienceTable = (db) => {
  const query = `--sql
    CREATE TABLE IF NOT EXISTS user_experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      company_id INTEGER,
      job_title_id INTEGER,
      custom_title TEXT, -- במקרה שהתפקיד לא קיים ברשימה
      start_date TEXT,
      end_date TEXT,
      is_current BOOLEAN DEFAULT 0,
      description TEXT,
      achievements TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (company_id) REFERENCES companies(id),
      FOREIGN KEY (job_title_id) REFERENCES job_titles(id)
    )
  `;
  const statement = db.prepare(query);
  statement.run();
};
