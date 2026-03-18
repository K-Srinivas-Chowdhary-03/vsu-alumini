const mongoose = require("mongoose");

const AlumniSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    batchFrom: { type: String, required: false },
    batchTo: { type: String, required: false },
    role: { 
      type: String, 
      required: true, 
      enum: ["Admin", "Alumnus", "Student"],
      default: "Student"
    },
    isApproved: { type: Boolean, default: false },
    designation: { type: String, default: "" },
    company: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    bio: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    phone: { type: String, default: "" },
    privacySettings: {
      showEmail: { type: Boolean, default: true },
      showPhone: { type: Boolean, default: false },
    }
  },
  { timestamps: true }
);

AlumniSchema.index({ company: 1 });
AlumniSchema.index({ batchFrom: 1 });

module.exports = mongoose.model("Alumni", AlumniSchema);
