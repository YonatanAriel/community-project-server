import { db } from "../DB.js";
import {
  parseMatchingProfileRow,
  parseMatchingProfileRows,
} from "../../BL/utils/jsonParser.js";

class MatchingProfilesController {
  static create(data) {
    const columns = ["user_id", "full_name"];
    const values = [
      data.userId || data.user_id,
      data.fullName || data.full_name,
    ];

    // Optional fields
    if (data.location) {
      columns.push("location");
      values.push(data.location);
    }
    if (data.skills) {
      columns.push("skills");
      values.push(JSON.stringify(data.skills));
    }
    if (data.interests) {
      columns.push("interests");
      values.push(JSON.stringify(data.interests));
    }
    if (data.jobTitles || data.job_titles) {
      columns.push("job_titles");
      values.push(JSON.stringify(data.jobTitles || data.job_titles));
    }
    if (data.industries) {
      columns.push("industries");
      values.push(JSON.stringify(data.industries));
    }
    if (data.summary) {
      columns.push("summary");
      values.push(data.summary);
    }
    if (data.customKeywords || data.custom_keywords) {
      columns.push("custom_keywords");
      values.push(JSON.stringify(data.customKeywords || data.custom_keywords));
    }
    if (
      data.openToConnect !== undefined ||
      data.open_to_connect !== undefined
    ) {
      columns.push("open_to_connect");
      values.push(data.openToConnect ?? data.open_to_connect ?? 1);
    }

    const statement = db.prepare(
      `INSERT INTO matching_profiles (${columns.join(", ")}) VALUES (${columns
        .map(() => "?")
        .join(", ")})`
    );
    const info = statement.run(...values);
    return info.lastInsertRowid;
  }

  static read(query = "SELECT * FROM matching_profiles") {
    const statement = db.prepare(query);
    const rows = statement.all();
    return parseMatchingProfileRows(rows);
  }

  static readOne(identifier, value) {
    const statement = db.prepare(
      `SELECT * FROM matching_profiles WHERE ${identifier} = ?`
    );
    const row = statement.get(value);
    return parseMatchingProfileRow(row);
  }

  static updateOne(data, userId) {
    const statement = db.prepare(`
      UPDATE matching_profiles SET 
        full_name = COALESCE(?, full_name),
        location = COALESCE(?, location),
        skills = COALESCE(?, skills),
        interests = COALESCE(?, interests),
        job_titles = COALESCE(?, job_titles),
        industries = COALESCE(?, industries),
        summary = COALESCE(?, summary),
        custom_keywords = COALESCE(?, custom_keywords),
        open_to_connect = COALESCE(?, open_to_connect),
        last_updated = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `);

    const info = statement.run(
      data.fullName || data.full_name || null,
      data.location || null,
      data.skills ? JSON.stringify(data.skills) : null,
      data.interests ? JSON.stringify(data.interests) : null,
      data.jobTitles
        ? JSON.stringify(data.jobTitles)
        : data.job_titles
        ? JSON.stringify(data.job_titles)
        : null,
      data.industries ? JSON.stringify(data.industries) : null,
      data.summary || null,
      data.customKeywords
        ? JSON.stringify(data.customKeywords)
        : data.custom_keywords
        ? JSON.stringify(data.custom_keywords)
        : null,
      data.openToConnect ?? data.open_to_connect ?? null,
      userId
    );
    return info.changes > 0;
  }

  static searchProfiles(searchTerm) {
    const statement = db.prepare(`
      SELECT * FROM matching_profiles 
      WHERE open_to_connect = 1 
      AND (
        full_name LIKE ? OR 
        location LIKE ? OR 
        skills LIKE ? OR 
        interests LIKE ? OR 
        job_titles LIKE ? OR 
        industries LIKE ? OR 
        summary LIKE ? OR 
        custom_keywords LIKE ?
      )
    `);
    const searchPattern = `%${searchTerm}%`;
    const rows = statement.all(
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern
    );

    return parseMatchingProfileRows(rows);
  }

  static getOpenToConnect() {
    const statement = db.prepare(
      "SELECT * FROM matching_profiles WHERE open_to_connect = 1"
    );
    const rows = statement.all();
    return parseMatchingProfileRows(rows);
  }

  static readWithParams(query, params) {
    const statement = db.prepare(query);
    const rows = statement.all(...params);
    return parseMatchingProfileRows(rows);
  }

  static delete(userId) {
    const statement = db.prepare(
      "DELETE FROM matching_profiles WHERE user_id = ?"
    );
    const info = statement.run(userId);
    return info.changes > 0;
  }
}

export default MatchingProfilesController;
