import express from "express";
import usersServices from "../BL/services/user.service.js";
import { authenticateToken, requireAdmin } from "../BL/utils/auth.js";

const router = express.Router();

router.get("/", authenticateToken, requireAdmin, (req, res) => {
  try {
    const allUsers = usersServices.getAllUsers();
    res.json(allUsers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/sign-in", (req, res) => {
  try {
    const response = usersServices.signIn(req.body);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/full-data", authenticateToken, requireAdmin, (req, res) => {
  try {
    const profiles = usersServices.getUserProfiles();
    res.json(profiles);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
