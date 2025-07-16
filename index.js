import { config } from "dotenv";
import { db, initializeDB } from "./src/DL/DB.js";
import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/user.route.js";
import authRoutes from "./src/routes/auth.route.js";
import aiRecommendationsRoutes from "./src/routes/ai-recommendations.route.js";
import connectionRequestsRoutes from "./src/routes/connection-requests.route.js";
import connectionsRoutes from "./src/routes/connections.route.js";
import UsersController from "./src/DL/controllers/user.controller.js";
import axios from "axios";

const app = express();
const dotenv = config();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

initializeDB();

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/ai-recommendations", aiRecommendationsRoutes);
app.use("/api/connection-requests", connectionRequestsRoutes);
app.use("/api/connections", connectionsRoutes);

app.listen(PORT, () => {
  console.log(`i'm listening, http://localhost:${PORT}/`);
});

app.get("/", (req, res) => {
  res.send("hello world!!!");
});
