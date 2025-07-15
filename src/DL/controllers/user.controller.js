import { db } from "../DB.js";

class UsersController {
  static create(data) {
    const columns = ["full_name", "email"];
    const values = [data.fullName || data.full_name, data.email];

    // Optional fields from your model
    if (data.linkedinUrl || data.linkedin_url) {
      columns.push("linkedin_url");
      values.push(data.linkedinUrl || data.linkedin_url);
    }
    if (data.profileImageUrl || data.profile_image_url) {
      columns.push("profile_image_url");
      values.push(data.profileImageUrl || data.profile_image_url);
    }
    if (data.isAdmin !== undefined || data.is_admin !== undefined) {
      columns.push("is_admin");
      values.push(data.isAdmin ?? data.is_admin ?? 0);
    }

    const statement = db.prepare(
      `INSERT INTO users (${columns.join(", ")}) VALUES (${columns
        .map(() => "?")
        .join(", ")})`
    );
    const info = statement.run(...values);
    return info.lastInsertRowid;
  }

  static read(query = "SELECT * FROM users") {
    const statement = db.prepare(query);
    return statement.all();
  }

  static readOne(identifier, value) {
    const statement = db.prepare(`SELECT * FROM users WHERE ${identifier} = ?`);
    return statement.get(value);
  }

  static updateOne(data, id) {
    const statement = db.prepare(`
      UPDATE users SET 
        full_name = COALESCE(?, full_name),
        email = COALESCE(?, email),
        linkedin_url = COALESCE(?, linkedin_url),
        profile_image_url = COALESCE(?, profile_image_url),
        is_admin = COALESCE(?, is_admin)
      WHERE id = ?
    `);

    const info = statement.run(
      data.fullName || data.full_name || null,
      data.email || null,
      data.linkedinUrl || data.linkedin_url || null,
      data.profileImageUrl || data.profile_image_url || null,
      data.isAdmin ?? data.is_admin ?? null,
      id
    );
    return info.changes > 0;
  }

  static readWithParams(query, params) {
    const statement = db.prepare(query);
    return statement.all(...params);
  }

  static delete(id) {
    const statement = db.prepare("DELETE FROM users WHERE id = ?");
    const info = statement.run(id);
    return info.changes > 0;
  }
}

export default UsersController;
