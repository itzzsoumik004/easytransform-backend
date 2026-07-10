const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

exports.imageResizer = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const width = Number(req.body.width);
    const height = Number(req.body.height);

    const input = req.file.path;

    const ext = path.extname(
      req.file.originalname
    );

    const output =
      Date.now() + ext;

    const outputPath = path.join(
      "uploads",
      "images",
      output
    );

    await sharp(input)
      .resize(width, height)
      .toFile(outputPath);

    const original =
      fs.statSync(input).size;

    const resized =
      fs.statSync(outputPath).size;

    res.json({
      success: true,
      file: "/uploads/images/" + output,
      originalSize: original,
      resizedSize: resized,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};