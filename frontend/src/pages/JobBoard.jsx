import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomDialog from "../components/CustomDialog";
import axios from "axios";
import LogoutButton from "./LogoutButton";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dialog, setDialog] = useState({ isOpen: false, title: "", message: "", type: "success" });

  // 1. Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // 2. Flexible Role Check: Check for "Alumnus" or "alumni" (case-insensitive)
  const isAlumni =
    user?.role?.toLowerCase() === "alumnus" ||
    user?.role?.toLowerCase() === "alumni";

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    postedBy: user ? user.name : "Anonymous",
    link: "",
  });

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`);
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // Ensure postedBy is updated with latest user name
      const jobData = { ...formData, postedBy: user?.name || "Anonymous" };
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/jobs/post`, jobData, {
        headers: { Authorization: token },
      });
      setDialog({ isOpen: true, title: "Success", message: "Job Posted Successfully!", type: "success" });
      setFormData({
        title: "",
        company: "",
        location: "",
        description: "",
        postedBy: user?.name || "Anonymous",
        link: "",
      });
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      console.error("Job Post Error:", err.response?.data || err.message);
      setDialog({ isOpen: true, title: "Error", message: err.response?.data?.error || "Error posting job", type: "error" });
    }
  };

  return (
    <div
      className="container-fluid py-5 min-vh-100"
      style={{
        background: "linear-gradient(135deg, #001d4d 0%, #0052cc 100%)",
      }}
    >
      <div className="container mt-5 pt-4">
        <LogoutButton />
        <div className="d-flex justify-content-between align-items-center mb-5 text-white">
          <div>
            <h1 className="display-4 fw-bold">VSU-Kavali Job Board</h1>
            <p className="lead opacity-75">
              Hiring opportunities for VSU-Kavali Students
            </p>
          </div>

          {/* Logic: Only show Post button to Alumni. Students see a 'View Only' badge */}
          {user ? (
            isAlumni ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn btn-warning rounded-pill px-4 fw-bold shadow"
              >
                {showForm ? "Close Form" : "Post a Job"}
              </button>
            ) : (
              <div className="bg-white bg-opacity-25 p-2 rounded-pill px-3 small border border-white">
                Logged in as: <strong>{user?.role || "Guest"}</strong> (View Only Access)
              </div>
            )
          ) : (
            <div className="text-warning fw-bold bg-dark bg-opacity-25 p-2 rounded-pill px-3">
              Please Log in to participate
            </div>
          )}
        </div>

        {/* Form only renders if showForm is true AND user is Alumni */}
        {showForm && isAlumni && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 p-4 mb-5 shadow-lg"
            style={{
              borderRadius: "25px",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <h3 className="text-primary fw-bold mb-4">
              Post Latest Job Update
            </h3>
            <form onSubmit={handlePost} className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Job Title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company"
                  required
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  value={formData.postedBy}
                  readOnly
                />
              </div>
              <div className="col-12">
                <textarea
                  className="form-control"
                  placeholder="Job Description & Requirements"
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="col-12">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Application Link (URL)"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill fw-bold py-2"
                >
                  Publish Job Update
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="row g-4">
          {isLoading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading Jobs...</span>
              </div>
              <p className="text-white mt-3 lead opacity-75">Fetching latest opportunities...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="col-12 text-center py-5">
              <p className="text-white lead opacity-50">No jobs posted yet.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="col-lg-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card border-0 shadow-lg p-4 h-100"
                  style={{
                    borderRadius: "25px",
                    background: "rgba(255, 255, 255, 0.12)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="fw-bold mb-1 text-warning">{job.title}</h3>
                      <h5>
                        {job.company} •{" "}
                        <span className="small opacity-75">{job.location}</span>
                      </h5>
                    </div>
                    <span className="badge bg-primary px-3 py-2 rounded-pill">
                      Active
                    </span>
                  </div>
                  <p className="mt-3 opacity-90">{job.description}</p>
                  <hr className="bg-white opacity-25" />
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="small text-white-50">
                      Posted by <strong>{job.postedBy}</strong>
                    </span>
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-warning btn-sm rounded-pill px-4 fw-bold shadow-sm"
                    >
                      Apply Now
                    </a>
                  </div>
                </motion.div>
              </div>
            ))
          )}
        </div>
      </div>
      <CustomDialog 
        isOpen={dialog.isOpen} 
        title={dialog.title} 
        message={dialog.message} 
        type={dialog.type} 
        onClose={() => setDialog({ ...dialog, isOpen: false })} 
      />
    </div>
  );
};

export default JobBoard;
