import React, { useState, useEffect } from 'react';
import './styles.css';
import Navbar from './Navbar';
import Menu from './Menu';
import Cart from './Cart';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, cartQuantity: cartItem.cartQuantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, cartQuantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId
          ? { ...item, cartQuantity: quantity }
          : item
      ));
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (isAdmin) {
      return <AdminDashboard onLogout={handleLogout} />;
    }

    switch (currentPage) {
      case 'home':
        return <Menu addToCart={addToCart} />;
      case 'cart':
        return (
          <Cart
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            updateCartQuantity={updateCartQuantity}
          />
        );
      case 'admin-login':
        return <AdminLogin setIsAdmin={setIsAdmin} />;
      default:
        return <Menu addToCart={addToCart} />;
    }
  };

  return (
    <div className="app">
      <Navbar
        cartCount={cartItems.length}
        onMenuClick={() => setCurrentPage('home')}
        onCartClick={() => setCurrentPage('cart')}
        onAdminClick={() => setCurrentPage('admin-login')}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
