import { db } from "../DB.js";

class SkillsController {
  // CRUD Operations for Skills table
  static createSkill(data) {
    const statement = db.prepare(
      "INSERT INTO skills (skill_name, category) VALUES (?, ?)"
    );
    const info = statement.run(
      data.skillName || data.skill_name,
      data.category
    );
    return info.lastInsertRowid;
  }

  static getAllSkills() {
    const statement = db.prepare("SELECT * FROM skills ORDER BY skill_name");
    return statement.all();
  }

  static getSkillById(id) {
    const statement = db.prepare("SELECT * FROM skills WHERE id = ?");
    return statement.get(id);
  }

  static getSkillsByCategory(category) {
    const statement = db.prepare(
      "SELECT * FROM skills WHERE category = ? ORDER BY skill_name"
    );
    return statement.all(category);
  }

  static updateSkill(id, data) {
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

  static deleteSkill(id) {
    const statement = db.prepare("DELETE FROM skills WHERE id = ?");
    const info = statement.run(id);
    return info.changes > 0;
  }

  // User Skills Operations
  static addUserSkill(data) {
    const statement = db.prepare(`
      INSERT OR REPLACE INTO user_skills (user_id, skill_id, proficiency_level, years_experience, is_primary) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = statement.run(
      data.userId || data.user_id,
      data.skillId || data.skill_id,
      data.proficiencyLevel || data.proficiency_level || "beginner",
      data.yearsExperience || data.years_experience || 0,
      data.isPrimary || data.is_primary || 0
    );
    return info.lastInsertRowid;
  }

  static getUserSkills(userId) {
    const statement = db.prepare(`
      SELECT us.*, s.skill_name, s.category 
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = ?
      ORDER BY us.is_primary DESC, s.skill_name
    `);
    return statement.all(userId);
  }

  static getUserSkillsByCategory(userId, category) {
    const statement = db.prepare(`
      SELECT us.*, s.skill_name, s.category 
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = ? AND s.category = ?
      ORDER BY us.is_primary DESC, s.skill_name
    `);
    return statement.all(userId, category);
  }

  static updateUserSkill(userId, skillId, data) {
    const statement = db.prepare(`
      UPDATE user_skills 
      SET proficiency_level = COALESCE(?, proficiency_level),
          years_experience = COALESCE(?, years_experience),
          is_primary = COALESCE(?, is_primary)
      WHERE user_id = ? AND skill_id = ?
    `);
    const info = statement.run(
      data.proficiencyLevel || data.proficiency_level || null,
      data.yearsExperience || data.years_experience || null,
      data.isPrimary !== undefined
        ? data.isPrimary
          ? 1
          : 0
        : data.is_primary !== undefined
        ? data.is_primary
          ? 1
          : 0
        : null,
      userId,
      skillId
    );
    return info.changes > 0;
  }

  static removeUserSkill(userId, skillId) {
    const statement = db.prepare(
      "DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?"
    );
    const info = statement.run(userId, skillId);
    return info.changes > 0;
  }

  // Search and Filter Operations
  static searchUsersBySkill(skillName) {
    const statement = db.prepare(`
      SELECT u.*, us.proficiency_level, us.years_experience, s.skill_name, s.category
      FROM users u
      JOIN user_skills us ON u.id = us.user_id
      JOIN skills s ON us.skill_id = s.id
      WHERE s.skill_name LIKE ?
      ORDER BY 
        CASE us.proficiency_level 
          WHEN 'expert' THEN 4
          WHEN 'advanced' THEN 3
          WHEN 'intermediate' THEN 2
          WHEN 'beginner' THEN 1
          ELSE 0
        END DESC,
        us.years_experience DESC
    `);
    return statement.all(`%${skillName}%`);
  }

  static getUsersBySkillCategory(category) {
    const statement = db.prepare(`
      SELECT DISTINCT u.*, s.category
      FROM users u
      JOIN user_skills us ON u.id = us.user_id
      JOIN skills s ON us.skill_id = s.id
      WHERE s.category = ?
      ORDER BY u.full_name
    `);
    return statement.all(category);
  }

  static getSkillCategories() {
    const statement = db.prepare(`
      SELECT DISTINCT category, COUNT(*) as skill_count
      FROM skills 
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY category
    `);
    return statement.all();
  }

  static getPopularSkills(limit = 10) {
    const statement = db.prepare(`
      SELECT 
        s.skill_name,
        s.category,
        COUNT(us.user_id) as user_count,
        AVG(us.years_experience) as avg_experience
      FROM skills s
      JOIN user_skills us ON s.id = us.skill_id
      GROUP BY s.id
      ORDER BY user_count DESC
      LIMIT ?
    `);
    return statement.all(limit);
  }

  static readWithParams(query, params) {
    const statement = db.prepare(query);
    return statement.all(...params);
  }
}

export default SkillsController;
