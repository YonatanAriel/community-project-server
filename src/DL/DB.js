import Database from "better-sqlite3";

// Existing models
import { createUsersTable } from "./models/user.model.js";
import { createConnectionRequestsTable } from "./models/connection_requests.model.js";
import { createMatchingProfilesTable } from "./models/matching_profiles.model.js";

// New relational models
import {
  createSkillsTable,
  createUserSkillsTable,
} from "./models/skills.model.js";
import {
  createInterestsTable,
  createUserInterestsTable,
} from "./models/interests.model.js";
import {
  createIndustriesTable,
  createUserIndustriesTable,
} from "./models/industries.model.js";

const db = new Database("community.db", { verbose: console.log });
db.pragma("journal_mode = WAL");

const initializeDB = () => {
  //only for development to insure that the tables will update when i change the create table query
  // db.exec(`
  //   DROP TABLE IF EXISTS user_industries;
  //   DROP TABLE IF EXISTS user_interests;
  //   DROP TABLE IF EXISTS user_skills;
  //   DROP TABLE IF EXISTS connection_requests;
  //   DROP TABLE IF EXISTS matching_profiles;
  //   DROP TABLE IF EXISTS industries;
  //   DROP TABLE IF EXISTS interests;
  //   DROP TABLE IF EXISTS skills;
  //   DROP TABLE IF EXISTS users;
  // `);

  // Create main tables first (no foreign key dependencies)
  createUsersTable(db);
  createSkillsTable(db);
  createInterestsTable(db);
  createIndustriesTable(db);

  // Create relationship tables after main tables (with foreign keys)
  createUserSkillsTable(db);
  createUserInterestsTable(db);
  createUserIndustriesTable(db);
  createConnectionRequestsTable(db);
  createMatchingProfilesTable(db);
};

// db.backup(`backup-${Date.now()}.db`)
//   .then(() => {
//     console.log('backup complete!');
//   })
//   .catch((err) => {
//     console.log('backup failed:', err);
//   });

export { db, initializeDB };
