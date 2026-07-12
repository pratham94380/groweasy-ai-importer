require("dotenv").config();

const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const importRoutes = require("./routes/importRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoutes);
app.use("/import", importRoutes);

app.get("/", (req, res) => {
    res.json({
    success: true,
    message: "GrowEasy AI CSV Importer Backend Running",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
