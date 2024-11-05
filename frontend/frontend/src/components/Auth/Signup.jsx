import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faPhone } from '@fortawesome/free-solid-svg-icons'; // Import the phone icon
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');  
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/createuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      
        body: JSON.stringify({ name: username, email, password, phone }),  
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || 'User registered successfully!');
        navigate('/login');
      } else {
        setMessage(result.Error || 'Failed to register user.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };
 let p= localStorage.setItem('phone',phone)
 console.log({phone});
 
 return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <FontAwesomeIcon icon={faPhone} className="input-icon" />  
            <input
              type="tel"  
              id="phone"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Signup;
