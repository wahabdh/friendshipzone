import React from 'react';

function Navbar({
  cartCount,
  onMenuClick,
  onCartClick,
  onAdminClick,
  isAdmin,
  onLogout
}) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={onMenuClick}>
          <h1>FriendshipZone</h1>
          <p className="tagline">Delicious Food Delivered With Friendship</p>
        </div>

        <div className="navbar-menu">
          <button className="nav-button" onClick={onMenuClick}>
            Menu
          </button>

          <button className="nav-button cart-button" onClick={onCartClick}>
            <span className="cart-icon">🛒</span>
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {!isAdmin && (
            <button className="nav-button admin-button" onClick={onAdminClick}>
              Admin
            </button>
          )}

          {isAdmin && (
            <button className="nav-button logout-button" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
