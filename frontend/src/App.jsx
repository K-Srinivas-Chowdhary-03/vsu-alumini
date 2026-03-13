import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Faculty from "./pages/Faculty";
import JobBoard from "./pages/JobBoard";
import Login from "./pages/Login";
import OurAlumni from "./pages/OurAlumni"; // This was likely missing

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/faculty" element={<Faculty />} />
        {/* Updated path to match the 'Our Alumni' link in Home.jsx */}
        <Route path="/alumni-network" element={<OurAlumni />} />
        <Route path="/jobs" element={<JobBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
