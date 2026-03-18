const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
const { Mentorship, Event, News } = require("./models/Networking");
const { verifyToken, authorizeRoles } = require("./middleware/authMiddleware");

// --- ROUTES (REGISTRATION) ---
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role, company, isAlumni, rollNumber } = req.body;
    if (!name || !email || !password || !rollNumber) {
      return res.status(400).json({ error: "Please fill all required fields (Name, Email, Password, Roll Number)." });
    }

    const existingUser = await Alumni.findOne({ $or: [{ email }, { rollNumber }] });
    if (existingUser) return res.status(400).json({ error: "User with this email or roll number already exists." });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Alumni({
      name,
      email,
      password: hashedPassword,
      rollNumber,
      batchTo: "Not Specified",
      role:
        isAlumni === true || isAlumni === "true" || (role && role !== "Student")
          ? "Alumnus"
          : "Student",
      designation: role,
      company: company || "Not specified",
      isApproved: true, // Auto-approved
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successful! You can now log in." });
  } catch (err) {
    res.status(500).json({ error: "Database Error: " + err.message });
  }
});

// --- LOGIN ROUTE ---
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Alumni.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      if (password !== user.password) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "SVU_SECRET_KEY",
      { expiresIn: "1h" },
    );
    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role, id: user._id },
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

// --- ALUMNI ROUTES ---
app.get("/api/alumni", async (req, res) => {
  try {
    const { name, batch, company } = req.query;
    let query = { role: "Alumnus", isApproved: true };

    if (name) query.name = { $regex: name, $options: "i" };
    if (batch) query.$or = [{ batchFrom: batch }, { batchTo: batch }];
    if (company) query.company = { $regex: company, $options: "i" };

    const alumni = await Alumni.find(query).sort({ name: 1 });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alumni: " + err.message });
  }
});

app.post("/api/alumni/save", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Don't allow updating sensitive fields via this route
    delete updateData.password;
    delete updateData.email;
    delete updateData.role;
    delete updateData.isApproved;

    const user = await Alumni.findByIdAndUpdate(userId, updateData, { new: true });
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile: " + err.message });
  }
});

app.get("/api/alumni/profile/:id", async (req, res) => {
  try {
    const user = await Alumni.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- ADMIN ROUTES ---
app.get("/api/admin/pending", verifyToken, authorizeRoles("Admin"), async (req, res) => {
  try {
    const pendingUsers = await Alumni.find({ isApproved: false }).sort({ createdAt: -1 });
    res.json(pendingUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending users" });
  }
});

app.patch("/api/admin/approve/:id", verifyToken, authorizeRoles("Admin"), async (req, res) => {
  try {
    const user = await Alumni.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ message: `User ${user.name} approved successfully`, user });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve user" });
  }
});

app.patch("/api/admin/reject/:id", verifyToken, authorizeRoles("Admin"), async (req, res) => {
  try {
    await Alumni.findByIdAndDelete(req.params.id);
    res.json({ message: "User registration rejected and removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject user" });
  }
});

// --- MENTORSHIP ROUTES ---
app.post("/api/mentorship/request", verifyToken, async (req, res) => {
  try {
    const { mentorId, topic, message } = req.body;
    const request = new Mentorship({
      mentorId,
      menteeId: req.user.id,
      topic,
      message
    });
    await request.save();
    res.status(201).json({ message: "Mentorship request sent!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send request" });
  }
});

app.get("/api/mentorship/my-requests", verifyToken, async (req, res) => {
  try {
    const requests = await Mentorship.find({ 
      $or: [{ mentorId: req.user.id }, { menteeId: req.user.id }] 
    }).populate("mentorId menteeId", "name email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// --- EVENT ROUTES ---
app.post("/api/events", verifyToken, authorizeRoles("Admin", "Alumnus"), async (req, res) => {
  try {
    const event = new Event({ ...req.body, postedBy: req.user.id });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// --- NEWS ROUTES ---
app.post("/api/news", verifyToken, authorizeRoles("Admin"), async (req, res) => {
  try {
    const news = new News({ ...req.body, postedBy: req.user.id });
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ error: "Failed to post news" });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// app.listen moved to startServer function
