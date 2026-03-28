import { db } from "../DB.js";

class IndustriesController {
  static create(data) {
    const columns = ["industry_name"];
    const values = [data.industryName || data.industry_name];

    // Optional fields
    if (data.category) {
      columns.push("category");
      values.push(data.category);
    }

    const statement = db.prepare(
      `INSERT INTO industries (${columns.join(", ")}) VALUES (${columns
        .map(() => "?")
        .join(", ")})`
    );
    const info = statement.run(...values);
    return info.lastInsertRowid;
  }

  static read(query = "SELECT * FROM industries") {
    const statement = db.prepare(query);
    return statement.all();
  }

  static readOne(identifier, value) {
    const statement = db.prepare(
      `SELECT * FROM industries WHERE ${identifier} = ?`
    );
    return statement.get(value);
  }

  static updateOne(data, id) {
    const statement = db.prepare(`
      UPDATE industries SET 
        industry_name = COALESCE(?, industry_name),
        category = COALESCE(?, category)
      WHERE id = ?
    `);

    const info = statement.run(
      data.industryName || data.industry_name || null,
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
    const statement = db.prepare("DELETE FROM industries WHERE id = ?");
    const info = statement.run(id);
    return info.changes > 0;
  }
}

export default IndustriesController;
