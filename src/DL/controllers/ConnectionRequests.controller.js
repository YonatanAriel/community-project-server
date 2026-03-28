import { db } from "../DB.js";

class ConnectionRequestsController {
  static create(data) {
    const columns = ["from_user_id", "to_user_id"];
    const values = [
      data.fromUserId || data.from_user_id,
      data.toUserId || data.to_user_id,
    ];

    // Optional fields
    if (data.reason) {
      columns.push("reason");
      values.push(data.reason);
    }
    if (data.status) {
      columns.push("status");
      values.push(data.status);
    } else {
      columns.push("status");
      values.push("pending"); // Default status
    }

    const statement = db.prepare(
      `INSERT INTO connection_requests (${columns.join(", ")}) VALUES (${columns
        .map(() => "?")
        .join(", ")})`
    );
    const info = statement.run(...values);
    return info.lastInsertRowid;
  }

  static read(query = "SELECT * FROM connection_requests") {
    const statement = db.prepare(query);
    return statement.all();
  }

  static readOne(identifier, value) {
    const statement = db.prepare(
      `SELECT * FROM connection_requests WHERE ${identifier} = ?`
    );
    return statement.get(value);
  }

  static updateOne(data, id) {
    const statement = db.prepare(`
      UPDATE connection_requests SET 
        from_user_id = COALESCE(?, from_user_id),
        to_user_id = COALESCE(?, to_user_id),
        reason = COALESCE(?, reason),
        status = COALESCE(?, status),
        responded_at = CASE WHEN ? IS NOT NULL THEN CURRENT_TIMESTAMP ELSE responded_at END
      WHERE id = ?
    `);

    const info = statement.run(
      data.fromUserId || data.from_user_id || null,
      data.toUserId || data.to_user_id || null,
      data.reason || null,
      data.status || null,
      data.status || null, // For the CASE WHEN condition
      id
    );
    return info.changes > 0;
  }

  static updateStatus(id, status) {
    const statement = db.prepare(`
      UPDATE connection_requests 
      SET status = ?, responded_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    const info = statement.run(status, id);
    return info.changes > 0;
  }

  static getByUserId(userId) {
    const statement = db.prepare(`
      SELECT cr.*, 
             u1.full_name as from_user_name,
             u2.full_name as to_user_name
      FROM connection_requests cr
      JOIN users u1 ON cr.from_user_id = u1.id
      JOIN users u2 ON cr.to_user_id = u2.id
      WHERE cr.from_user_id = ? OR cr.to_user_id = ?
    `);
    return statement.all(userId, userId);
  }

  static getRequestsByStatus(status) {
    const statement = db.prepare(
      "SELECT * FROM connection_requests WHERE status = ?"
    );
    return statement.all(status);
  }

  static readWithParams(query, params) {
    const statement = db.prepare(query);
    return statement.all(...params);
  }

  static delete(id) {
    const statement = db.prepare(
      "DELETE FROM connection_requests WHERE id = ?"
    );
    const info = statement.run(id);
    return info.changes > 0;
  }
}

export default ConnectionRequestsController;
