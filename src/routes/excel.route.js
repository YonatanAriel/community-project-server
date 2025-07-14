import multer from "multer";
import express from "express";
const router = express.Router();
router.post("/upload", (req, res) => {
  try {
    console.log("Excel sign-in request received");
  } catch (err) {
    console.log("Error in excel sign-in:", err);
  }
});
export default router;
