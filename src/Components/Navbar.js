import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Importing the profile icon
import "./Navbar.css";

export const Navbar = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev); // Toggle menu visibility
  };

  const handleLinkClick = () => {
    setMenuOpen(false); // Close menu on link click
  };

  const isAuthenticated = !!localStorage.getItem("token"); // Check if user is authenticated

  return (
    <header className="header">
      <Link to="/" className="logo">
        Foodie <span>Bites</span>
      </Link>

      <i className="bx bx-menu" id="menu-icon" onClick={toggleMenu}></i>

      <nav className={`navbar ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={handleLinkClick}>
          Home
        </Link>
        <Link to="/Menu" onClick={handleLinkClick}>
          Menu
        </Link>
        <Link to="/Order" onClick={handleLinkClick}>
          Order
        </Link>

        {isAuthenticated ? (
          <div className="profile">
            <FaUserCircle size={30} title="Profile" />
            <button
              className="logout"
              onClick={() => {
                onLogout(); // Call the onLogout prop
                handleLinkClick(); // Close menu on logout
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          // No Login link here
          <p>You must log in to access more features.</p>
        )}
      </nav>
    </header>
  );
};
