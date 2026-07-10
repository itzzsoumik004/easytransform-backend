const sharp = require("sharp");
const path = require("path");

exports.imageConverter = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const { format, quality } = req.body;

    const inputPath = req.file.path;

    const outputName =
      Date.now() + "." + format;

    const outputPath =
      path.join(
        "uploads",
        "images",
        outputName
      );

    let image = sharp(inputPath);

    switch (format) {
      case "png":
        await image.png().toFile(outputPath);
        break;

      case "jpg":
      case "jpeg":
        await image
          .jpeg({
            quality: Number(quality || 90),
          })
          .toFile(outputPath);
        break;

      case "webp":
        await image
          .webp({
            quality: Number(quality || 90),
          })
          .toFile(outputPath);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Unsupported format",
        });
    }

    res.json({
      success: true,
      file: "/uploads/images/" + outputName,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};