import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [theme, setTheme] = React.useState(localStorage.getItem("theme") || "light");

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-warning" style={{ fontSize: "1.5rem" }} to="/">
          VSU Alumini
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/alumni-network">Directory</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/jobs">Jobs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/events">Events</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/news">News</Link>
            </li>
            <li className="nav-item ms-lg-3 d-flex align-items-center">
              <div className="form-check form-switch ps-0">
                <input 
                  className="form-check-input ms-0 cursor-pointer" 
                  type="checkbox" 
                  id="themeToggle"
                  checked={theme === "dark"}
                  onChange={toggleTheme}
                  style={{ width: "2.5rem", height: "1.25rem" }}
                />
                <label className="form-check-label text-white-50 small ms-2 d-none d-lg-inline" htmlFor="themeToggle">
                  {theme === "dark" ? <i className="bi bi-moon-stars-fill text-warning"></i> : <i className="bi bi-sun-fill text-warning"></i>}
                </label>
              </div>
            </li>
            {!user ? (
              <li className="nav-item">
                <Link className="btn btn-warning rounded-pill px-4 ms-lg-3 fw-bold" to="/login">Login</Link>
              </li>
            ) : (
              <li className="nav-item dropdown ms-lg-3">
                <button 
                  className="btn btn-outline-light rounded-pill px-4 dropdown-toggle fw-bold" 
                  type="button" 
                  id="userDropdown" 
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle me-2"></i>{user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2">
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
