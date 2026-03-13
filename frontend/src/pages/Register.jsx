import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("student"); // student or alumni
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    company: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);

  const validate = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;

    if (!emailRegex.test(formData.email))
      return "Invalid email format (@ missing)";
    if (!pwdRegex.test(formData.password))
      return "Password must be 6+ chars, 1 Uppercase, 1 Special char";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";
    if (userType === "alumni" && (!formData.role || !formData.company))
      return "All Alumni fields are required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return alert(error);

    setIsRegistering(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/register`,
        {
        ...formData,
        role: userType === "student" ? "Student" : formData.role,
        isAlumni: userType === "alumni",
      });
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div
      className="container-fluid py-5 min-vh-100 d-flex align-items-center"
      style={{
        background: "linear-gradient(135deg, #001d4d 0%, #0052cc 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card border-0 shadow-lg p-4"
              style={{ borderRadius: "1.5rem" }}
            >
              {/* --- TOGGLE TABS --- */}
              <div className="d-flex mb-4 bg-light rounded-pill p-1">
                <button
                  onClick={() => setUserType("student")}
                  className={`btn w-50 rounded-pill fw-bold ${
                    userType === "student" ? "btn-primary" : "btn-light"
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => setUserType("alumni")}
                  className={`btn w-50 rounded-pill fw-bold ${
                    userType === "alumni" ? "btn-primary" : "btn-light"
                  }`}
                >
                  Alumni
                </button>
              </div>

              <h2 className="text-center fw-bold text-primary mb-4">
                {userType === "student" ? "Student" : "Alumni"} Registration
              </h2>

              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12">
                  <label className="small fw-bold">NAME</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="small fw-bold">EMAIL</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="email@svu.com"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold">CREATE PASSWORD</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold">CONFIRM PASSWORD</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="••••••••"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* --- ALUMNI ONLY FIELDS --- */}
                {userType === "alumni" && (
                  <>
                    <div className="col-md-6">
                      <label className="small fw-bold">
                        DESIGNATION (ROLE)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ex: Software Engineer"
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold">COMPANY NAME</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ex: Google"
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        required
                      />
                    </div>
                  </>
                )}

                <div className="col-12 mt-4">
                  <button
                    disabled={isRegistering}
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow d-flex align-items-center justify-content-center"
                  >
                    {isRegistering ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </form>
              <p className="text-center mt-3 small">
                Already have an account?{" "}
                <Link to="/login" className="fw-bold">
                  Login Here
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
