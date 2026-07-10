const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  passportPhoto,
} = require("../controllers/passportController");

router.post(
  "/create",
  upload.single("image"),
  passportPhoto
);

module.exports = router;