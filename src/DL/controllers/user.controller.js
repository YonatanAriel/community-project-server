import { db } from "../DB.js";

class UsersController {
  static create(data) {
    const columns = ["user_name", "password", "client_id", "is_active"];
    const values = [data.userName, data.password, data.clientId, 1];
    if (data.email) {
      columns.push("email");
      values.push(data.email);
    }
    if (data.photo) {
      columns.push("photo_url");
      values.push(data.photo);
    }
    if (data.preferredLanguage) {
      columns.push("preferred_language");
      values.push(data.preferredLanguage);
    }

    const statement = db.prepare(
      `INSERT INTO users (${columns.join(", ")}) VALUES (${columns.map(
        (column) => "?"
      )})`
    );
    const info = statement.run(...values);
    const rowId = info.lastInsertRowid;
    return rowId;
  }

  static read(query = "SELECT * FROM users") {
    const statement = db.prepare(query);
    const rows = statement.all();
    return rows;
  }

  static readOne(identifier, value) {
    const statement = db.prepare(`SELECT * FROM users WHERE ${identifier} = ?`);
    const row = statement.get(value);
    return row;
  }

  static updateOne(data, id) {
    const statement = db.prepare(
      "UPDATE users SET user_name = COALESCE(?, user_name), password = COALESCE(?,password), email = COALESCE(?,email), photo_url = COALESCE(?,photo_url), preferred_language = COALESCE(?,preferred_language) WHERE id = ?"
    );
    const info = statement.run(
      data.userName ?? null,
      data.password ?? null,
      data.email ?? null,
      data.photo ?? null,
      data.preferredLanguage ?? null,
      id
    );
    const hasUpdated = info.changes > 0;
    return hasUpdated;
  }

  static readWithParams(query, params) {
    const statement = db.prepare(query);
    const rows = statement.all(...params);
    return rows;
  }

  static delete(id) {
    const statement = db.prepare("UPDATE users SET is_active = 0 WHERE id = ?");
    const info = statement.run(id);
    const hasDeleted = info.changes > 0;
    return hasDeleted;
  }
}

export default UsersController;
