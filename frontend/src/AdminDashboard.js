import React, { useState, useEffect } from 'react';

function AdminDashboard({ onLogout }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    image: ''
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/menu');
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      setMenuItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.quantity || !formData.price || !formData.image) {
      alert('All fields are required');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `http://localhost:5000/api/menu/${editingId}`
        : 'http://localhost:5000/api/menu';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          quantity: formData.quantity,
          price: parseFloat(formData.price),
          image: formData.image
        })
      });

      if (!response.ok) throw new Error('Failed to save menu item');

      setFormData({ name: '', quantity: '', price: '', image: '' });
      setEditingId(null);
      setShowForm(false);
      fetchMenuItems();
      alert(editingId ? 'Menu item updated successfully!' : 'Menu item added successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEditMenuItem = (item) => {
    setFormData({
      name: item.name,
      quantity: item.quantity,
      price: item.price.toString(),
      image: item.image
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete menu item');

      fetchMenuItems();
      alert('Menu item deleted successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', quantity: '', price: '', image: '' });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-indicator">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add New Menu Item
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-container">
            <h3>{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
            <form onSubmit={handleAddMenuItem}>
              <div className="form-group">
                <label htmlFor="name">Food Name:</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter food name"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  id="quantity"
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 1, Full Plate, 500ml"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (Rs):</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Image URL:</label>
                <input
                  id="image"
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingId ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="menu-management">
          <h3>Current Menu Items</h3>
          {error && <div className="error-message">{error}</div>}

          {menuItems.length === 0 ? (
            <p>No menu items available</p>
          ) : (
            <div className="items-table">
              {menuItems.map(item => (
                <div key={item.id} className="admin-item-row">
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity} | Price: Rs {item.price}</p>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEditMenuItem(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteMenuItem(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
