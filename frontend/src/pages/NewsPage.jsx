import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const NewsPage = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [newNews, setNewNews] = useState({ title: "", content: "", image: "" });
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "Admin";

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

  const handlePostNews = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/news`, newNews, {
        headers: { Authorization: localStorage.getItem("token") }
      });
      alert("News posted successfully!");
      setShowPostForm(false);
      setNewNews({ title: "", content: "", image: "" });
      fetchNews();
    } catch (err) {
      alert("Failed to post news: " + (err.response?.data?.error || err.message));
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

        {isAdmin && (
          <div className="text-center mb-5">
            <button 
              className="btn btn-primary rounded-pill px-4 fw-bold shadow"
              onClick={() => setShowPostForm(!showPostForm)}
            >
              {showPostForm ? "Cancel Posting" : "+ Post New Update"}
            </button>

            {showPostForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 text-start bg-white p-4 rounded-4 shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
                <form onSubmit={handlePostNews}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Title</label>
                    <input type="text" className="form-control rounded-pill" required value={newNews.title} onChange={(e) => setNewNews({...newNews, title: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Content</label>
                    <textarea className="form-control rounded-4" rows="3" required value={newNews.content} onChange={(e) => setNewNews({...newNews, content: e.target.value})}></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Image URL (Optional)</label>
                    <input type="text" className="form-control rounded-pill" value={newNews.image} onChange={(e) => setNewNews({...newNews, image: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-success rounded-pill px-4 fw-bold w-100" disabled={loading}>
                    {loading ? "Posting..." : "Submit Post"}
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        )}
        
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
