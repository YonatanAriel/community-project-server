import { db } from "../DB.js";

class IndustriesController {
  // CRUD Operations for Industries table
  static createIndustry(data) {
    const statement = db.prepare(
      "INSERT INTO industries (industry_name, category) VALUES (?, ?)"
    );
    const info = statement.run(
      data.industryName || data.industry_name,
      data.category
    );
    return info.lastInsertRowid;
  }

  static getAllIndustries() {
    const statement = db.prepare(
      "SELECT * FROM industries ORDER BY industry_name"
    );
    return statement.all();
  }

  static getIndustryById(id) {
    const statement = db.prepare("SELECT * FROM industries WHERE id = ?");
    return statement.get(id);
  }

  static getIndustriesByCategory(category) {
    const statement = db.prepare(
      "SELECT * FROM industries WHERE category = ? ORDER BY industry_name"
    );
    return statement.all(category);
  }

  static updateIndustry(id, data) {
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

  static deleteIndustry(id) {
    const statement = db.prepare("DELETE FROM industries WHERE id = ?");
    const info = statement.run(id);
    return info.changes > 0;
  }

  // User Industries Operations
  static addUserIndustry(data) {
    const statement = db.prepare(`
      INSERT OR REPLACE INTO user_industries (user_id, industry_id, experience_level, years_in_industry, is_current) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = statement.run(
      data.userId || data.user_id,
      data.industryId || data.industry_id,
      data.experienceLevel || data.experience_level || "familiar",
      data.yearsInIndustry || data.years_in_industry || 0,
      data.isCurrent || data.is_current || 0
    );
    return info.lastInsertRowid;
  }

  static getUserIndustries(userId) {
    const statement = db.prepare(`
      SELECT ui.*, i.industry_name, i.category 
      FROM user_industries ui
      JOIN industries i ON ui.industry_id = i.id
      WHERE ui.user_id = ?
      ORDER BY ui.is_current DESC, i.industry_name
    `);
    return statement.all(userId);
  }

  static getUserIndustriesByCategory(userId, category) {
    const statement = db.prepare(`
      SELECT ui.*, i.industry_name, i.category 
      FROM user_industries ui
      JOIN industries i ON ui.industry_id = i.id
      WHERE ui.user_id = ? AND i.category = ?
      ORDER BY ui.is_current DESC, i.industry_name
    `);
    return statement.all(userId, category);
  }

  static updateUserIndustry(userId, industryId, data) {
    const statement = db.prepare(`
      UPDATE user_industries 
      SET experience_level = COALESCE(?, experience_level),
          years_in_industry = COALESCE(?, years_in_industry),
          is_current = COALESCE(?, is_current)
      WHERE user_id = ? AND industry_id = ?
    `);
    const info = statement.run(
      data.experienceLevel || data.experience_level || null,
      data.yearsInIndustry || data.years_in_industry || null,
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

  static removeUserIndustry(userId, industryId) {
    const statement = db.prepare(
      "DELETE FROM user_industries WHERE user_id = ? AND industry_id = ?"
    );
    const info = statement.run(userId, industryId);
    return info.changes > 0;
  }

  // Search and Filter Operations
  static searchUsersByIndustry(industryName) {
    const statement = db.prepare(`
      SELECT u.*, ui.experience_level, ui.years_in_industry, ui.is_current, i.industry_name, i.category
      FROM users u
      JOIN user_industries ui ON u.id = ui.user_id
      JOIN industries i ON ui.industry_id = i.id
      WHERE i.industry_name LIKE ?
      ORDER BY 
        CASE ui.experience_level 
          WHEN 'expert' THEN 3
          WHEN 'experienced' THEN 2
          WHEN 'familiar' THEN 1
          ELSE 0
        END DESC,
        ui.years_in_industry DESC,
        ui.is_current DESC
    `);
    return statement.all(`%${industryName}%`);
  }

  static getUsersByIndustryCategory(category) {
    const statement = db.prepare(`
      SELECT DISTINCT u.*, i.category
      FROM users u
      JOIN user_industries ui ON u.id = ui.user_id
      JOIN industries i ON ui.industry_id = i.id
      WHERE i.category = ?
      ORDER BY u.full_name
    `);
    return statement.all(category);
  }

  static getIndustryCategories() {
    const statement = db.prepare(`
      SELECT DISTINCT category, COUNT(*) as industry_count
      FROM industries 
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY category
    `);
    return statement.all();
  }

  static getPopularIndustries(limit = 10) {
    const statement = db.prepare(`
      SELECT 
        i.industry_name,
        i.category,
        COUNT(ui.user_id) as user_count,
        AVG(ui.years_in_industry) as avg_experience
      FROM industries i
      JOIN user_industries ui ON i.id = ui.industry_id
      GROUP BY i.id
      ORDER BY user_count DESC
      LIMIT ?
    `);
    return statement.all(limit);
  }

  static getCurrentIndustryUsers(industryName) {
    const statement = db.prepare(`
      SELECT u.*, ui.experience_level, ui.years_in_industry, i.industry_name
      FROM users u
      JOIN user_industries ui ON u.id = ui.user_id
      JOIN industries i ON ui.industry_id = i.id
      WHERE i.industry_name LIKE ? AND ui.is_current = 1
      ORDER BY ui.years_in_industry DESC
    `);
    return statement.all(`%${industryName}%`);
  }

  static searchUsersByMultipleIndustries(industryNames) {
    const placeholders = industryNames.map(() => "?").join(",");
    const statement = db.prepare(`
      SELECT 
        u.*,
        GROUP_CONCAT(i.industry_name) as matching_industries,
        COUNT(DISTINCT i.id) as industry_match_count,
        AVG(ui.years_in_industry) as avg_experience
      FROM users u
      JOIN user_industries ui ON u.id = ui.user_id
      JOIN industries i ON ui.industry_id = i.id
      WHERE i.industry_name IN (${placeholders})
      GROUP BY u.id
      HAVING industry_match_count >= ?
      ORDER BY industry_match_count DESC, avg_experience DESC
    `);
    return statement.all(...industryNames, Math.min(1, industryNames.length));
  }

  static readWithParams(query, params) {
    const statement = db.prepare(query);
    return statement.all(...params);
  }
}

export default IndustriesController;
