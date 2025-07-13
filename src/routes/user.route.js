import express from "express";
import usersServices from "../BL/services/users.service";
const router = express.Router();
// const {verify} = require("../auth")

router.get("/", (req, res) => {
  try {
    const allUsers = usersServices.getAllUsers();
    res.send(allUsers);
  } catch (err) {
    res.sendStatus(400).send(err);
  }
});

router.post("/sign-in", (req, res) => {
  try {
    const response = usersServices.signIn(req.body);
    res.send(response);
  } catch (err) {
    res.sendStatus(400).send(err);
  }
});

router.post("/sign-up", upload.single("photo"), async (req, res) => {
  try {
    const photoPath = req.file?.path;
    const response = await usersServices.signUp(req.body, photoPath);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(400).send(err);
  }
});

module.exports = router;
