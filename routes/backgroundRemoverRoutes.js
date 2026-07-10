const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  removeBackground,
} = require("../controllers/backgroundRemoverController");

router.post(
  "/remove",
  upload.single("image"),
  removeBackground
);

module.exports = router;