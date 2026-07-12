const fs = require("fs");
const express = require("express");
const multer = require("multer");
const csv = require("csvtojson");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No CSV file uploaded.",
      });
    }

    // First read the CSV
    const rows = await csv().fromFile(req.file.path);

    // Then delete the uploaded file
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.error("Failed to delete uploaded file:", err);
    }

    res.json({
      success: true,
      totalRows: rows.length,
      preview: rows.slice(0, 10),
      allRows: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
