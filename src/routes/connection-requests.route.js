import express from "express";
import ConnectionService from "../BL/services/connection.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const requests = await ConnectionService.getConnectionRequests(userId);
    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching connection requests",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const fromUserId = req.user?.id || 1;
    const { to_user_id, reason } = req.body;

    if (!to_user_id || !reason) {
      return res.status(400).json({
        success: false,
        message: "To user ID and reason are required",
      });
    }

    const request = await ConnectionService.sendConnectionRequest(
      fromUserId,
      to_user_id,
      reason
    );

    res.status(201).json({
      success: true,
      data: request,
      message: "Connection request sent successfully",
    });
  } catch (error) {
    if (
      error.message.includes("Cannot send connection request to yourself") ||
      error.message.includes("Connection request already exists")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error sending connection request",
    });
  }
});

router.put("/accept/:requestId", async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const requestId = parseInt(req.params.requestId);

    const updatedRequest = await ConnectionService.acceptConnectionRequest(
      requestId,
      userId
    );

    res({
      success: true,
      data: updatedRequest,
      message: "Connection request accepted successfully",
    });
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("Not authorized") ||
      error.message.includes("already processed")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error accepting connection request",
    });
  }
});

router.put("/reject/:requestId", async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const requestId = parseInt(req.params.requestId);

    await ConnectionService.rejectConnectionRequest(requestId, userId);

    res({
      success: true,
      message: "Connection request rejected and deleted successfully",
    });
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("Not authorized") ||
      error.message.includes("already processed")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error rejecting connection request",
    });
  }
});

export default router;
