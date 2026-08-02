import React, { useState, useEffect, useContext } from 'react';
import ProductCard from './ProductCard'; 
import CakeSpotlightModal from './CakeSpotlightModal';
import BakeryGridBackground from './BakeryGridBackground';
import { CartContext } from '../context/CartContext';

const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : '';

const ProductGrid = ({ category, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/api/products?`;
        if (category !== 'All') url += `category=${category}&`;
        if (searchQuery) url += `search=${searchQuery}`;

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category, searchQuery]);

  if (loading) return <div className="loader">Baking your results...</div>;

  return (
    <div className="product-grid-wrapper" style={{ position: 'relative', width: '100%', minHeight: '600px' }}>
      {/* 🌟 INTERESTING DYNAMIC BACKGROUND BEHIND CARDS */}
      <BakeryGridBackground />

      {/* Floating 3D Spotlight Modal when Cake Card is Chosen */}
      {selectedProduct && (
        <CakeSpotlightModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Card Grid in Foreground */}
      <div className="product-container" style={{ position: 'relative', zIndex: 10 }}>
        {products.length === 0 ? (
          <p className="no-results">Oops! We couldn't find any treats matching that.</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onSelect={(prod) => setSelectedProduct(prod)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;