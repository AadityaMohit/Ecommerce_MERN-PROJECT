import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faInfoCircle, faEnvelope, faUser, faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [useremail, setUseremail] = useState(localStorage.getItem("useremail") || "");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUseremail = localStorage.getItem("useremail");
    if (storedUsername && storedUseremail) {
      setUsername(storedUsername);
      setUseremail(storedUseremail);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("useremail");
    setUsername("");
    setUseremail("");
    setShowProfileDetails(false);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMouseEnter = () => {
    if (username && useremail) {
      setShowProfileDetails(true);
    }
  };

  const handleMouseLeave = () => {
    setShowProfileDetails(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
      
        <div className="navbar-brand">
          <FontAwesomeIcon icon={faHome} style={{color:'white'}}  size="2x" />
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="hamburger" onClick={toggleMobileMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Navbar Links */}
        <ul className={`navbar-links ${isMobileMenuOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/" className="navbar-item" activeClassName="active">
              <FontAwesomeIcon icon={faHome} />
              <span className="link-text">Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className="navbar-item" activeClassName="active">
              <FontAwesomeIcon icon={faTachometerAlt} />
              <span className="link-text">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className="navbar-item" activeClassName="active">
              <FontAwesomeIcon icon={faTachometerAlt} />
              <span className="link-text">Products</span>
            </NavLink>
          </li>

          {/* Conditional Rendering for Authentication */}
          {!username && !useremail ? (
            <>
              <li>
                <NavLink to="/signin" className="navbar-item" activeClassName="active">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span className="link-text">Sign In</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" className="navbar-item" activeClassName="active">
                  <FontAwesomeIcon icon={faUser} />
                  <span className="link-text">Login</span>
                </NavLink>
              </li>
            </>
          ) : (
            <li
              className="navbar-item profile-item"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/" className="navbar-item">
                <FontAwesomeIcon icon={faUser} />
                <span className="link-text">Profile</span>
              </NavLink>
              {showProfileDetails && (
                <div className="profile-details">
                  <h3>
                    User: {username} <FontAwesomeIcon icon={faUser} />
                  </h3>
                  <p>Email: {useremail}</p>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                  <NavLink to="/orderstatus" style={{ color: "white" }}>
                    Your Orders
                  </NavLink>
                </div>
              )}
            </li>
          )}

          <li>
            <NavLink to="/message" className="navbar-item" activeClassName="active">
              <FontAwesomeIcon icon={faEnvelope} />
              <span className="link-text">Contact</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
