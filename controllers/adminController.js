const Admin = require("../models/Admin");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =======================
// Admin Login
// =======================

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    res.json({
      success: true,
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// =======================
// Dashboard Statistics
// =======================

exports.getDashboard = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    const totalAdmins = await Admin.countDocuments();

    res.json({
      success: true,

      stats: {
        totalUsers,
        totalAdmins,

        pdfConversions: 0,
        imageConversions: 0,
        totalConversions: 0,
      },

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// =======================
// Get All Users
// =======================

exports.getAllUsers = async (req, res) => {
  try {

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: users.length,
      users,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// =======================
// Delete User
// =======================

exports.deleteUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// =======================
// Dashboard Profile
// =======================

exports.getProfile = async (req, res) => {

  res.json({
    success: true,
    admin: req.admin,
  });

};