import { db } from "../DB.js";

class UserInterestsController {
  static create(data) {
    const columns = ["user_id", "interest_id"];
    const values = [
      data.userId || data.user_id,
      data.interestId || data.interest_id,
    ];

    // Optional fields
    if (data.interestLevel || data.interest_level) {
      columns.push("interest_level");
      values.push(data.interestLevel || data.interest_level);
    }

    const statement = db.prepare(
      `INSERT OR REPLACE INTO user_interests (${columns.join(
        ", "
      )}) VALUES (${columns.map(() => "?").join(", ")})`
    );
    const info = statement.run(...values);
    return info.lastInsertRowid;
  }

  static read(query = "SELECT * FROM user_interests") {
    const statement = db.prepare(query);
    return statement.all();
  }

  static readOne(identifier, value) {
    const statement = db.prepare(
      `SELECT * FROM user_interests WHERE ${identifier} = ?`
    );
    return statement.get(value);
  }

  static updateOne(data, userId, interestId) {
    const statement = db.prepare(`
      UPDATE user_interests SET 
        interest_level = COALESCE(?, interest_level)
      WHERE user_id = ? AND interest_id = ?
    `);

    const info = statement.run(
      data.interestLevel || data.interest_level || null,
      userId,
      interestId
    );
    return info.changes > 0;
  }

  static readWithParams(query, params) {
    const statement = db.prepare(query);
    return statement.all(...params);
  }

  static delete(userId, interestId) {
    const statement = db.prepare(
      "DELETE FROM user_interests WHERE user_id = ? AND interest_id = ?"
    );
    const info = statement.run(userId, interestId);
    return info.changes > 0;
  }
}

export default UserInterestsController;
