const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const Alumni = require("./models/Alumni");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminEmail = "admin@svu.com";
    const existingAdmin = await Alumni.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Admin@123", salt);

    const admin = new Alumni({
      name: "System Admin",
      email: adminEmail,
      password: hashedPassword,
      rollNumber: "ADMIN001",
      role: "Admin",
      isApproved: true
    });

    await admin.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@svu.com");
    console.log("Password: Admin@123");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
