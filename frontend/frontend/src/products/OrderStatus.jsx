import React, { useEffect, useState } from 'react';
import './OrderStatus.css';

function OrderStatus() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/order_status');  
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data.data);  
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="order-status-container">
 
    <div className="order-list">
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <img src={order.product.image} alt={order.product.name} className="product-image" />
          <div className="order-details">
            <p><strong>Product:</strong> {order.product.name}</p>
            <p><strong>Status:</strong> <span className={`status ${order.status}`}>{order.status}</span></p>
            <p><strong>Price:</strong> ₹{order.product.price}</p>
            <p className="payment-method"><strong>Payment Method:</strong> {order.paymentMethod}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default OrderStatus;
