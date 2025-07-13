import express from "express";
import usersServices from "../BL/services/user.service.js";
const router = express.Router();

router.get("/", (req, res) => {
  try {
    const allUsers = usersServices.getAllUsers();
    res.send(allUsers);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/sign-in", (req, res) => {
  try {
    const response = usersServices.signIn(req.body);
    res.send(response);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/sign-up", async (req, res) => {
  try {
    const response = await usersServices.signUp(req.body);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

export default router;
