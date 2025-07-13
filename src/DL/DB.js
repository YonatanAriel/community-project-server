import Database from "better-sqlite3";

import { createUsersTable } from "./models/user";
import UsersServices from "../BL/services/users.service";

const db = new Database("community.db", { verbose: console.log });
db.pragma("journal_mode = WAL");

const initializeDB = () => {
  //only for development to insure that the tables will update when i change the create table query
  // db.exec(`
  //     DROP TABLE IF EXISTS users;
  //   `);

  createUsersTable(db);
};

// db.backup(`backup-${Date.now()}.db`)
//   .then(() => {
//     console.log('backup complete!');
//   })
//   .catch((err) => {
//     console.log('backup failed:', err);
//   });

export { db, initializeDB };
