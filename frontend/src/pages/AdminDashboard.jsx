import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchPending = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/pending`, {
        headers: { Authorization: token }
      });
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Error fetching pending users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/approve/${id}`, {}, {
        headers: { Authorization: token }
      });
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
      alert("User approved successfully!");
    } catch (err) {
      alert("Approval failed");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject and delete this registration?")) return;
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/reject/${id}`, {}, {
        headers: { Authorization: token }
      });
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
      alert("User rejected");
    } catch (err) {
      alert("Rejection failed");
    }
  };

  return (
    <div className="container-fluid py-5 min-vh-100" style={{ background: "#f8f9fa" }}>
      <div className="container mt-5">
        <h2 className="fw-bold mb-4 text-primary">Admin Dashboard</h2>
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h4 className="mb-4">Pending Approvals</h4>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Loading registrations...</p>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-person-check fs-1"></i>
              <p className="mt-2">No pending registrations at the moment.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Roll Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Company/Designation</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {pendingUsers.map((user) => (
                      <motion.tr 
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <td className="fw-bold">{user.rollNumber}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge rounded-pill ${user.role === 'Alumnus' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.company || 'N/A'} {user.designation && `(${user.designation})`}</td>
                        <td className="text-end">
                          <button 
                            onClick={() => handleApprove(user._id)}
                            className="btn btn-success btn-sm rounded-pill px-3 me-2 fw-bold"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(user._id)}
                            className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
                          >
                            Reject
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
