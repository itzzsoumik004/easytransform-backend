const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  try {

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token",
      });
    }

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    req.admin = await Admin.findById(decoded.id).select("-password");

    next();

  } catch (err) {

    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });

  }
};