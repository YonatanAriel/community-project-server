import { db } from "../DB.js";

class SkillsController {
  static create(data) {
    const columns = ["skill_name"];
    const values = [data.skillName || data.skill_name];

    // Optional fields
    if (data.category) {
      columns.push("category");
      values.push(data.category);
    }

    const statement = db.prepare(
      `INSERT INTO skills (${columns.join(", ")}) VALUES (${columns
        .map(() => "?")
        .join(", ")})`
    );
    const info = statement.run(...values);
    return info.lastInsertRowid;
  }

  static read(query = "SELECT * FROM skills") {
    const statement = db.prepare(query);
    return statement.all();
  }

  static readOne(identifier, value) {
    const statement = db.prepare(
      `SELECT * FROM skills WHERE ${identifier} = ?`
    );
    return statement.get(value);
  }

  static updateOne(data, id) {
    const statement = db.prepare(`
      UPDATE skills SET 
        skill_name = COALESCE(?, skill_name),
        category = COALESCE(?, category)
      WHERE id = ?
    `);

    const info = statement.run(
      data.skillName || data.skill_name || null,
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
    const statement = db.prepare("DELETE FROM skills WHERE id = ?");
    const info = statement.run(id);
    return info.changes > 0;
  }
}

export default SkillsController;
