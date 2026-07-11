const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoutes);

app.get("/", (req, res) => {
    res.json({
    success: true,
    message: "GrowEasy AI CSV Importer Backend Running",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
