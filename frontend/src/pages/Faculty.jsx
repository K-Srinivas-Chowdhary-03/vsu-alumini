import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const facultyData = [];

const Faculty = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  return (
    <div
      className="container-fluid py-5 min-vh-100"
      style={{
        background: "linear-gradient(135deg, #001d4d 0%, #0052cc 100%)",
      }}
    >
      <div className="container mt-5 pt-4">
        <AnimatePresence mode="wait">
          {!selectedFaculty ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="row g-4 justify-content-center"
            >
              <div className="text-center mb-5 text-white">
                <h1 className="display-4 fw-bold">
                  Department of Computer Science
                </h1>
                <p className="lead opacity-75">
                  VSU-Kavali • Distinguished Faculty
                </p>
                <div
                  className="mx-auto bg-warning"
                  style={{ width: "80px", height: "4px" }}
                ></div>
              </div>

              {facultyData.map((faculty) => (
                <div key={faculty.id} className="col-md-6 col-lg-4">
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="card border-0 text-center p-4 h-100 shadow-lg"
                    style={{
                      borderRadius: "25px",
                      background: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(10px)",
                      color: "white",
                    }}
                  >
                    <img
                      src={faculty.image}
                      alt={faculty.name}
                      className="rounded-circle mx-auto mb-3 border border-4 border-warning shadow"
                      style={{
                        width: "130px",
                        height: "130px",
                        objectFit: "cover",
                      }}
                    />
                    <h5 className="fw-bold mb-1">{faculty.name}</h5>
                    <p className="small text-warning mb-4 fw-bold">
                      {faculty.designation}
                    </p>
                    <button
                      onClick={() => setSelectedFaculty(faculty)}
                      className="btn btn-warning rounded-pill btn-sm px-4 fw-bold mt-auto"
                    >
                      View Profile
                    </button>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="row justify-content-center"
            >
              <div className="col-lg-10">
                <div
                  className="card border-0 shadow-lg overflow-hidden"
                  style={{ borderRadius: "30px", background: "white" }}
                >
                  <div className="row g-0">
                    <div className="col-md-4 bg-primary text-center p-5 text-white">
                      <img
                        src={selectedFaculty.image}
                        alt={selectedFaculty.name}
                        className="rounded-circle mb-4 border border-5 border-white shadow-lg"
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                      <h3 className="fw-bold mb-2">{selectedFaculty.name}</h3>
                      <span className="badge bg-warning text-dark px-3 py-2 mb-4">
                        {selectedFaculty.designation}
                      </span>
                      <br />
                      <button
                        onClick={() => setSelectedFaculty(null)}
                        className="btn btn-light rounded-pill px-4 fw-bold mt-3"
                      >
                        <i className="bi bi-arrow-left me-2"></i> Back to Staff
                      </button>
                    </div>

                    <div className="col-md-8 p-4 p-md-5 text-start">
                      <h4 className="fw-bold text-primary mb-4 border-bottom pb-2">
                        Academic Profile
                      </h4>
                      <div className="row g-4">
                        <div className="col-md-6">
                          <label className="fw-bold text-secondary small text-uppercase d-block">
                            Qualifications
                          </label>
                          <p className="fw-bold text-dark">
                            {selectedFaculty.qualifications}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <label className="fw-bold text-secondary small text-uppercase d-block">
                            Experience
                          </label>
                          <p className="fw-bold text-dark">
                            {selectedFaculty.experience}
                          </p>
                        </div>
                        <div className="col-12">
                          <label className="fw-bold text-secondary small text-uppercase d-block">
                            Specialization
                          </label>
                          <p className="text-primary fw-bold">
                            {selectedFaculty.specialization}
                          </p>
                        </div>
                        <div className="col-12">
                          <label className="fw-bold text-secondary small text-uppercase d-block">
                            Research & Bio
                          </label>
                          <p
                            className="text-muted"
                            style={{ lineHeight: "1.7", textAlign: "justify" }}
                          >
                            {selectedFaculty.details}
                          </p>
                        </div>
                        <div className="col-12 border-top pt-4">
                          <i className="bi bi-envelope-at me-2 text-primary"></i>
                          <a
                            href={`mailto:${selectedFaculty.email}`}
                            className="text-decoration-none fw-bold text-dark"
                          >
                            {selectedFaculty.email}
                          </a>
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

export default Faculty;
