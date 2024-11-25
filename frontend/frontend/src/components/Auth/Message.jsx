import React, { useState, useEffect } from 'react';
import './Message.css';  

function Message() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);  
  const [status, setStatus] = useState('');

 
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

 
    try {
      const res = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth_token': localStorage.getItem('token'), 
        },
        body: JSON.stringify({ message }),  
      });

      if (res.ok) {
        setStatus('Message sent successfully!');
        setMessage('');  
         
        const automaticMessage = "You are heard by us, we will email you.";
        await fetch('http://localhost:5000/api/messages/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth_token': localStorage.getItem('token'),
          },
          body: JSON.stringify({ message: automaticMessage }), 
        });

        fetchMessages(); 
      } else {
        const data = await res.json();
        setStatus(data.error || 'Failed to send message.');
      }
    } catch (error) {
      console.error('Error while sending message:', error);
      setStatus('Error while sending message.');
    }
  };

  // Fetch all messages from the backend
  const fetchMessages = async () => {
    setStatus('Fetching messages...');

    try {
      const res = await fetch('http://localhost:5000/api/messages/', {
        headers: {
          'auth_token': localStorage.getItem('token'), // Assuming token is stored in localStorage
        },
      });
      const data = await res.json();

      if (res.ok) {
        setMessages(data); // Set fetched messages
        setStatus('Messages fetched successfully!');
      } else {
        setStatus('Failed to fetch messages.');
      }
    } catch (error) {
      console.error('Error while fetching messages:', error);
      setStatus('Error while fetching messages.');
    }
  };

  // Use effect to fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="message-container">
      <h1>Chat with Us</h1>
      <div className="messages">
        {messages.map((msg) => (
          <div className={`message ${msg.message === "You are heard by us, we will email you." ? 'auto-response' : ''}`} key={msg._id}>
            <div className="message-text">{msg.message}</div>
          </div>
        ))}
      </div>
      <form className="message-form" onSubmit={handleMessageSubmit}>
        <textarea
          className="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows="2"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
      {/* <p>{status}</p> */}
    </div>
  );
}

export default Message;
