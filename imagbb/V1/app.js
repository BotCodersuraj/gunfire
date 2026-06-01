const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());

// Create uploads folder if not exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Multer setup
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// HOME ROUTE
app.get("/", (req, res) => {
    res.send("IMAGE UPLOADER API IS RUNNING 🚀");
});

// UPLOAD API (ImgBB style)
app.post("/upload", upload.single("image"), (req, res) => {

    if (!req.file) {
        return res.json({
            success: false,
            message: "NO FILE SELECTED"
        });
    }

    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.json({
        success: true,
        url: url
    });

});

// START SERVER
const PORT = 3000;
app.listen(PORT, () => {
    console.log("SERVER RUNNING ON PORT", PORT);
});