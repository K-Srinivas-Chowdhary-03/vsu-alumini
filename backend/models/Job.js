const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    postedBy: { type: String, required: true }, // Name of the Alumnus
    link: { type: String }, // Application link
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
