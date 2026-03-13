const mongoose = require("mongoose");

const AlumniSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Remove 'required: true' from these two fields
    batchFrom: { type: String, required: false },
    batchTo: { type: String, required: false },
    role: { type: String, required: true }, // "Alumnus" or "Student"
    designation: { type: String, required: false }, // "Software Engineer", etc.
    company: { type: String, required: false }, // Make this optional too
    linkedin: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alumni", AlumniSchema);
