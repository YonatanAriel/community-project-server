import express from "express";
import XLSX from "xlsx";

const router = express.Router();

router.post("/upload", async (req, res) => {
  try {
    const { fileName, fileData } = req.body;
    if (!fileName || !fileData) {
      return res.status(400).json({ error: "Missing file data" });
    }

    // 1. Decode base64 to Buffer
    const buffer = Buffer.from(fileData, "base64");

    // 2. Parse the file with XLSX (can handle .xlsx, .xls, .csv)
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "",
    });

    // Optional: אפשר לעשות עיבוד/שמירה ל־DB פה

    res.json({ success: true, parsedData: data });
  } catch (err) {
    console.log("Error in excel upload:", err);
    res.status(500).json({ error: "Error processing file" });
  }
});

export default router;
