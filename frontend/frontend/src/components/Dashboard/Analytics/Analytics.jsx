import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './Analytics.css'; // Optional: create a CSS file for additional styles if needed.

function Analytics() {
  const [userCount, setUserCount] = useState(0); // State to store the user count

  // Fetch user data from the API
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/users'); // Replace with your API URL
      const data = await response.json();

      if (data && data.users) {
        setUserCount(data.users.length); // Assuming the API returns an array of users
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Render the D3 bar chart
  const renderChart = () => {
    const svg = d3.select('#chart')
      .attr('width', 400)
      .attr('height', 200);

    svg.selectAll('*').remove(); // Clear any existing content

    const data = [userCount]; // Example: using userCount to display

    // Set dimensions and scales
    const width = 400;
    const height = 200;
    const xScale = d3.scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, width])
      .padding(0.1);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

    // Create a tooltip div
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Append rectangles for bar chart
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d))
      .attr('fill', '#4CAF50')
      .on('mouseover', function (event, d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(`Users: ${d}`)
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
    fetchUserData(); // Fetch data on component mount
  }, []);

  useEffect(() => {
    renderChart(); // Render chart whenever userCount changes
  }, [userCount]);

  return (
    <div>
      <h1>Analytics</h1>
      <h3>User Count Bar Chart</h3>
      <svg id="chart"></svg> {/* SVG element for D3 chart */}
    </div>
  );
}

export default Analytics;
