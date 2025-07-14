import { db } from "../DB.js";

class UserIndustriesController {
  static create(data) {
    const columns = ["user_id", "industry_id"];
    const values = [
      data.userId || data.user_id,
      data.industryId || data.industry_id,
    ];

    // Optional fields
    if (data.experienceLevel || data.experience_level) {
      columns.push("experience_level");
      values.push(data.experienceLevel || data.experience_level);
    }
    if (
      data.yearsInIndustry !== undefined ||
      data.years_in_industry !== undefined
    ) {
      columns.push("years_in_industry");
      values.push(data.yearsInIndustry ?? data.years_in_industry ?? 0);
    }
    if (data.isCurrent !== undefined || data.is_current !== undefined) {
      columns.push("is_current");
      values.push(data.isCurrent ?? data.is_current ?? 0);
    }

    const statement = db.prepare(
      `INSERT OR REPLACE INTO user_industries (${columns.join(
        ", "
      )}) VALUES (${columns.map(() => "?").join(", ")})`
    );
    const info = statement.run(...values);
    return info.lastInsertRowid;
  }

  static read(query = "SELECT * FROM user_industries") {
    const statement = db.prepare(query);
    return statement.all();
  }

  static readOne(identifier, value) {
    const statement = db.prepare(
      `SELECT * FROM user_industries WHERE ${identifier} = ?`
    );
    return statement.get(value);
  }

  static updateOne(data, userId, industryId) {
    const statement = db.prepare(`
      UPDATE user_industries SET 
        experience_level = COALESCE(?, experience_level),
        years_in_industry = COALESCE(?, years_in_industry),
        is_current = COALESCE(?, is_current)
      WHERE user_id = ? AND industry_id = ?
    `);

    const info = statement.run(
      data.experienceLevel || data.experience_level || null,
      data.yearsInIndustry ?? data.years_in_industry ?? null,
      data.isCurrent !== undefined
        ? data.isCurrent
          ? 1
          : 0
        : data.is_current !== undefined
        ? data.is_current
          ? 1
          : 0
        : null,
      userId,
      industryId
    );
    return info.changes > 0;
  }

  static readWithParams(query, params) {
    const statement = db.prepare(query);
    return statement.all(...params);
  }

  static delete(userId, industryId) {
    const statement = db.prepare(
      "DELETE FROM user_industries WHERE user_id = ? AND industry_id = ?"
    );
    const info = statement.run(userId, industryId);
    return info.changes > 0;
  }
}

export default UserIndustriesController;
