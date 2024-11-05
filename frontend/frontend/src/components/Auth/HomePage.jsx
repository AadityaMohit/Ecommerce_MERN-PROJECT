import img2 from './newfolder/img2.jpeg';
import img3 from './newfolder/img3.jpeg';
import img4 from './newfolder/img4.jpeg';
import img5 from './newfolder/img5.jpeg';

 
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt } from '@fortawesome/free-solid-svg-icons';
import './HomePage.css';
import Cards from '../cards/Cards';
import Footer from './Footer';

function HomePage() {
  const [starter, setStarter] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [products, setProducts] = useState([]); 
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([img2, img3,img4,img5]);  
  const [happyCustomers, setHappyCustomers] = useState(0); 

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Starter Message Effect
  useEffect(() => {
    const messages = {
      a: 'Exclusive Fashion',
      b: 'New Arrivals Daily',
      c: 'Trendy & Affordable',
    };
    const keys = Object.keys(messages);
    let index = 0;

    const interval = setInterval(() => {
      setStarter(messages[keys[index]]);
      index = (index + 1) % keys.length;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

 
  useEffect(() => {
    if (happyCustomers < 1000) {
      const interval = setInterval(() => {
        setHappyCustomers((prevCount) => Math.min(prevCount + 10, 1000));  
      }, 100);  

      return () => clearInterval(interval);
    }
  }, [happyCustomers]);

  return (
    <>
    <div className="homepage">
  
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to TrendyWear</h1>
          <p>Your One-Stop Shop for the Latest Fashion Trends</p>
          <button className="cta-button">Shop Now</button>
        </div>
        <div className="customer-images">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`happy customer ${index}`}
              className="customer-image"
            />
          ))}
        </div>
        <div className="hero-image">
          <div className="image-slider">
            {images.length > 0 ? (
              images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`slide ${index}`}
                  className={`slider-image ${index === currentImageIndex ? 'active' : ''}`}
                />
              ))
            ) : (
              <p>Loading images...</p>
            )}
          </div>
          <p
            style={{
              color: '#e91e63',
              fontSize: '24px',
              fontWeight: 'bold',
              textAlign: 'center',
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            {starter}
          </p>
        </div>
        {/* Happy Customers Count Display */}
      </div>
        <div className="happy-customers">
          <h2 style={{ textAlign: 'center' }}>
            Happy Customers: <span className="customer-count">{happyCustomers}</span>
          </h2>
        </div>

      {/* Featured Products Section */}
      <div className="features-section">
        <h2>Shop Our Collection</h2>
        <div className="features">
          {products.map((product, index) => (
            <div key={index} className="feature product-card">
              <FontAwesomeIcon icon={faTshirt} className="icon" />
              <h3>{product.name}</h3>
              <p>From ${product.price}</p>
            </div>
          ))}
        </div>
      </div>

 
      <div className="cta-section">
        <h2>Get Your Fashion Fix Today</h2>
        <p>Sign up now to receive exclusive discounts and early access to new collections!</p>
        <button className="cta-button">Sign Up Now</button>
      </div>
 
      {message && <p className="error-message">{message}</p>}
      <Cards/>
    </div>
      <Footer />
   
      </>
  );
}

export default HomePage;
