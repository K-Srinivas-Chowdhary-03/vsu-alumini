import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CustomDialog = ({ isOpen, title, message, type, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const bgColor = 
    type === "success" ? "#198754" : 
    type === "warning" ? "#ffc107" : "#dc3545"; // Green, Yellow, or Red

  const textColor = type === "warning" ? "#000" : "#fff";

  return (
    <AnimatePresence>
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="p-4 rounded-4 shadow-lg text-center"
          style={{ 
            minWidth: "320px", 
            maxWidth: "400px",
            backgroundColor: bgColor,
            color: textColor,
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <div className="mb-3">
            {type === "success" ? (
              <i className="bi bi-check-circle-fill" style={{ fontSize: "3.5rem" }}></i>
            ) : type === "warning" ? (
              <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "3.5rem" }}></i>
            ) : (
              <i className="bi bi-exclamation-octagon-fill" style={{ fontSize: "3.5rem" }}></i>
            )}
          </div>
          <h3 className="fw-bold mb-2">{title}</h3>
          <p className="mb-4 opacity-90">{message}</p>
          
          <div className="d-flex gap-2 justify-content-center">
            {onConfirm ? (
              <>
                <button 
                  className={`btn ${type === "warning" ? "btn-dark" : "btn-light"} rounded-pill px-4 fw-bold shadow-sm`}
                  onClick={onConfirm}
                >
                  Yes, Proceed
                </button>
                <button 
                  className="btn btn-outline-dark rounded-pill px-4 fw-bold"
                  style={{ color: textColor === "#fff" ? "#fff" : "inherit", borderColor: textColor === "#fff" ? "#fff" : "inherit" }}
                  onClick={onClose}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                className={`btn ${type === "warning" ? "btn-dark" : "btn-light"} rounded-pill px-5 fw-bold shadow-sm`}
                onClick={onClose}
              >
                OK
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomDialog;
