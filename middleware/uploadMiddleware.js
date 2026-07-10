const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload folders
const imageDir = "uploads/images";
const pdfDir = "uploads/pdfs";
const wordDir = "uploads/words";

[imageDir, pdfDir, wordDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, imageDir);
    } else if (file.mimetype === "application/pdf") {
      cb(null, pdfDir);
    } else if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword"
    ) {
      cb(null, wordDir);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images, PDFs, and Word files are allowed."));
  }
};

module.exports = multer({
  storage,
  fileFilter,
});