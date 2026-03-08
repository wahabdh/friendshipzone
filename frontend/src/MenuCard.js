import React from 'react';

function MenuCard({ item, onAddToCart }) {
  const whatsappNumber = '923XXXXXXXXX';
  const whatsappMessage = `Hello FriendshipZone\n\nI want to order:\n\n${item.name} – Rs ${item.price}`;

  const handleWhatsAppOrder = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="menu-card">
      <img src={item.image} alt={item.name} className="card-image" />
      
      <div className="card-content">
        <h3 className="card-title">{item.name}</h3>
        
        <div className="card-info">
          <p className="card-quantity">Qty: {item.quantity}</p>
          <p className="card-price">Rs {item.price}</p>
        </div>

        <div className="card-buttons">
          <button
            className="btn btn-add-to-cart"
            onClick={() => onAddToCart(item)}
          >
            Add to Cart
          </button>
          
          <button
            className="btn btn-whatsapp"
            onClick={handleWhatsAppOrder}
          >
            Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
