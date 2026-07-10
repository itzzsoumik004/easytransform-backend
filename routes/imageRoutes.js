const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  imageConverter,
} = require("../controllers/imageController");

// Image Converter
router.post(
  "/convert",
  upload.single("image"),
  imageConverter
);

module.exports = router;