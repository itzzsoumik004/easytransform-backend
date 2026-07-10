const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const imageResizerRoutes = require("./routes/imageResizerRoutes");
const backgroundRemoverRoutes = require("./routes/backgroundRemoverRoutes");
const connectDB = require("./config/db");
const passportRoutes = require("./routes/passportRoutes");
const authRoutes = require("./routes/authRoutes");
const convertRoutes = require("./routes/convertRoutes");
const imageRoutes = require("./routes/imageRoutes");
const adminRoutes = require("./routes/adminRoutes");
const imageCompressorRoutes = require("./routes/imageCompressorRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/download/:folder/:file", (req, res) => {
  const filePath = path.join(
    __dirname,
    "uploads",
    req.params.folder,
    req.params.file
  );

  res.download(filePath);
});
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/convert", convertRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/image-compressor", imageCompressorRoutes);
app.use(
  "/api/image-resizer",
  imageResizerRoutes
);
app.use(
  "/api/background",
  backgroundRemoverRoutes
);
app.use(
  "/api/passport",
  passportRoutes
);

app.get("/", (req, res) => {
  res.json({
    message: "EasyTransform Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});