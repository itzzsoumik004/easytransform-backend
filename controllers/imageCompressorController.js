const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

exports.imageCompressor = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const quality = Number(req.body.quality || 80);

    const inputPath = req.file.path;

    const ext = path.extname(req.file.originalname).toLowerCase();

    const outputName = Date.now() + ext;

    const outputPath = path.join(
      "uploads",
      "images",
      outputName
    );

    let image = sharp(inputPath);

    if (ext === ".png") {
      await image
        .png({
          quality,
          compressionLevel: 9,
        })
        .toFile(outputPath);
    } else if (
      ext === ".jpg" ||
      ext === ".jpeg"
    ) {
      await image
        .jpeg({
          quality,
        })
        .toFile(outputPath);
    } else if (ext === ".webp") {
      await image
        .webp({
          quality,
        })
        .toFile(outputPath);
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported image format",
      });
    }

    const originalSize = fs.statSync(inputPath).size;

    const compressedSize =
      fs.statSync(outputPath).size;

    const saved =
      originalSize - compressedSize;

    const percent =
      (
        (saved / originalSize) *
        100
      ).toFixed(2);

    res.json({
      success: true,
      file: "/uploads/images/" + outputName,
      originalSize,
      compressedSize,
      saved,
      percent,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};