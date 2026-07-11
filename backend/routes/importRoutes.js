const express = require("express");
const router = express.Router();

const { importLeads } = require("../controllers/importController");

router.post("/", importLeads);

module.exports = router;
