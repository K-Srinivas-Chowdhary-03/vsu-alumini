import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setShowSuccessDialog(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.error || "Login Failed");
    }
  };

  return (
    <div
      className="container-fluid vh-100 d-flex align-items-center"
      style={{
        background: "linear-gradient(135deg, #001d4d 0%, #0052cc 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card border-0 shadow-lg p-4 rounded-4"
            >
              <h2 className="text-center fw-bold text-primary mb-4">Login</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="small fw-bold">EMAIL</label>
                  <input
                    type="email"
                    className="form-control"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="small fw-bold">PASSWORD</label>
                  <input
                    type="password"
                    minLength="6"
                    className="form-control"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 fw-bold rounded-pill"
                >
                  Login to Portal
                </button>
              </form>
              <p className="text-center mt-3 small">
                New here?{" "}
                <Link to="/register" className="fw-bold">
                  Register First
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {showSuccessDialog && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-success text-white p-4 rounded-4 shadow-lg text-center"
            style={{ minWidth: "300px" }}
          >
            <i className="bi bi-check-circle-fill" style={{ fontSize: "3rem" }}></i>
            <h4 className="fw-bold mt-3 mb-0">Login Successful!</h4>
            <p className="small mb-0 mt-2 text-white-50">Redirecting...</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Login;
