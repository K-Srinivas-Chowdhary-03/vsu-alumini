import React, { useState, useEffect } from "react";

import axios from "axios";

import { motion } from "framer-motion";

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const isAlumni = user?.role === "Alumnus";

  const [formData, setFormData] = useState({
    name: user?.name || "",

    role: "",

    company: "",

    batchFrom: "",

    batchTo: "",

    linkedin: "",
  });

  const fetchAlumni = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/alumni`);

      setAlumni(res.data);
    } catch (err) {
      console.error("Error fetching alumni");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/alumni/save`, formData);

      alert("Profile Updated Successfully!");

      setShowForm(false);

      fetchAlumni();
    } catch (err) {
      alert("Error saving profile");
    }
  };

  if (!user) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
        <h2>Please log in to view the Alumni Directory</h2>
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-5 min-vh-100"
      style={{
        background: "linear-gradient(135deg, #001d4d 0%, #0052cc 100%)",
      }}
    >
      <div className="container mt-5 pt-4">
        <div className="d-flex justify-content-between align-items-center mb-5 text-white">
          <div>
            <h1 className="display-4 fw-bold">Alumni Connect</h1>

            <p className="lead opacity-75">
              Network with CM&CS graduates worldwide
            </p>
          </div>

          {isAlumni && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-warning rounded-pill px-4 fw-bold shadow"
            >
              {showForm ? "Close" : "Create/Edit My Profile"}
            </button>
          )}
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4 mb-5 shadow-lg border-0 rounded-4"
          >
            <form onSubmit={handleSaveProfile} className="row g-3">
              <div className="col-md-6">
                <label className="fw-bold small">Current Job Role</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Software Engineer"
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="fw-bold small">Company Name</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Google"
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="fw-bold small">Batch From</label>

                <input
                  type="number"
                  className="form-control"
                  placeholder="2018"
                  onChange={(e) =>
                    setFormData({ ...formData, batchFrom: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="fw-bold small">Batch To</label>

                <input
                  type="number"
                  className="form-control"
                  placeholder="2020"
                  onChange={(e) =>
                    setFormData({ ...formData, batchTo: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="fw-bold small">LinkedIn URL</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="linkedin.com/in/username"
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin: e.target.value })
                  }
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill fw-bold"
                >
                  Save My Alumni Profile
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="row g-4">
          {isLoading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading Alumni...</span>
              </div>
              <p className="text-white mt-3 lead opacity-75">Connecting with graduates...</p>
            </div>
          ) : alumni.length === 0 ? (
            <div className="col-12 text-center py-5">
              <p className="text-white lead opacity-50">No alumni records found.</p>
            </div>
          ) : (
            alumni.map((alumnus) => (
              <div key={alumnus._id} className="col-md-4">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="card border-0 shadow-lg p-4 h-100 rounded-4 text-center"
                >
                  <div
                    className="mx-auto mb-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="bi bi-person-fill fs-3"></i>
                  </div>

                  <h5 className="fw-bold mb-1">{alumnus.name}</h5>

                  <p className="text-primary small mb-2">
                    {alumnus.role} @ {alumnus.company}
                  </p>

                  <span className="badge bg-light text-dark mb-3">
                    Batch: {alumnus.batchFrom} - {alumnus.batchTo}
                  </span>

                  {alumnus.linkedin && (
                    <a
                      href={alumnus.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm rounded-pill w-100"
                    >
                      <i className="bi bi-linkedin me-2"></i>View LinkedIn
                    </a>
                  )}
                </motion.div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
