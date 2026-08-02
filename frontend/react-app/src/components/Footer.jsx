import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 4000);
        }
    };

    return (
        <footer style={{
            background: 'linear-gradient(180deg, #3d2b1f 0%, #1f140e 100%)',
            color: '#f5ede6',
            paddingTop: '60px',
            paddingBottom: '30px',
            borderTop: '4px solid #f1d27a',
            fontFamily: "'Outfit', sans-serif",
            position: 'relative',
            zIndex: 20
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 25px' }}>

                {/* Top Section: Brand + Columns Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '40px',
                    marginBottom: '50px'
                }}>

                    {/* Column 1: Brand & Bio */}
                    <div>
                        <h2 style={{
                            fontSize: '1.8rem',
                            color: '#f1d27a',
                            fontFamily: 'Playfair Display, serif',
                            marginBottom: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            Sweet County 🍰
                        </h2>
                        <p style={{ color: '#d4c5b9', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '20px' }}>
                            Handcrafting fresh, artisanal cakes, delicate pastries, and melt-in-your-mouth treats daily with 100% natural organic ingredients.
                        </p>

                        {/* Social Links */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {['📸 Instagram', '📘 Facebook', '🐦 X', '📌 Pinterest'].map((social, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        background: 'rgba(241, 210, 122, 0.12)',
                                        border: '1px solid rgba(241, 210, 122, 0.3)',
                                        color: '#f1d27a',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.78rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {social}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', color: '#f1d27a', marginBottom: '20px', fontFamily: 'Playfair Display, serif' }}>
                            Explore & Menu
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li><Link to="/store" style={{ color: '#e8dad0', textDecoration: 'none', fontSize: '0.95rem' }}>🎂 Artisanal Cakes</Link></li>
                            <li><Link to="/store" style={{ color: '#e8dad0', textDecoration: 'none', fontSize: '0.95rem' }}>🥐 Fresh Butter Pastries</Link></li>
                            <li><Link to="/store" style={{ color: '#e8dad0', textDecoration: 'none', fontSize: '0.95rem' }}>🍩 Gourmet Brioche Donuts</Link></li>
                            <li><Link to="/store" style={{ color: '#e8dad0', textDecoration: 'none', fontSize: '0.95rem' }}>🍫 Dark Truffle Brownies</Link></li>
                            <li><Link to="/cart" style={{ color: '#e8dad0', textDecoration: 'none', fontSize: '0.95rem' }}>🛒 Your Shopping Cart</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Store Hours & Delivery */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', color: '#f1d27a', marginBottom: '20px', fontFamily: 'Playfair Display, serif' }}>
                            Store Hours & Delivery
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem', color: '#e8dad0' }}>
                            <div>
                                <strong style={{ color: '#ffffff', display: 'block' }}>🕒 Baking & Store Hours:</strong>
                                <span style={{ color: '#c4b5a8' }}>Mon - Sat: 8:00 AM - 10:00 PM</span><br />
                                <span style={{ color: '#c4b5a8' }}>Sunday: 9:00 AM - 11:00 PM</span>
                            </div>
                            <div>
                                <strong style={{ color: '#ffffff', display: 'block' }}>⚡ Express Bakery Delivery:</strong>
                                <span style={{ color: '#10b981', fontWeight: 'bold' }}>Delivered fresh in 45 Mins</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Contact Details & Newsletter */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', color: '#f1d27a', marginBottom: '20px', fontFamily: 'Playfair Display, serif' }}>
                            Contact Us & Offers
                        </h3>
                        <div style={{ fontSize: '0.92rem', color: '#e8dad0', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div>📍 <strong>Address:</strong> 45 Baker Street, Sweet County Quarter</div>
                            <div>📞 <strong>Phone:</strong> +91 98765 43210 / 022-4567-8900</div>
                            <div>✉️ <strong>Email:</strong> hello@sweetcounty.com</div>
                        </div>

                        {/* Newsletter Input */}
                        <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="email"
                                placeholder="Enter email for 15% OFF..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    flex: 1,
                                    padding: '10px 14px',
                                    borderRadius: '20px',
                                    border: '1px solid #a36b4f',
                                    background: '#2c1c14',
                                    color: '#ffffff',
                                    fontSize: '0.85rem',
                                    outline: 'none'
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    background: '#f1d27a',
                                    color: '#2d1e18',
                                    border: 'none',
                                    padding: '10px 18px',
                                    borderRadius: '20px',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Subscribe 💌
                            </button>
                        </form>
                        {subscribed && (
                            <span style={{ color: '#10b981', fontSize: '0.82rem', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>
                                🎉 Subscribed! 15% promo code sent to your inbox.
                            </span>
                        )}
                    </div>

                </div>

                {/* Bottom Bar: Copyright & Payment Badges */}
                <div style={{
                    borderTop: '1px solid rgba(241, 210, 122, 0.2)',
                    paddingTop: '25px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '15px',
                    fontSize: '0.85rem',
                    color: '#a89a8e'
                }}>
                    <div>
                        © 2026 <strong>Sweet County Artisanal Bakery</strong>. All rights reserved. • Crafted with ❤️ & Fresh Butter.
                    </div>

                    {/* Payment Accept Badges */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', color: '#d4c5b9' }}>100% Secure Payment:</span>
                        <span style={{ background: '#2c1c14', padding: '4px 10px', borderRadius: '6px', color: '#f1d27a', fontSize: '0.75rem', fontWeight: 'bold' }}>⚡ Razorpay</span>
                        <span style={{ background: '#2c1c14', padding: '4px 10px', borderRadius: '6px', color: '#ffffff', fontSize: '0.75rem', fontWeight: 'bold' }}>📲 UPI</span>
                        <span style={{ background: '#2c1c14', padding: '4px 10px', borderRadius: '6px', color: '#ffffff', fontSize: '0.75rem', fontWeight: 'bold' }}>💳 Cards</span>
                        <span style={{ background: '#2c1c14', padding: '4px 10px', borderRadius: '6px', color: '#ffffff', fontSize: '0.75rem', fontWeight: 'bold' }}>💵 COD</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
