import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/news`);
      setNewsList(res.data);
    } catch (err) {
      console.error("Error fetching news", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="container-fluid py-5 min-vh-100" style={{ background: "#f0f2f5" }}>
      <div className="container mt-5 pt-4">
        <h1 className="fw-bold text-dark mb-4 text-center">News & Announcements</h1>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-5">
            <p className="lead text-muted">No news updates at the moment.</p>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {newsList.map((news) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={news._id} className="card border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
                  {news.image && <img src={news.image} className="card-img-top" alt={news.title} style={{ height: "300px", objectFit: "cover" }} />}
                  <div className="card-body p-4">
                    <span className="text-primary small fw-bold text-uppercase mb-2 d-block">
                      {new Date(news.createdAt).toLocaleDateString()}
                    </span>
                    <h3 className="fw-bold mb-3">{news.title}</h3>
                    <p className="card-text text-muted fs-5">{news.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
