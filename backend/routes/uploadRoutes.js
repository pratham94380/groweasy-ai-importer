const express = require("express");
const multer = require("multer");
const csv = require("csvtojson");

const router = express.Router();

const upload = multer({
    dest: "uploads/",
});

router.post("/", upload.single("file"), async (req, res) => {
    try {
        const rows = await csv().fromFile(req.file.path);

        res.json({
        success: true,
        totalRows: rows.length,
        preview: rows.slice(0, 10),
        });
    } catch (err) {
        res.status(500).json({
        success: false,
        message: err.message,
        });
    }
});

module.exports = router;
