import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product, onSelect }) => {
  const { addToCart } = useContext(CartContext);
  const [addedToast, setAddedToast] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1200);
  };

  return (
    <div
      className={`card elevatable-cake-card ${isHovered ? 'floating-in-air-card' : ''}`}
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <img src={product.image} alt={product.name} />

      <div className="card-info">
        <span className="rating">⭐ {product.rating}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="card-footer">
          <h4>₹{product.price}</h4>
          <button 
            onClick={handleAdd}
            style={{
              background: addedToast ? '#4CAF50' : '#4b3832',
              transition: 'background 0.3s'
            }}
          >
            {addedToast ? '✓ Added!' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;