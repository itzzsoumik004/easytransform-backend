const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  try {

    const exists = await Admin.findOne({
      email: "admin@easytransform.com",
    });

    if (exists) {
      console.log("Admin already exists");
      process.exit();
    }

    await Admin.create({
      name: "Administrator",
      email: "admin@easytransform.com",
      password: "Admin@123",
    });

    console.log("✅ Admin Created Successfully");

    process.exit();

  } catch (err) {

    console.log(err);

    process.exit();

  }
}

createAdmin();