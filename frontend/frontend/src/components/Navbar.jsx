import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faEnvelope, faUser, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';
function Navbar() {
  const navigate = useNavigate();
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');  
  const [useremail, setUseremail] = useState(localStorage.getItem('useremail') || '');  

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('useremail');
    setUsername('');
    setUseremail('');
    setShowProfileDetails(false);  
    navigate('/');  
  };

  useEffect(() => {
 
    const storedUsername = localStorage.getItem('username');
    const storedUseremail = localStorage.getItem('useremail');
    if (storedUsername && storedUseremail) {
      setUsername(storedUsername);
      setUseremail(storedUseremail);
    }
  }, []);  

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
          <FontAwesomeIcon icon={faHome} size="2x" />
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/" className="navbar-item">
              <FontAwesomeIcon icon={faHome} />
              <span className="link-text">Home</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="navbar-item">
              <FontAwesomeIcon icon={faTachometerAlt} />
              <span className="link-text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/products" className="navbar-item">
              <FontAwesomeIcon icon={faTachometerAlt} />
              <span className="link-text">Products</span>
            </Link>
          </li>
 
          {!username && !useremail && (
            <>
              <li>
                <Link to="/signin" className="navbar-item">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span className="link-text">Sign In</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="navbar-item">
                  <FontAwesomeIcon icon={faUser} />
                  <span className="link-text">Login</span>
                </Link>
              </li>
            </>
          )}

          
          {username && useremail && (
            <li
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="navbar-item profile-item"
            >
              <Link to="/" className="navbar-item">
                <FontAwesomeIcon icon={faUser} />
                <span className="link-text">Profile</span>
              </Link>
              {showProfileDetails && (
                <div className="profile-details">
                  <h3>User: {username} <FontAwesomeIcon icon={faUser} /></h3>
                  <p>Email: {useremail}</p>
            
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                  <Link to="/orderstatus" style={{color:'white'}} >Your Orders
  
    </Link>
                </div>
              )}
            </li>
          )}

          <li>
          <Link to="/message" className="navbar-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <span className="link-text">Contact</span>
              </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
