import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = React.useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutConfirm(false);
    setShowLogoutSuccess(true);
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div
      className="container-fluid p-0 overflow-hidden"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      {/* --- FIXED TOP NAVBAR WITH THICK BLUE COLOR --- */}
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top py-3 px-2 z-3"
        style={{
          background: "#001d4d", // Deep thick blue
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <div className="container">
          <Link
            className="navbar-brand fw-bold d-flex align-items-center"
            to="/"
          >
            <i className="bi bi-mortarboard-fill me-2 text-warning fs-2"></i>
            <div>
              <span
                className="d-block lh-1 text-uppercase"
                style={{ fontSize: "1.5rem", letterSpacing: "1px" }}
              >
                VSU-Kavali
              </span>
            </div>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-3 align-items-center">
              <li className="nav-item">
                <Link 
                  className="nav-link text-white fw-semibold" 
                  to="/"
                  onClick={() => document.getElementById('navbarNav').classList.remove('show')}
                >
                  Home
                </Link>
              </li>

              {user && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-white fw-semibold"
                      to="/jobs"
                      onClick={() => document.getElementById('navbarNav').classList.remove('show')}
                    >
                      Job Board
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-white fw-semibold"
                      to="/alumni-network"
                      onClick={() => document.getElementById('navbarNav').classList.remove('show')}
                    >
                      Our Alumni
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item ms-lg-3">
                {user ? (
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-warning small fw-bold">
                      Hi, {user.name.split(" ")[0]}
                    </span>
                    <button
                      onClick={handleLogoutClick}
                      className="btn btn-outline-warning rounded-pill px-4 fw-bold shadow-sm btn-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm"
                    to="/register"
                  >
                    Alumni Connect
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section
        className="vh-100 d-flex align-items-center text-white"
        style={{
          background: "linear-gradient(135deg, #001d4d 0%, #000c24 100%)",
          marginTop: "0", // Starts from top behind fixed navbar if desired, or adjust padding
        }}
      >
        <div className="container position-relative z-2">
          <div className="row align-items-center mt-5">
            <div className="col-lg-7 text-center text-lg-start">
              <motion.div initial="hidden" animate="visible">
                <motion.span
                  variants={fadeInUp}
                  className="badge bg-warning text-dark mb-3 px-3 py-2 fw-bold shadow-sm"
                >
                  SINCE 2010 • KAVALI
                </motion.span>
                <motion.h1
                  variants={fadeInUp}
                  className="display-1 fw-bold mb-4"
                >
                  Legacy of <span className="text-warning">Computing</span>{" "}
                  Excellence.
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  className="lead fs-3 mb-5 opacity-90 fw-light"
                >
                  Connecting VSU-Kavali's brightest minds with global industry
                  leaders.
                </motion.p>
                <motion.div
                  variants={fadeInUp}
                  className="d-flex justify-content-center justify-content-lg-start gap-3"
                >
                  <Link
                    to={user ? "/jobs" : "/login"}
                    className="btn btn-warning btn-lg px-5 py-3 fw-bold rounded-pill shadow"
                  >
                    {user ? "Explore Jobs" : "Student Login"}
                  </Link>
                  <Link
                    to="/alumni-network"
                    className="btn btn-outline-light btn-lg px-5 py-3 fw-bold rounded-pill"
                  >
                    Our Alumni
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            <div className="col-lg-5 d-none d-lg-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <div
                  className="card bg-white bg-opacity-10 border-white border-opacity-25 p-5 backdrop-blur text-center shadow-lg"
                  style={{ borderRadius: "40px" }}
                >
                  <h5 className="text-warning text-uppercase small mb-4 fw-bold">
                    Department Achievements
                  </h5>
                  <div className="mb-4 text-white">
                    <h2 className="display-4 fw-bold">A+</h2>
                    <p className="text-uppercase small">NAAC Accredited</p>
                  </div>
                  <div className="d-flex justify-content-around text-white">
                    <div>
                      <h3 className="fw-bold mb-0">35+</h3>
                      <p className="small">Faculty</p>
                    </div>
                    <div className="border-start border-white border-opacity-25 px-4">
                      <h3 className="fw-bold mb-0">5k+</h3>
                      <p className="small">Alumni</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- EMPOWERING SECTION --- */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(180deg, #001d4d 0%, #0052cc 100%)",
        }}
      >
        <div className="container py-5">
          <div className="row justify-content-center mb-5 text-white">
            <div className="col-lg-8 text-center">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3">
                WHY JOIN THE NETWORK
              </span>
              <h2 className="fw-bold display-5 mb-3">
                Empowering VSU-Kavali Students
              </h2>
              <p className="lead opacity-75">
                Connect with alumni from MCA, M.Sc, and Management.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {[
              {
                icon: "bi-briefcase-fill",
                title: "Job Opportunities",
                text: "Exclusive access to job openings posted by alumni in top tech companies like Google, Microsoft, and more.",
                link: "/jobs",
              },
              {
                icon: "bi-people-fill",
                title: "Mentorship",
                text: "Get guidance from seniors who have walked the path. Resume reviews, mock interviews, and career advice.",
                link: "/alumni-network",
              },
              {
                icon: "bi-calendar-event-fill",
                title: "Placement Referrals",
                text: "Participate in reunions, tech talks, and webinars to stay updated with industry trends.",
                link: "/jobs",
              },
            ].map((item, index) => (
              <div key={index} className="col-md-4">
                <Link to={item.link} className="text-decoration-none">
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="card h-100 border-0 shadow-lg p-4"
                    style={{
                      borderRadius: "20px",
                      background: "rgba(255, 255, 255, 0.98)",
                    }}
                  >
                    <div
                      className="icon-square bg-primary bg-opacity-10 text-primary d-inline-flex align-items-center justify-content-center fs-4 rounded-circle mb-3"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <i className={`bi ${item.icon}`}></i>
                    </div>
                    <h4 className="fw-bold text-dark">{item.title}</h4>
                    <p className="text-muted small">{item.text}</p>
                  </motion.div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- RICH FOOTER --- */}
      <footer className="bg-dark text-white pt-5 pb-3">
        <div className="container pt-4">
          <div className="row g-4 text-start">
            <div className="col-lg-4 mb-4">
              <h4 className="fw-bold text-white mb-3">
                <i className="bi bi-mortarboard-fill text-warning me-2"></i>
                VSU-Kavali
              </h4>
              <p className="opacity-75 small leading-relaxed">
                The Vikrama Simhapuri University (VSU) PG Centre in Kavali is
                located at Peddapavani Road, Vaddi Palem, Kavali - 524201,
                Andhra Pradesh. It is a constituent PG center of VSU situated in
                Nellore district.
              </p>
              <div className="d-flex gap-3 mt-3">
                <a href="#" className="text-white opacity-75">
                  <i className="bi bi-linkedin fs-5"></i>
                </a>
                <a href="#" className="text-white opacity-75">
                  <i className="bi bi-twitter-x fs-5"></i>
                </a>
                <a href="#" className="text-white opacity-75">
                  <i className="bi bi-facebook fs-5"></i>
                </a>
              </div>
            </div>

            <div className="col-lg-2 col-6">
              <h6 className="fw-bold text-warning mb-3">Quick Links</h6>
              <ul className="list-unstyled opacity-75 small d-flex flex-column gap-2">
                <li>
                  <Link to="/" className="text-white text-decoration-none">
                    Home
                  </Link>
                </li>

                <li>
                  <Link to="/jobs" className="text-white text-decoration-none">
                    Job Board
                  </Link>
                </li>
                <li>
                  <Link
                    to="/alumni-network"
                    className="text-white text-decoration-none"
                  >
                    Alumni Network
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-6">
              <h6 className="fw-bold text-warning mb-3">University</h6>
              <ul className="list-unstyled opacity-75 small d-flex flex-column gap-2">
                <li>
                  <a href="#" className="text-white text-decoration-none">
                    About SVU
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white text-decoration-none">
                    Admissions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white text-decoration-none">
                    Examinations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white text-decoration-none">
                    Research
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-lg-4">
              <h6 className="fw-bold text-warning mb-3">Contact Us</h6>
              <ul className="list-unstyled opacity-75 small d-flex flex-column gap-3">
                <li className="d-flex align-items-start gap-2">
                  <i className="bi bi-geo-alt-fill mt-1"></i>
                  <span>VSU-Kavali, Kavali, Andhra Pradesh</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-envelope-fill"></i>
                  <span>alumni@vsu.ac.in</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-telephone-fill"></i>
                  <span>+91 877 2248666</span>
                </li>
              </ul>
            </div>
          </div>

          <hr className="opacity-25 my-4" />
          <div className="row align-items-center">
            <div className="col-md-12 text-center">
              <p className="small opacity-50 mb-0">
                &copy; {new Date().getFullYear()} VSU-Kavali Alumni Association.
                All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* --- LOGOUT CONFIRMATION DIALOG --- */}
      {showLogoutConfirm && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white text-dark p-4 rounded-4 shadow-lg text-center"
            style={{ minWidth: "320px", borderTop: "5px solid #ffca2c" }}
          >
            <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: "3rem" }}></i>
            <h4 className="fw-bold mt-3 mb-2">Logout Confirmation</h4>
            <p className="text-muted mb-4">Are you sure you want to log out?</p>
            <div className="d-flex justify-content-center gap-3">
              <button 
                className="btn btn-outline-secondary fw-bold px-4 rounded-pill"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-warning fw-bold px-4 rounded-pill shadow-sm"
                onClick={confirmLogout}
              >
                Yes, Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- LOGOUT SUCCESS DIALOG --- */}
      {showLogoutSuccess && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1060, backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-success text-white p-4 rounded-4 shadow-lg text-center"
            style={{ minWidth: "300px" }}
          >
            <i className="bi bi-check-circle-fill" style={{ fontSize: "3rem" }}></i>
            <h4 className="fw-bold mt-3 mb-0">Logged Out Successfully!</h4>
            <p className="small mb-0 mt-2 text-white-50">Redirecting to login...</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
