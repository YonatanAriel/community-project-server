import express from "express";
import ConnectionService from "../BL/services/connection.service.js";
import { authenticateToken } from "../BL/utils/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const connections = await ConnectionService.getConnections(userId);
    res.json({
      success: true,
      data: connections,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching connections",
    });
  }
});

router.delete("/remove/:connectionId", async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.connectionId);

    await ConnectionService.removeConnection(connectionId, userId);

    res({
      success: true,
      message: "Connection removed successfully",
    });
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("Not authorized")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error removing connection",
    });
  }
});

export default router;
