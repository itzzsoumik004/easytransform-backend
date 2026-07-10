const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  imageCompressor,
} = require("../controllers/imageCompressorController");

router.post(
  "/compress",
  upload.single("image"),
  imageCompressor
);

module.exports = router;