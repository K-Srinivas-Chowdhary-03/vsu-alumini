import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const initialAlumni = [];

const AlumniDirectory = () => {
  const [alumniList, setAlumniList] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    batch: "",
    company: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isAlumni =
    user?.role?.toLowerCase() === "alumnus" ||
    user?.role?.toLowerCase() === "alumni";

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const { name, batch, company } = filters;
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/alumni`, {
        params: { name, batch, company }
      });
      setAlumniList(res.data);
    } catch (err) {
      console.error("Error fetching alumni", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [filters]);

  const handleUpdate = (field, value) => {
    setSelectedAlumni({ ...selectedAlumni, [field]: value });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/alumni/save`, selectedAlumni, {
        headers: { Authorization: token }
      });
      alert("Profile updated successfully!");
      setIsEditing(false);
      fetchAlumni();
    } catch (err) {
      alert("Failed to update profile: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
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
        <AnimatePresence mode="wait">
          {!selectedAlumni ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-5 text-white">
                <h1 className="display-4 fw-bold">VSU-Kavali Alumni Portal</h1>
                {isAlumni && (
                  <button 
                    onClick={() => {
                      const newProfile = {
                        id: Date.now(),
                        name: "Your Name",
                        from: "2020",
                        to: "2024",
                        role: "Your Role",
                        company: "Your Company",
                        image: "https://ui-avatars.com/api/?name=New+User&background=0D6EFD&color=fff",
                        linkedin: "https://linkedin.com/in/yourprofile"
                      };
                      setAlumniList([newProfile, ...alumniList]);
                      setSelectedAlumni(newProfile);
                      setIsEditing(true);
                      setSearchTerm("");
                    }}
                    className="btn btn-success rounded-pill px-4 fw-bold shadow mb-4"
                  >
                    + Add My Profile
                  </button>
                )}
                <div className="row g-2 w-75 mx-auto">
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control rounded-pill border-0 shadow py-3 px-4"
                      placeholder="Name..."
                      value={filters.name}
                      onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control rounded-pill border-0 shadow py-3 px-4"
                      placeholder="Batch (Year)..."
                      value={filters.batch}
                      onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control rounded-pill border-0 shadow py-3 px-4"
                      placeholder="Company..."
                      value={filters.company}
                      onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="row g-4">
                {filteredAlumni.map((alumni) => (
                  <div key={alumni.id} className="col-lg-6 col-xl-4">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="card border-0 shadow-lg p-4 h-100"
                      style={{
                        borderRadius: "25px",
                        background: "rgba(255, 255, 255, 0.12)",
                        backdropFilter: "blur(10px)",
                        color: "white",
                      }}
                    >
                      <div className="d-flex align-items-center gap-4">
                        <img
                          src={alumni.image}
                          className="rounded-circle border border-3 border-warning"
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover",
                          }}
                          alt=""
                        />
                        <div className="text-start">
                          <h5 className="fw-bold mb-0">{alumni.name}</h5>
                          <p className="text-warning small mb-1 fw-bold">
                            Batch: {alumni.from}-{alumni.to}
                          </p>
                          <p className="small opacity-75 mb-2">
                            {alumni.role} at {alumni.company}
                          </p>
                          <button
                            onClick={() => setSelectedAlumni(alumni)}
                            className="btn btn-warning btn-sm rounded-pill px-3 fw-bold"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div
                    className="card border-0 shadow-lg overflow-hidden"
                    style={{ borderRadius: "30px", background: "white" }}
                  >
                    <div className="row g-0">
                      <div className="col-md-5 bg-primary p-5 text-center text-white d-flex flex-column align-items-center">
                        <div className="position-relative mb-4">
                          <img
                            src={selectedAlumni.image}
                            className="rounded-circle border border-5 border-white shadow"
                            style={{
                              width: "200px",
                              height: "200px",
                              objectFit: "cover",
                            }}
                            alt=""
                          />
                          {isEditing && isAlumni && (
                            <label className="position-absolute bottom-0 end-0 bg-warning rounded-circle p-2 border border-2 border-white cursor-pointer shadow">
                              <i className="bi bi-camera-fill text-dark"></i>
                              <input
                                type="file"
                                className="d-none"
                                accept="image/*"
                                onChange={handleFileChange}
                              />
                            </label>
                          )}
                        </div>
                        {isEditing && isAlumni ? (
                          <button
                            onClick={handleSaveProfile}
                            disabled={loading}
                            className="btn btn-success rounded-pill px-4 mb-3 w-75 shadow fw-bold"
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </button>
                        ) : isAlumni && user.id === selectedAlumni._id ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="btn btn-warning rounded-pill px-4 mb-3 w-75 shadow fw-bold"
                          >
                            Edit Profile
                          </button>
                        ) : null}
                        <button
                          onClick={() => {
                            setSelectedAlumni(null);
                            setIsEditing(false);
                          }}
                          className="btn btn-outline-light rounded-pill px-4 w-75"
                        >
                          Back
                        </button>
                      </div>
                      <div className="col-md-7 p-5 text-start bg-white">
                        <h3 className="fw-bold border-bottom pb-3 mb-4">
                          Alumni Profile Details
                        </h3>
                        <div className="mb-3">
                          <label className="text-muted small fw-bold uppercase">
                            Name
                          </label>
                          {isEditing ? (
                            <input
                              className="form-control"
                              value={selectedAlumni.name}
                              onChange={(e) =>
                                handleUpdate("name", e.target.value)
                              }
                            />
                          ) : (
                            <p className="fs-4 fw-bold">
                              {selectedAlumni.name}
                            </p>
                          )}
                        </div>
                        <div className="mb-3">
                          <label className="text-muted small fw-bold uppercase">
                            Batch (From - To)
                          </label>
                          {isEditing ? (
                            <div className="d-flex gap-2">
                              <input
                                className="form-control"
                                placeholder="From Year"
                                value={selectedAlumni.from}
                                onChange={(e) =>
                                  handleUpdate("from", e.target.value)
                                }
                              />
                              <input
                                className="form-control"
                                placeholder="To Year"
                                value={selectedAlumni.to}
                                onChange={(e) =>
                                  handleUpdate("to", e.target.value)
                                }
                              />
                            </div>
                          ) : (
                            <p className="fs-5 fw-bold">
                              {selectedAlumni.from} - {selectedAlumni.to}
                            </p>
                          )}
                        </div>
                        <div className="mb-3">
                          <label className="text-muted small fw-bold uppercase">
                            Role & Company
                          </label>
                          {isEditing ? (
                            <div className="d-flex gap-2">
                              <input
                                className="form-control"
                                value={selectedAlumni.role}
                                onChange={(e) =>
                                  handleUpdate("role", e.target.value)
                                }
                              />
                              <input
                                className="form-control"
                                value={selectedAlumni.company}
                                onChange={(e) =>
                                  handleUpdate("company", e.target.value)
                                }
                              />
                            </div>
                          ) : (
                            <p className="fs-5 text-primary fw-bold">
                              {selectedAlumni.role} @ {selectedAlumni.company}
                            </p>
                          )}
                        </div>
                        <div className="mb-3">
                          <label className="text-primary fw-bold mb-2 d-block">
                            LinkedIn Profile
                          </label>
                          {isEditing ? (
                            <input
                              className="form-control"
                              value={selectedAlumni.linkedin}
                              placeholder="Paste LinkedIn URL here (https://...)"
                              onChange={(e) =>
                                handleUpdate("linkedin", e.target.value)
                              }
                            />
                          ) : (
                            <div className="d-flex align-items-center gap-3">
                              {selectedAlumni.linkedin ? (
                                <>
                                  <p
                                    className="mb-0 text-muted text-truncate"
                                    style={{ maxWidth: "200px" }}
                                  >
                                    {selectedAlumni.linkedin}
                                  </p>
                                  <a
                                    href={selectedAlumni.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-3 fw-bold shadow-sm"
                                  >
                                    <i className="bi bi-linkedin fs-6"></i>
                                    Open LinkedIn
                                  </a>
                                </>
                              ) : (
                                <p className="text-muted italic mb-0">
                                  Not provided
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlumniDirectory;
