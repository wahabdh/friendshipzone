import React, { useState, useEffect } from 'react';
import MenuCard from './MenuCard';

function Menu({ addToCart }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/menu');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="menu-container">
        <div className="loading-indicator">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-container">
        <div className="error-message">
          Error: {error}
        </div>
        <button className="retry-button" onClick={fetchMenuItems}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="menu-container">
      <h2 className="menu-title">Our Menu</h2>
      <div className="menu-grid">
        {menuItems.map(item => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default Menu;
