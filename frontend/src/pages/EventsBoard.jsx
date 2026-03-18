import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const EventsBoard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="container-fluid py-5 min-vh-100" style={{ background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" }}>
      <div className="container mt-5 pt-4">
        <h1 className="display-4 fw-bold text-white mb-2 text-center">Upcoming Events</h1>
        <p className="lead text-white-50 text-center mb-5">Stay connected with reunions, webinars, and college fests.</p>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-5">
            <div className="card bg-dark text-white p-5 border-0 rounded-4 shadow-lg">
              <h3>No upcoming events at the moment.</h3>
              <p className="text-white-50">Check back later for exciting announcements!</p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {events.map((event) => (
              <div key={event._id} className="col-md-6">
                <motion.div whileHover={{ y: -5 }} className="card border-0 shadow-lg h-100 rounded-4 overflow-hidden">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="badge bg-primary rounded-pill px-3 py-2">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <i className="bi bi-calendar-event text-primary fs-4"></i>
                    </div>
                    <h4 className="fw-bold">{event.title}</h4>
                    <p className="text-muted mb-3"><i className="bi bi-geo-alt-fill me-2"></i>{event.location}</p>
                    <p className="card-text">{event.description}</p>
                    <button className="btn btn-warning rounded-pill px-4 fw-bold mt-3">RSVP Now</button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsBoard;
