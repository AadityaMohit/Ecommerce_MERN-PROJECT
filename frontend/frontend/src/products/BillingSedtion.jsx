import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './BillingSection.css';
import LatestProduct from './LatestProduct';

function BillingSection() {
  const location = useLocation();
  const { product } = location.state;  

 
  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    creditCardNumber: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'cashOnDelivery',  
  });
 
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState('');

 
  useEffect(() => {
    const storedFullName = localStorage.getItem('username');  
    const storedEmail = localStorage.getItem('useremail');  

    
    if (storedFullName && storedEmail) {
      setBillingInfo((prevInfo) => ({
        ...prevInfo,
        fullName: storedFullName,
        email: storedEmail,
      }));
    }
  }, []);

  
  const handleInputChange = (e) => {
    setBillingInfo({
      ...billingInfo,
      [e.target.name]: e.target.value
    });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!billingInfo.fullName || !billingInfo.email || !billingInfo.address || !billingInfo.paymentMethod) {
      setError('Please fill out all fields.');
      return;
    }

    try {
  
      const response = await fetch('http://localhost:5000/api/products/placeOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: billingInfo.email,
          product: {
            name: product.name,
            price: product.price,
            image: product.image,
          },
          billingInfo,   
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      setOrderPlaced(true);   
    } catch (err) {
      setError(err.message);   
    }
  };

  if (orderPlaced) {
    return (
      <div className="order-confirmation">
        <h2>Thank you for your purchase!</h2>
        <p>Your order for <strong>{product.name}</strong> has been placed successfully.</p>
      </div>
    );
  }

  return (
    <div className="billing-section">
      <h3>Billing Information</h3>
      <div className="product-summary">
        <p><strong>Product:</strong> {product.name}</p>
        <p><strong>Price:</strong> ${product.price}</p>
        <img src={product.image} alt={product.name} />
      </div>

      <form className="billing-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={billingInfo.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={billingInfo.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Shipping Address</label>
          <input
            type="text"
            name="address"
            value={billingInfo.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <select
            name="paymentMethod"
            value={billingInfo.paymentMethod}
            onChange={handleInputChange}
            required
          >
            <option value="cashOnDelivery">Cash on Delivery</option>
            <option value="creditCard">Credit Card</option>
            <option value="paytm">Paytm</option>
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
          </select>
        </div>

        {/* Conditional rendering for Credit Card details */}
        {billingInfo.paymentMethod === 'creditCard' && (
          <>
            <div className="form-group">
              <label>Credit Card Number</label>
              <input
                type="text"
                name="creditCardNumber"
                value={billingInfo.creditCardNumber}
                onChange={handleInputChange}
                required
                maxLength="16"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={billingInfo.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  required
                />
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={billingInfo.cvv}
                  onChange={handleInputChange}
                  required
                  maxLength="3"
                />
              </div>
            </div>
          </>
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit-button">Place Order</button>
      </form>
      <LatestProduct/>
    </div>
  );
}

export default BillingSection;
