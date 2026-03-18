import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CustomDialog from "../components/CustomDialog";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [dialog, setDialog] = useState({ isOpen: false, title: "", message: "", type: "success" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setDialog({ isOpen: true, title: "Login Successful", message: "Redirecting to portal...", type: "success" });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setDialog({ isOpen: true, title: "Login Failed", message: err.response?.data?.error || "Invalid credentials", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container-fluid vh-100 d-flex align-items-center login-page"
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
                  disabled={isLoading}
                  className="btn btn-primary w-100 py-3 fw-bold rounded-pill d-flex align-items-center justify-content-center"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    "Login to Portal"
                  )}
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

export default Login;
