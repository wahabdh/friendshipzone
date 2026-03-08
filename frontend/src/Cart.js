import React from 'react';

function Cart({ cartItems, removeFromCart, updateCartQuantity }) {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const whatsappNumber = '923XXXXXXXXX';

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    let message = 'Hello FriendshipZone\n\nI want to order:\n\n';
    cartItems.forEach(item => {
      message += `${item.name} (x${item.cartQuantity}) – Rs ${item.price * item.cartQuantity}\n`;
    });
    message += `\nTotal: Rs ${calculateTotal()}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <div className="empty-cart">
          <p>Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>Price: Rs {item.price}</p>
            </div>

            <div className="cart-item-quantity">
              <label htmlFor={`qty-${item.id}`}>Quantity:</label>
              <input
                id={`qty-${item.id}`}
                type="number"
                min="1"
                value={item.cartQuantity}
                onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                className="quantity-input"
              />
            </div>

            <div className="cart-item-total">
              <p>Total: Rs {item.price * item.cartQuantity}</p>
            </div>

            <button
              className="btn btn-remove"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>Rs {calculateTotal()}</span>
        </div>
        <div className="summary-total">
          <span>Total:</span>
          <span>Rs {calculateTotal()}</span>
        </div>
      </div>

      <button className="btn btn-checkout" onClick={handleCheckout}>
        Checkout on WhatsApp
      </button>
    </div>
  );
}

export default Cart;
