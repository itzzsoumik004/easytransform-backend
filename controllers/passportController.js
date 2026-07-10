const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

exports.passportPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const width = Number(req.body.width);
    const height = Number(req.body.height);
    const background = req.body.background || "white";

    const inputPath = req.file.path;

    const fileName = Date.now() + ".jpg";

    const outputPath = path.join(
      __dirname,
      "../uploads/images",
      fileName
    );

    // Background color
    let bg = { r: 255, g: 255, b: 255, alpha: 1 };

    if (background === "blue") {
      bg = { r: 135, g: 206, b: 235, alpha: 1 };
    }

    if (background === "red") {
      bg = { r: 255, g: 0, b: 0, alpha: 1 };
    }

    // Resize uploaded image
    const resizedImage = await sharp(inputPath)
      .resize(width, height, {
        fit: "cover",
      })
      .jpeg({ quality: 100 })
      .toBuffer();

    // Create passport canvas
    await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: bg,
      },
    })
      .composite([
        {
          input: resizedImage,
          top: 0,
          left: 0,
        },
      ])
      .jpeg({ quality: 100 })
      .toFile(outputPath);

    const size = fs.statSync(outputPath).size;

    res.json({
      success: true,
      file: "/uploads/images/" + fileName,
      size,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};