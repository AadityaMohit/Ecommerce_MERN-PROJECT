import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';  
import loader from '../Assets/loader.png'; 

function Cards() {
  const [clothingItems, setClothingItems] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const API_KEY = 'z6IUUUaLUBvdPjfwW8VVdCTA0uENxlJoDKXWU8h1y07kQhkSpcDzH7H4';

  useEffect(() => {
    const fetchClothingItems = async () => {
      setLoading(true); 
      try {
        const response = await axios.get('https://api.pexels.com/v1/search', {
          headers: {
            Authorization: API_KEY,
          },
          params: {
            query: 'clothes',
            per_page: 10,  
          },
        });

   
        const items = response.data.photos.map(photo => ({
          id: photo.id,
          image: photo.src.original,  
          title: `Clothing Item ${photo.id}`,  
          description: 'Description of clothing item',  
          price: (Math.random() * (100 - 10) + 10).toFixed(2),  
          rating: Math.floor(Math.random() * 5) + 1,  
        }));

        setClothingItems(items);
      } catch (error) {
        console.error('Error fetching clothing items:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchClothingItems();
  }, [API_KEY]);

  return (
    <div className="features-section">
      <h2>Clothing Collection</h2>
      <div className="features">
        {loading ? (  
          <div className="loader">
            <img src={loader} alt="Loading..." />
          </div>
        ) : (
          clothingItems.map(item => (
            <div className={`product-card ${item.visible ? 'visible' : ''}`} key={item.id}>
              <img src={item.image} style={{ height: '200px', width: '100%', objectFit: 'cover' }} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
              <p style={{ color: 'green' }}>
               
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar key={index} color={index < item.rating ? 'green' : 'lightgray'} />
                ))}
                <span> {item.rating}</span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Cards;
