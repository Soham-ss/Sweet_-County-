import React, { useState } from 'react';

const CakeSpotlightModal = ({ product, onClose, onAddToCart }) => {
    const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
    const [added, setAdded] = useState(false);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -30;
        setMouseTilt({ x, y });
    };

    const handleAdd = () => {
        onAddToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(20, 13, 9, 0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
            padding: '20px', animation: 'fadeIn 0.3s ease'
        }}>
            <div
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setMouseTilt({ x: 0, y: 0 })}
                style={{
                    background: 'radial-gradient(circle at center, #2e1c14 0%, #1a100b 100%)',
                    width: '100%', maxWidth: '780px', borderRadius: '30px',
                    border: '1px solid rgba(241, 210, 122, 0.3)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                    overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr',
                    position: 'relative', perspective: '1000px'
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '20px', right: '20px', zIndex: 50,
                        background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                        width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
                        fontSize: '1.2rem', fontWeight: 'bold'
                    }}
                >
                    ✕
                </button>

                {/* Left: Floating Cake Stage */}
                <div style={{
                    padding: '40px 20px', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', position: 'relative',
                    background: 'radial-gradient(circle, rgba(241, 210, 122, 0.15) 0%, transparent 70%)',
                    minHeight: '340px'
                }}>
                    {/* Floating Orbiting Sparkles around cake */}
                    <span className="floating-air-sparkle sp-1">✨</span>
                    <span className="floating-air-sparkle sp-2">🍓</span>
                    <span className="floating-air-sparkle sp-3">🍫</span>
                    <span className="floating-air-sparkle sp-4">🌟</span>

                    <span style={{
                        background: 'rgba(241, 210, 122, 0.2)', color: '#f1d27a',
                        border: '1px solid #f1d27a', padding: '4px 14px', borderRadius: '20px',
                        fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '1px'
                    }}>
                        ✨ FLOATING IN AIR 3D VIEW
                    </span>

                    {/* Levitating Floating Cake Container */}
                    <div style={{
                        transform: `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg)`,
                        transition: 'transform 0.15s ease-out',
                        animation: 'floatingCakeAir 4s ease-in-out infinite',
                        display: 'flex', flexDirection: 'column', alignItems: 'center'
                    }}>
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{
                                width: '230px', height: '230px', objectFit: 'cover',
                                borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 30px rgba(241, 210, 122, 0.4)',
                                border: '3px solid rgba(241, 210, 122, 0.6)'
                            }}
                        />

                        {/* Elevated 3D Shadow on Floor */}
                        <div style={{
                            width: '180px', height: '18px', background: 'rgba(0,0,0,0.6)',
                            borderRadius: '50%', filter: 'blur(8px)', marginTop: '25px',
                            animation: 'floatingShadowPulse 4s ease-in-out infinite'
                        }}></div>
                    </div>
                </div>

                {/* Right: Details */}
                <div style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
                    <div>
                        <span style={{ color: '#f1d27a', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            {product.category} • ⭐ {product.rating}
                        </span>
                        <h2 style={{ fontSize: '2rem', marginTop: '6px', color: '#fff' }}>{product.name}</h2>
                        <p style={{ color: '#d4c5b9', fontSize: '0.95rem', marginTop: '12px', lineHeight: '1.6' }}>
                            {product.description}
                        </p>

                        <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.08)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(241, 210, 122, 0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', color: '#f1d27a' }}>
                                <span>🌾 Ingredients:</span>
                                <span>100% French Butter & Cocoa</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#f1d27a' }}>
                                <span>⏱️ Freshness:</span>
                                <span>Baked fresh every 2 hours</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(241, 210, 122, 0.2)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Price</span>
                            <h3 style={{ color: '#f1d27a', fontSize: '1.8rem' }}>₹{product.price}</h3>
                        </div>
                        <button
                            onClick={handleAdd}
                            style={{
                                padding: '14px 28px', background: added ? '#10b981' : 'linear-gradient(135deg, #f1d27a 0%, #d4af37 100%)',
                                color: '#1c130e', border: 'none', borderRadius: '25px', fontWeight: '900',
                                fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease',
                                boxShadow: '0 6px 20px rgba(241, 210, 122, 0.4)'
                            }}
                        >
                            {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CakeSpotlightModal;
