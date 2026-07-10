const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

exports.removeBackground = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const inputPath = req.file.path;

    const outputName = Date.now() + ".png";

    const outputPath = path.join(
      __dirname,
      "../uploads/images",
      outputName
    );

    const formData = new FormData();

    formData.append(
      "image_file",
      fs.createReadStream(inputPath)
    );

    formData.append("size", "auto");

    const response = await axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: formData,
      responseType: "arraybuffer",
      headers: {
        ...formData.getHeaders(),
        "X-Api-Key":
          process.env.REMOVE_BG_API_KEY,
      },
    });

    fs.writeFileSync(
      outputPath,
      response.data
    );

    res.json({
      success: true,
      file: "/uploads/images/" + outputName,
    });

  } catch (err) {

    console.log(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      message: "Background removal failed",
    });

  }
};