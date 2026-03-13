const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Connection State:', mongoose.connection.readyState); // 1 = connected
  next();
});

const startServer = async () => {
  try {
    // Debug events
    mongoose.connection.on('connected', () => console.log('Mongoose event: connected'));
    mongoose.connection.on('open', () => console.log('Mongoose event: open'));
    mongoose.connection.on('disconnected', () => console.log('Mongoose event: disconnected'));
    mongoose.connection.on('reconnected', () => console.log('Mongoose event: reconnected'));
    mongoose.connection.on('disconnecting', () => console.log('Mongoose event: disconnecting'));
    mongoose.connection.on('close', () => console.log('Mongoose event: close'));

    console.log("Attempting to connect to:", process.env.MONGO_URI.replace(/:([^:@]+)@/, ":****@"));

    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ SUCCESS: Connected to MongoDB Atlas");
    
    // Check connection state explicitly
    console.log("Initial Connection State:", mongoose.connection.readyState); 

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MONGODB CONNECTION FATAL ERROR:");
    console.error(err);
    process.exit(1);
  }
};

startServer();

// --- MODELS ---
const Alumni = require("./models/Alumni");
const Job = require("./models/Job");
const { verifyToken, authorizeRoles } = require("./middleware/authMiddleware");

// --- ROUTES (REGISTRATION) ---
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role, company, isAlumni } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill all fields." });
    }

    const existingUser = await Alumni.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email exists." });

    const newUser = new Alumni({
      name,
      email,
      password,
      batchTo: "Not Specified",
      role:
        isAlumni === true || isAlumni === "true" || (role && role !== "Student")
          ? "Alumnus"
          : "Student",
      designation: role,
      company: company || "Not specified",
    });

    await newUser.save();
    res.status(201).json({ message: "Account created!" });
  } catch (err) {
    res.status(500).json({ error: "Database Error: " + err.message });
  }
});

// --- LOGIN ROUTE ---
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Alumni.findOne({ email });
    if (!user || password !== user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "SVU_SECRET_KEY",
      { expiresIn: "1h" },
    );
    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- JOB ROUTES ---
app.post("/api/jobs/post", verifyToken, async (req, res) => {
  try {
    const { title, company, location, description, postedBy, link } = req.body;
    
    // Create new job
    const newJob = new Job({
      title,
      company,
      location,
      description,
      postedBy,
      link
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to post job: " + err.message });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    // Fetch all jobs, sorted by newest first
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs: " + err.message });
  }
});

// app.listen moved to startServer function
