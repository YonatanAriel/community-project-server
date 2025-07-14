import { config } from "dotenv";
import { db, initializeDB } from "./src/DL/DB.js";
import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/user.route.js";
import authRoutes from "./src/routes/auth.route.js";
import UsersController from "./src/DL/controllers/user.controller.js";
import axios from "axios";

const app = express();
const dotenv = config();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

initializeDB();

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`i'm listening, http://localhost:${PORT}/`);
});

app.get("/", (req, res) => {
  res.send("hello world!!!");
});
