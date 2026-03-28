import { db } from "../DB.js";

class InterestsController {
  static create(data) {
    const columns = ["interest_name"];
    const values = [data.interestName || data.interest_name];

    // Optional fields
    if (data.category) {
      columns.push("category");
      values.push(data.category);
    }

    const statement = db.prepare(
      `INSERT INTO interests (${columns.join(", ")}) VALUES (${columns
        .map(() => "?")
        .join(", ")})`
    );
    const info = statement.run(...values);
    return info.lastInsertRowid;
  }

  static read(query = "SELECT * FROM interests") {
    const statement = db.prepare(query);
    return statement.all();
  }

  static readOne(identifier, value) {
    const statement = db.prepare(
      `SELECT * FROM interests WHERE ${identifier} = ?`
    );
    return statement.get(value);
  }

  static updateOne(data, id) {
    const statement = db.prepare(`
      UPDATE interests SET 
        interest_name = COALESCE(?, interest_name),
        category = COALESCE(?, category)
      WHERE id = ?
    `);

    const info = statement.run(
      data.interestName || data.interest_name || null,
      data.category || null,
      id
    );
    return info.changes > 0;
  }

  static readWithParams(query, params) {
    const statement = db.prepare(query);
    return statement.all(...params);
  }

  static delete(id) {
    const statement = db.prepare("DELETE FROM interests WHERE id = ?");
    const info = statement.run(id);
    return info.changes > 0;
  }
}

export default InterestsController;
