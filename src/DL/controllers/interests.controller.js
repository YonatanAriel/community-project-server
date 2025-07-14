import { db } from "../DB.js";

class InterestsController {
  // CRUD Operations for Interests table
  static createInterest(data) {
    const statement = db.prepare("INSERT INTO interests (interest_name, category) VALUES (?, ?)");
    const info = statement.run(data.interestName || data.interest_name, data.category);
    return info.lastInsertRowid;
  }

  static getAllInterests() {
    const statement = db.prepare("SELECT * FROM interests ORDER BY interest_name");
    return statement.all();
  }

  static getInterestById(id) {
    const statement = db.prepare("SELECT * FROM interests WHERE id = ?");
    return statement.get(id);
  }

  static getInterestsByCategory(category) {
    const statement = db.prepare("SELECT * FROM interests WHERE category = ? ORDER BY interest_name");
    return statement.all(category);
  }

  static updateInterest(id, data) {
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

  static deleteInterest(id) {
    const statement = db.prepare("DELETE FROM interests WHERE id = ?");
    const info = statement.run(id);
    return info.changes > 0;
  }

  // User Interests Operations
  static addUserInterest(data) {
    const statement = db.prepare(`
      INSERT OR REPLACE INTO user_interests (user_id, interest_id, interest_level) 
      VALUES (?, ?, ?)
    `);
    const info = statement.run(
      data.userId || data.user_id,
      data.interestId || data.interest_id,
      data.interestLevel || data.interest_level || 'casual'
    );
    return info.lastInsertRowid;
  }

  static getUserInterests(userId) {
    const statement = db.prepare(`
      SELECT ui.*, i.interest_name, i.category 
      FROM user_interests ui
      JOIN interests i ON ui.interest_id = i.id
      WHERE ui.user_id = ?
      ORDER BY i.interest_name
    `);
    return statement.all(userId);
  }

  static getUserInterestsByCategory(userId, category) {
    const statement = db.prepare(`
      SELECT ui.*, i.interest_name, i.category 
      FROM user_interests ui
      JOIN interests i ON ui.interest_id = i.id
      WHERE ui.user_id = ? AND i.category = ?
      ORDER BY i.interest_name
    `);
    return statement.all(userId, category);
  }

  static updateUserInterest(userId, interestId, data) {
    const statement = db.prepare(`
      UPDATE user_interests 
      SET interest_level = COALESCE(?, interest_level)
      WHERE user_id = ? AND interest_id = ?
    `);
    const info = statement.run(
      data.interestLevel || data.interest_level || null,
      userId,
      interestId
    );
    return info.changes > 0;
  }

  static removeUserInterest(userId, interestId) {
    const statement = db.prepare("DELETE FROM user_interests WHERE user_id = ? AND interest_id = ?");
    const info = statement.run(userId, interestId);
    return info.changes > 0;
  }

  // Search and Filter Operations
  static searchUsersByInterest(interestName) {
    const statement = db.prepare(`
      SELECT u.*, ui.interest_level, i.interest_name, i.category
      FROM users u
      JOIN user_interests ui ON u.id = ui.user_id
      JOIN interests i ON ui.interest_id = i.id
      WHERE i.interest_name LIKE ?
      ORDER BY 
        CASE ui.interest_level 
          WHEN 'professional' THEN 3
          WHEN 'serious' THEN 2
          WHEN 'casual' THEN 1
          ELSE 0
        END DESC
    `);
    return statement.all(`%${interestName}%`);
  }

  static getUsersByInterestCategory(category) {
    const statement = db.prepare(`
      SELECT DISTINCT u.*, i.category
      FROM users u
      JOIN user_interests ui ON u.id = ui.user_id
      JOIN interests i ON ui.interest_id = i.id
      WHERE i.category = ?
      ORDER BY u.full_name
    `);
    return statement.all(category);
  }

  static getInterestCategories() {
    const statement = db.prepare(`
      SELECT DISTINCT category, COUNT(*) as interest_count
      FROM interests 
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY category
    `);
    return statement.all();
  }

  static getPopularInterests(limit = 10) {
    const statement = db.prepare(`
      SELECT 
        i.interest_name,
        i.category,
        COUNT(ui.user_id) as user_count
      FROM interests i
      JOIN user_interests ui ON i.id = ui.interest_id
      GROUP BY i.id
      ORDER BY user_count DESC
      LIMIT ?
    `);
    return statement.all(limit);
  }

  static searchUsersByMultipleInterests(interestNames) {
    const placeholders = interestNames.map(() => '?').join(',');
    const statement = db.prepare(`
      SELECT 
        u.*,
        GROUP_CONCAT(i.interest_name) as matching_interests,
        COUNT(DISTINCT i.id) as interest_match_count
      FROM users u
      JOIN user_interests ui ON u.id = ui.user_id
      JOIN interests i ON ui.interest_id = i.id
      WHERE i.interest_name IN (${placeholders})
      GROUP BY u.id
      HAVING interest_match_count >= ?
      ORDER BY interest_match_count DESC
    `);
    return statement.all(...interestNames, Math.min(1, interestNames.length));
  }

  static readWithParams(query, params) {
    const statement = db.prepare(query);
    return statement.all(...params);
  }
}

export default InterestsController;
