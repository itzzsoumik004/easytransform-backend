const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  imageToPdf,
  pdfToWord,
  wordToPdf,
  mergePdf,
  splitPdf,
  compressPdf,
} = require("../controllers/convertController");
// Image → PDF
router.post(
  "/image-to-pdf",
  upload.array("images", 20),
  imageToPdf
);

// PDF → Word
router.post(
  "/pdf-to-word",
  upload.single("file"),
  pdfToWord
);

// Word → PDF
router.post(
  "/word-to-pdf",
  upload.single("file"),
  wordToPdf
);
// Merge PDF
router.post(
  "/merge-pdf",
  upload.array("files", 20),
  mergePdf
);
router.post(
  "/split-pdf",
  upload.single("pdf"),
  splitPdf
);
// Compress PDF
router.post(
  "/compress-pdf",
  upload.single("pdf"),
  compressPdf
);

module.exports = router;