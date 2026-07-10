const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  imageResizer,
} = require("../controllers/imageResizerController");

router.post(
  "/resize",
  upload.single("image"),
  imageResizer
);

module.exports = router;