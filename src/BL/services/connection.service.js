import ConnectionRequestsController from "../../DL/controllers/ConnectionRequests.controller.js";
import UsersController from "../../DL/controllers/user.controller.js";

class ConnectionService {
  static async getConnectionRequests(userId) {
    try {
      const requests = ConnectionRequestsController.getByUserId(userId);
      return requests;
    } catch (error) {
      console.error("Error fetching connection requests:", error);
      throw error;
    }
  }

  static async sendConnectionRequest(fromUserId, toUserId, reason) {
    if (fromUserId === toUserId) {
      throw new Error("Cannot send connection request to yourself");
    }

    const existingRequest = ConnectionRequestsController.readWithParams(
      "SELECT * FROM connection_requests WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)",
      [fromUserId, toUserId, toUserId, fromUserId]
    );

    if (existingRequest.length > 0) {
      throw new Error("Connection request already exists");
    }

    const requestId = ConnectionRequestsController.create({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      reason: reason,
      status: "pending",
    });

    return ConnectionRequestsController.readOne("id", requestId);
  }

  static async acceptConnectionRequest(requestId, userId) {
    const request = ConnectionRequestsController.readOne("id", requestId);

    if (!request) {
      throw new Error("Connection request not found");
    }

    if (request.to_user_id !== userId) {
      throw new Error("Not authorized to accept this request");
    }

    if (request.status !== "pending") {
      throw new Error("Connection request already processed");
    }

    const success = ConnectionRequestsController.updateStatus(
      requestId,
      "accepted"
    );

    if (!success) {
      throw new Error("Failed to update connection request");
    }

    return ConnectionRequestsController.readOne("id", requestId);
  }

  static async rejectConnectionRequest(requestId, userId) {
    const request = ConnectionRequestsController.readOne("id", requestId);

    if (!request) {
      throw new Error("Connection request not found");
    }

    if (request.to_user_id !== userId) {
      throw new Error("Not authorized to reject this request");
    }

    if (request.status !== "pending") {
      throw new Error("Connection request already processed");
    }

    const success = ConnectionRequestsController.delete(requestId);

    if (!success) {
      throw new Error("Failed to delete connection request");
    }

    return {
      success: true,
      message: "Connection request rejected and deleted",
    };
  }

  static async getConnections(userId) {
    try {
      const connections = ConnectionRequestsController.readWithParams(
        "SELECT * FROM connection_requests WHERE (from_user_id = ? OR to_user_id = ?) AND status = 'accepted'",
        [userId, userId]
      );
      return connections;
    } catch (error) {
      console.error("Error fetching connections:", error);
      throw error;
    }
  }

  static async removeConnection(connectionId, userId) {
    const connection = ConnectionRequestsController.readOne("id", connectionId);

    if (!connection) {
      throw new Error("Connection not found");
    }

    if (
      connection.from_user_id !== userId &&
      connection.to_user_id !== userId
    ) {
      throw new Error("Not authorized to remove this connection");
    }

    const success = ConnectionRequestsController.delete(connectionId);

    if (!success) {
      throw new Error("Failed to remove connection");
    }

    return { success: true };
  }
}

export default ConnectionService;
