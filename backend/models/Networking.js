const mongoose = require("mongoose");

// --- MENTORSHIP ---
const MentorshipSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Alumni", required: true },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "Alumni", required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  message: { type: String },
  topic: { type: String, required: true }
}, { timestamps: true });



module.exports = {
  Mentorship: mongoose.model("Mentorship", MentorshipSchema),
  Event: mongoose.model("Event", EventSchema)
};
