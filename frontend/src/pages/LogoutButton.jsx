import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <button 
            onClick={handleLogout} 
            className="btn btn-danger btn-sm rounded-pill px-3 position-fixed top-0 end-0 m-3 z-3 shadow"
            style={{zIndex: 1000}}
        >
            Logout
        </button>
    );
};

export default LogoutButton;
