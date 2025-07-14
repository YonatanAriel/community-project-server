import { db } from "../DB.js";

class UserSkillsController {
  static create(data) {
    const columns = ["user_id", "skill_id"];
    const values = [data.userId || data.user_id, data.skillId || data.skill_id];

    // Optional fields
    if (data.proficiencyLevel || data.proficiency_level) {
      columns.push("proficiency_level");
      values.push(data.proficiencyLevel || data.proficiency_level);
    }
    if (
      data.yearsExperience !== undefined ||
      data.years_experience !== undefined
    ) {
      columns.push("years_experience");
      values.push(data.yearsExperience ?? data.years_experience ?? 0);
    }
    if (data.isPrimary !== undefined || data.is_primary !== undefined) {
      columns.push("is_primary");
      values.push(data.isPrimary ?? data.is_primary ?? 0);
    }

    const statement = db.prepare(
      `INSERT OR REPLACE INTO user_skills (${columns.join(
        ", "
      )}) VALUES (${columns.map(() => "?").join(", ")})`
    );
    const info = statement.run(...values);
    return info.lastInsertRowid;
  }

  static read(query = "SELECT * FROM user_skills") {
    const statement = db.prepare(query);
    return statement.all();
  }

  static readOne(identifier, value) {
    const statement = db.prepare(
      `SELECT * FROM user_skills WHERE ${identifier} = ?`
    );
    return statement.get(value);
  }

  static updateOne(data, userId, skillId) {
    const statement = db.prepare(`
      UPDATE user_skills SET 
        proficiency_level = COALESCE(?, proficiency_level),
        years_experience = COALESCE(?, years_experience),
        is_primary = COALESCE(?, is_primary)
      WHERE user_id = ? AND skill_id = ?
    `);

    const info = statement.run(
      data.proficiencyLevel || data.proficiency_level || null,
      data.yearsExperience ?? data.years_experience ?? null,
      data.isPrimary ?? data.is_primary ?? null,
      userId,
      skillId
    );
    return info.changes > 0;
  }

  static readWithParams(query, params) {
    const statement = db.prepare(query);
    return statement.all(...params);
  }

  static delete(userId, skillId) {
    const statement = db.prepare(
      "DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?"
    );
    const info = statement.run(userId, skillId);
    return info.changes > 0;
  }
}

export default UserSkillsController;
