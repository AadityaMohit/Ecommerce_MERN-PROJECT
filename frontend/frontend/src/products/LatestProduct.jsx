import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LatestProduct.css';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';   

function LatestProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();   

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/GetImages');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    navigate('/billing', { state: { product } });
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;  // Check if there's a half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={index} color="#ffc107" />
        ))}
        {halfStar && <FaStarHalfAlt color="#ffc107" />}
        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar key={index + fullStars} color="#ffc107" />
        ))}
      </>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="latest-products">
 
      <div className="product-list">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-item" onClick={() => handleProductClick(product)}>
              <h3>{product.name}</h3>
              <img src={product.image} alt={product.name} />
              <p className="product-description">{product.description}</p>
              <p className="product-price">Price: ${product.price}</p>
              <div className="product-rating">
                Rating: {renderStars(product.rating)} ({product.rating})
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LatestProduct;
