import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faFileAlt, faChartBar, faCog } from '@fortawesome/free-solid-svg-icons';
import * as d3 from 'd3';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [userCount, setUserCount] = useState(0);  
  const [productCount, setProductCount] = useState(0); 
  const [orderCount, setOrderCount] = useState(0); 

  const fetchOrderData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/order_list');
      const data = await response.json();
      if (data) {
        setOrderCount(data.response); 
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/product_list');
      const data = await response.json();
      if (data) {
        setProductCount(data.data); // Set the product count
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/users');  
      const data = await response.json();
      if (data && data.users) {
        setUserCount(data.users.length);  
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Render the D3 bar chart
  const renderChart = (data, color, svgId, tooltipText) => {
    const svg = d3.select(svgId)
      .attr('width', 400)
      .attr('height', 200);

    svg.selectAll('*').remove();  
 
    const width = 400;
    const height = 200;
    const xScale = d3.scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, width])
      .padding(0.1);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

  
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

  
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d))
      .attr('fill', color)
      .on('mouseover', function (event, d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(`${tooltipText}: ${d}`)
          .style('left', (event.pageX + 5) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function () {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
  };

  useEffect(() => {
    fetchUserData();
    fetchProductData(); 
    fetchOrderData();
  }, []);

  useEffect(() => {
    renderChart([userCount], '#4CAF50', '#userChart', 'Users');  
    renderChart([productCount], '#FF9800', '#productChart', 'Products');
    renderChart([orderCount], '#2196F3', '#orderChart', 'Orders');
  }, [userCount, productCount, orderCount]);
  

  return (
    <div className="dashboard-container">
 







      <aside className="sidebar">
         <nav>
          <ul>
            <li>
              <FontAwesomeIcon icon={faChartLine} />
              <span> Overview</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faFileAlt} />
              <span> Reports</span>
            </li>
            <li><Link style={{color:'inherit',textDecoration:'none'}} to="/analytics">
              <FontAwesomeIcon icon={faChartBar} />
              <span style={{color:'inherit'}}> Analytics</span>
            </Link>
            </li>
            <li><Link style={{color:'inherit',textDecoration:'none'}} to="/setting">
              <FontAwesomeIcon icon={faCog} />
              <span> Settings</span>
            </Link></li>
          </ul>
        </nav>
      </aside>
      <div className="main-content">
        <header className="header">
          <h1>Welcome to Your Dashboard</h1>
        </header>
        <div className="content">
          <div className="card">
            <h3>Total Users</h3>
            <p>{userCount}</p>
          </div>
          <div className="card">
            <h3>Total Products</h3>
            <p>{productCount !== 0 ? productCount : 'Loading...'}</p>
          </div>
          <div className="card">
            <h3>New Messages</h3>
            <p>5</p>
          </div>
          <div className="card">
            <h3>Total Orders</h3>
            <p>{orderCount}</p>
          </div>
       
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
