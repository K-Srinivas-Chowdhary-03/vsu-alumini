const mongoose = require("mongoose");

// --- MENTORSHIP ---
const MentorshipSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Alumni", required: true },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "Alumni", required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  message: { type: String },
  topic: { type: String, required: true }
}, { timestamps: true });

// --- EVENTS ---
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  rsvp: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alumni" }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Alumni", required: true }
}, { timestamps: true });

// --- NEWS ---
const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Alumni", required: true }
}, { timestamps: true });

module.exports = {
  Mentorship: mongoose.model("Mentorship", MentorshipSchema),
  Event: mongoose.model("Event", EventSchema),
  News: mongoose.model("News", NewsSchema)
};
