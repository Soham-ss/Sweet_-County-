import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import CakePackingAnimation from './CakePackingAnimation';

const CartPage = () => {
    const { cart, addToCart, removeFromCart, deleteFromCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [showPacking, setShowPacking] = useState(false);

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const firstItem = cart.length > 0 ? cart[0] : null;

    const handleProceed = () => {
        setShowPacking(true);
    };

    const handlePackingComplete = () => {
        setShowPacking(false);
        navigate('/payment');
    };

    return (
        <div className="discovery-section" style={{ maxWidth: '880px', minHeight: '65vh', margin: '0 auto', padding: '40px 20px' }}>
            {/* 🍰 3D CAKE PACKING ANIMATION MODAL */}
            {showPacking && (
                <CakePackingAnimation
                    cakeImage={firstItem?.image}
                    cakeName={firstItem?.name}
                    onComplete={handlePackingComplete}
                />
            )}

            {/* Friendly Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
                <div>
                    <h2 style={{ fontSize: '2.2rem', color: '#3d2b1f', fontFamily: 'Playfair Display, serif' }}>
                        Your Order Cart 🛒
                    </h2>
                    <p style={{ color: '#7a635c', fontSize: '0.95rem', marginTop: '4px' }}>
                        Review your delicious treats before proceeding to payment.
                    </p>
                </div>
                {cart.length > 0 && (
                    <span style={{ background: '#f1d27a', color: '#3d2b1f', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.88rem' }}>
                        {cart.length} {cart.length === 1 ? 'Item' : 'Items'} Selected
                    </span>
                )}
            </div>

            {cart.length === 0 ? (
                <div style={{
                    background: '#ffffff', padding: '50px 30px', borderRadius: '20px',
                    textAlign: 'center', boxShadow: '0 6px 25px rgba(0,0,0,0.05)', border: '1px solid #f0ebe4'
                }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🍰</div>
                    <h3 style={{ fontSize: '1.6rem', color: '#3d2b1f', marginBottom: '10px' }}>Your cart is empty!</h3>
                    <p style={{ marginBottom: '25px', fontSize: '1rem', color: '#7a635c' }}>
                        Explore our freshly baked artisanal cakes, pastries, and treats.
                    </p>
                    <Link to="/store" className="cta-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        Explore the Menu 🍰
                    </Link>
                </div>
            ) : (
                <div style={{
                    background: '#ffffff', padding: '30px', borderRadius: '20px',
                    boxShadow: '0 8px 30px rgba(75, 56, 50, 0.07)', border: '1px solid #f0ebe4'
                }}>
                    {/* Cart Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '30px' }}>
                        {cart.map(item => (
                            <div key={item._id} style={{
                                display: 'flex', alignItems: 'center', gap: '18px',
                                borderBottom: '1px solid #f2ece4', paddingBottom: '18px'
                            }}>
                                {/* Item Thumbnail */}
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{
                                        width: '75px', height: '75px', objectFit: 'cover',
                                        borderRadius: '14px', border: '1.5px solid #f1d27a'
                                    }}
                                />

                                {/* Item Title & Price */}
                                <div style={{ flexGrow: 1 }}>
                                    <h3 style={{ fontSize: '1.15rem', color: '#3d2b1f', marginBottom: '4px' }}>{item.name}</h3>
                                    <span style={{ color: '#a36b4f', fontWeight: '600', fontSize: '0.95rem' }}>₹{item.price} each</span>
                                </div>

                                {/* Quantity Controls */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#faf7f2', padding: '4px 10px', borderRadius: '20px' }}>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: '#a36b4f', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                                        >−</button>
                                        <span style={{ fontWeight: 'bold', minWidth: '22px', textAlign: 'center', color: '#3d2b1f', fontSize: '1rem' }}>{item.quantity}</span>
                                        <button
                                            onClick={() => addToCart(item)}
                                            style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: '#a36b4f', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                                        >+</button>
                                    </div>

                                    <h4 style={{ color: '#3d2b1f', fontSize: '1.2rem', minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>
                                        ₹{item.price * item.quantity}
                                    </h4>

                                    <button
                                        onClick={() => deleteFromCart(item._id)}
                                        style={{ background: 'none', border: 'none', color: '#cc4444', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}
                                        title="Remove item"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Happy Reassuring Perks Banner */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '25px' }}>
                        <div style={{ background: '#faf7f2', padding: '12px 14px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>✨</div>
                            <strong style={{ fontSize: '0.82rem', color: '#3d2b1f', display: 'block' }}>Fresh Baked Guarantee</strong>
                            <span style={{ fontSize: '0.75rem', color: '#7a635c' }}>Baked fresh for your order</span>
                        </div>

                        <div style={{ background: '#faf7f2', padding: '12px 14px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>⚡</div>
                            <strong style={{ fontSize: '0.82rem', color: '#3d2b1f', display: 'block' }}>Free Express Delivery</strong>
                            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>₹0 Delivery Fee</span>
                        </div>

                        <div style={{ background: '#faf7f2', padding: '12px 14px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🔒</div>
                            <strong style={{ fontSize: '0.82rem', color: '#3d2b1f', display: 'block' }}>Safe & Encrypted</strong>
                            <span style={{ fontSize: '0.75rem', color: '#7a635c' }}>100% Razorpay Secure</span>
                        </div>
                    </div>

                    {/* Order Total & Actions */}
                    <div style={{ background: '#fdfaf5', padding: '20px 24px', borderRadius: '16px', border: '1px solid #f1e9dc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ color: '#7a635c', fontSize: '0.9rem', display: 'block' }}>Total Amount to Pay</span>
                            <h2 style={{ fontSize: '2.2rem', color: '#a36b4f', fontFamily: 'Playfair Display, serif', margin: 0 }}>₹{totalAmount}</h2>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <Link to="/store" style={{ color: '#a36b4f', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.95rem' }}>
                                ← Back to Store
                            </Link>

                            <button
                                className="cta-btn"
                                onClick={handleProceed}
                                style={{ padding: '14px 32px', fontSize: '1.05rem', background: '#a36b4f', color: '#fff' }}
                            >
                                Pack & Proceed to Payment 📦 →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;