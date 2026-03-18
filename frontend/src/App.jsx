import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Faculty from "./pages/Faculty";
import JobBoard from "./pages/JobBoard";
import Login from "./pages/Login";
import OurAlumni from "./pages/OurAlumni";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/faculty" element={<ProtectedRoute><Faculty /></ProtectedRoute>} />
        {/* Updated path to match the 'Our Alumni' link in Home.jsx */}
        <Route path="/alumni-network" element={<ProtectedRoute><OurAlumni /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><JobBoard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
