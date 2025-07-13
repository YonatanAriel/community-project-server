import express from "express";
import { db, initializeDB } from "./src/DL/DB";
import { config } from "dotenv";

const app = express();
const dotenv = config();
const PORT = process.env.PORT || 4001;

app.use(require("cors")());
app.use(express.json());

const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
  },
});

initializeDB();

app.use("/users", require("./src/routes/users.route"));

httpServer.listen(PORT, () => {
  console.log(`i'm listening, http://localhost:${PORT}/`);
});

// app.get("/", (req, res) => {
//   res.send("hello world!!!");
// });
