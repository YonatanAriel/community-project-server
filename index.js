import express from "express";
import { db, initializeDB } from "./src/DL/DB.js";
import { config } from "dotenv";
import cors from "cors";
import userRoutes from "./src/routes/user.route.js";
import UsersController from "./src/DL/controllers/user.controller.js";

const app = express();
const dotenv = config();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

initializeDB();

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`i'm listening, http://localhost:${PORT}/`);
});

// app.get("/", (req, res) => {
//   res.send("hello world!!!");
// });
