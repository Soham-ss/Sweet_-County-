import React, { useState, useEffect } from 'react';

const Cake4DModal = ({ product, onClose, onAddToCart }) => {
    const [exploded, setExploded] = useState(30); // gap between layers in px (0 to 80)
    const [rotationY, setRotationY] = useState(-25); // degrees
    const [rotationX, setRotationX] = useState(15); // degrees
    const [autoRotate, setAutoRotate] = useState(true);
    const [activeTab, setActiveTab] = useState('assembly'); // 'assembly' or 'recipe'
    const [assemblingStep, setAssemblingStep] = useState(4); // 1 to 4 layers visible

    // Auto rotate effect
    useEffect(() => {
        if (!autoRotate) return;
        const interval = setInterval(() => {
            setRotationY(prev => (prev + 1) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, [autoRotate]);

    // Layer definitions based on product category or name
    const getLayers = () => {
        const cat = product?.category || 'Cakes';
        if (cat === 'Cakes' || cat === 'Pastries') {
            return [
                {
                    level: 1,
                    name: 'Base Layer — Moist Butter Sponge',
                    desc: 'Baked at 175°C with French cultured butter and Madagascar vanilla beans.',
                    color: '#d4a373',
                    border: '#b07d4f',
                    height: '35px',
                    width: '200px',
                    texture: 'linear-gradient(45deg, #d4a373 25%, #c89565 50%, #d4a373 75%)',
                    icon: '🧈'
                },
                {
                    level: 2,
                    name: 'Filling Layer — Fruit Reduction & Ganache',
                    desc: 'Organic berry reduction layered with 64% Belgian dark chocolate ganache.',
                    color: '#8b4513',
                    border: '#5c2c09',
                    height: '25px',
                    width: '190px',
                    texture: 'linear-gradient(135deg, #6b2d0c 0%, #a04010 50%, #4a1d07 100%)',
                    icon: '🍓'
                },
                {
                    level: 3,
                    name: 'Frosting Layer — Cream Cheese Velvet',
                    desc: 'Whipped cream cheese frosting infused with white chocolate velvet glaze.',
                    color: '#fff8dc',
                    border: '#e6d8a7',
                    height: '30px',
                    width: '180px',
                    texture: 'linear-gradient(180deg, #ffffff 0%, #f7ecc6 100%)',
                    icon: '🍦'
                },
                {
                    level: 4,
                    name: 'Garnish Layer — 24K Gold Leaf & Berries',
                    desc: 'Topped with fresh handpicked berries, cocoa dust, and edible 24K gold foil.',
                    color: '#d4af37',
                    border: '#b89428',
                    height: '20px',
                    width: '170px',
                    texture: 'radial-gradient(circle, #ffd700 0%, #d4af37 70%, #aa8410 100%)',
                    icon: '✨'
                }
            ];
        } else if (cat === 'Donuts') {
            return [
                {
                    level: 1,
                    name: 'Base — Brioche Donut Ring',
                    desc: 'Airy brioche dough fried to golden perfection.',
                    color: '#e2b078',
                    border: '#c49054',
                    height: '30px',
                    width: '190px',
                    texture: 'linear-gradient(90deg, #e2b078, #c49054)',
                    icon: '🍩'
                },
                {
                    level: 2,
                    name: 'Core Filling — Sweet Cream / Custard',
                    desc: 'Rich Madagascar vanilla custard injected throughout.',
                    color: '#fef08a',
                    border: '#facc15',
                    height: '20px',
                    width: '180px',
                    texture: 'linear-gradient(90deg, #fef08a, #fef9c3)',
                    icon: '🥛'
                },
                {
                    level: 3,
                    name: 'Glaze — Silky Chocolate Dip',
                    desc: 'Dipper in warm cocoa glaze for a glossy finish.',
                    color: '#451a03',
                    border: '#270e02',
                    height: '22px',
                    width: '185px',
                    texture: 'linear-gradient(180deg, #78350f, #451a03)',
                    icon: '🍫'
                },
                {
                    level: 4,
                    name: 'Topping — Rainbow Sprinkles & Toffee',
                    desc: 'Criss-cross drizzle and crunch sprinkles.',
                    color: '#f43f5e',
                    border: '#be123c',
                    height: '15px',
                    width: '175px',
                    texture: 'radial-gradient(circle, #f43f5e, #fb7185)',
                    icon: '🌈'
                }
            ];
        } else {
            // Brownies
            return [
                {
                    level: 1,
                    name: 'Base — Fudge Brownie Core',
                    desc: 'Dense, fudgy center baked with Dutch processed cocoa.',
                    color: '#3b1c0a',
                    border: '#200e04',
                    height: '35px',
                    width: '180px',
                    texture: 'linear-gradient(45deg, #3b1c0a, #57290f)',
                    icon: '🍫'
                },
                {
                    level: 2,
                    name: 'Swirl — Salted Caramel & Walnut',
                    desc: 'House-made salted caramel swirled with roasted walnut chunks.',
                    color: '#d97706',
                    border: '#b45309',
                    height: '20px',
                    width: '175px',
                    texture: 'linear-gradient(90deg, #d97706, #f59e0b)',
                    icon: '🥜'
                },
                {
                    level: 3,
                    name: 'Top Layer — Crackly Crusted Surface',
                    desc: 'Classic paper-thin crackly meringue top layer.',
                    color: '#78350f',
                    border: '#451a03',
                    height: '18px',
                    width: '180px',
                    texture: 'linear-gradient(180deg, #78350f, #3b1c0a)',
                    icon: '✨'
                },
                {
                    level: 4,
                    name: 'Finish — Sea Salt Flakes & Chocolate Drizzle',
                    desc: 'Finished with Maldon sea salt flakes and warm dark chocolate.',
                    color: '#f8fafc',
                    border: '#e2e8f0',
                    height: '12px',
                    width: '170px',
                    texture: 'radial-gradient(circle, #ffffff, #cbd5e1)',
                    icon: '🧂'
                }
            ];
        }
    };

    const layers = getLayers();

    const playAssembly = () => {
        setAutoRotate(false);
        setExploded(70);
        setAssemblingStep(1);
        setTimeout(() => setAssemblingStep(2), 600);
        setTimeout(() => setAssemblingStep(3), 1200);
        setTimeout(() => setAssemblingStep(4), 1800);
        setTimeout(() => {
            setExploded(20);
            setAutoRotate(true);
        }, 2600);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(26, 18, 15, 0.85)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
            padding: '20px', animation: 'fadeIn 0.3s ease'
        }}>
            <div style={{
                background: '#fff', width: '100%', maxWidth: '920px', borderRadius: '24px',
                overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                display: 'grid', gridTemplateColumns: '1.2fr 1fr', minHeight: '560px'
            }}>
                {/* 3D/4D Interactive Stage */}
                <div style={{
                    background: 'radial-gradient(circle at center, #2d1f19 0%, #150d0a 100%)',
                    padding: '30px', position: 'relative', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                }}>
                    {/* Floating ingredient particles */}
                    <div className="floating-particle" style={{ position: 'absolute', top: '15%', left: '12%', fontSize: '1.8rem', opacity: 0.8 }}>✨</div>
                    <div className="floating-particle" style={{ position: 'absolute', top: '25%', right: '15%', fontSize: '1.5rem', opacity: 0.7, animationDelay: '0.8s' }}>🍓</div>
                    <div className="floating-particle" style={{ position: 'absolute', bottom: '20%', left: '15%', fontSize: '1.6rem', opacity: 0.7, animationDelay: '1.2s' }}>🍫</div>
                    <div className="floating-particle" style={{ position: 'absolute', bottom: '15%', right: '12%', fontSize: '1.8rem', opacity: 0.8, animationDelay: '0.4s' }}>✨</div>

                    {/* Top badges */}
                    <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '8px' }}>
                        <span style={{ background: '#a36b4f', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                            ✨ 4D LAYER EXPLORER
                        </span>
                        <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem' }}>
                            360° Interactive
                        </span>
                    </div>

                    {/* 3D Perspective Stage */}
                    <div style={{
                        perspective: '1000px', width: '100%', height: '320px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                    }}>
                        <div style={{
                            transformStyle: 'preserve-3d',
                            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                            transition: autoRotate ? 'none' : 'transform 0.1s ease-out',
                            display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', justifyContent: 'center',
                            cursor: 'grab'
                        }}>
                            {layers.slice(0, assemblingStep).map((layer, idx) => (
                                <div
                                    key={layer.level}
                                    style={{
                                        width: layer.width,
                                        height: layer.height,
                                        background: layer.texture,
                                        borderRadius: '50px',
                                        border: `2px solid ${layer.border}`,
                                        marginBottom: `${exploded}px`,
                                        boxShadow: `0 15px 30px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4)`,
                                        transform: `translateZ(${idx * 15}px)`,
                                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontWeight: 'bold', fontSize: '0.85rem', textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                                        position: 'relative'
                                    }}
                                >
                                    <span style={{ position: 'absolute', left: '-35px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>
                                        L{layer.level}
                                    </span>
                                    {layer.icon} Layer {layer.level}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3D Stage Controls */}
                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', padding: '15px 20px', borderRadius: '16px', backdropFilter: 'blur(5px)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: '#fff', fontSize: '0.85rem' }}>
                            <span>Explode Layers (3D Z-Height): <strong>{exploded}px</strong></span>
                            <button
                                onClick={playAssembly}
                                style={{ background: '#f1d27a', color: '#3d2b1f', border: 'none', padding: '5px 14px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                                ▶️ Auto Assemble
                            </button>
                        </div>
                        <input
                            type="range" min="0" max="80" value={exploded}
                            onChange={e => setExploded(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#f1d27a', cursor: 'pointer' }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <label style={{ color: '#ccc', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox" checked={autoRotate}
                                    onChange={e => setAutoRotate(e.target.checked)}
                                    style={{ accentColor: '#f1d27a' }}
                                />
                                Auto 360° Spin
                            </label>
                            <span style={{ color: '#aaa', fontSize: '0.75rem' }}>Drag or slider to rotate</span>
                        </div>
                    </div>
                </div>

                {/* Right Details & Recipe Breakdown */}
                <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <span style={{ color: '#a36b4f', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {product.category} • ⭐ {product.rating}
                                </span>
                                <h2 style={{ color: '#3d2b1f', fontSize: '1.6rem', marginTop: '4px' }}>{product.name}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                style={{ background: '#f0ebe4', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem', color: '#4b3832' }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '15px', borderBottom: '2px solid #f0ebe4', margin: '20px 0 15px 0' }}>
                            <button
                                onClick={() => setActiveTab('assembly')}
                                style={{
                                    border: 'none', background: 'none', paddingBottom: '10px',
                                    borderBottom: activeTab === 'assembly' ? '3px solid #a36b4f' : 'none',
                                    fontWeight: 'bold', color: activeTab === 'assembly' ? '#a36b4f' : '#888', cursor: 'pointer'
                                }}
                            >
                                🥞 4D Layer Breakdown
                            </button>
                            <button
                                onClick={() => setActiveTab('recipe')}
                                style={{
                                    border: 'none', background: 'none', paddingBottom: '10px',
                                    borderBottom: activeTab === 'recipe' ? '3px solid #a36b4f' : 'none',
                                    fontWeight: 'bold', color: activeTab === 'recipe' ? '#a36b4f' : '#888', cursor: 'pointer'
                                }}
                            >
                                📜 Recipe & Ingredients
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'assembly' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                                {layers.map((l) => (
                                    <div
                                        key={l.level}
                                        style={{
                                            padding: '12px', borderRadius: '12px', background: '#faf7f2',
                                            borderLeft: `4px solid ${l.border}`
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.9rem', color: '#3d2b1f' }}>
                                            <span>{l.icon} Layer {l.level}: {l.name}</span>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: '#7a635c', marginTop: '4px', lineHeight: '1.4' }}>{l.desc}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ background: '#faf7f2', padding: '12px', borderRadius: '12px' }}>
                                    <strong style={{ fontSize: '0.85rem', color: '#3d2b1f' }}>🌾 Premium Flour & Butter:</strong>
                                    <p style={{ fontSize: '0.8rem', color: '#7a635c', margin: '2px 0 0 0' }}>Imported French AOP Butter & Organic Unbleached Flour</p>
                                </div>
                                <div style={{ background: '#faf7f2', padding: '12px', borderRadius: '12px' }}>
                                    <strong style={{ fontSize: '0.85rem', color: '#3d2b1f' }}>🍫 Cocoa & Vanilla:</strong>
                                    <p style={{ fontSize: '0.8rem', color: '#7a635c', margin: '2px 0 0 0' }}>64% Valrhona Dark Chocolate & Bourbon Vanilla Pods</p>
                                </div>
                                <div style={{ background: '#faf7f2', padding: '12px', borderRadius: '12px' }}>
                                    <strong style={{ fontSize: '0.85rem', color: '#3d2b1f' }}>⏱️ Baking & Craft Time:</strong>
                                    <p style={{ fontSize: '0.8rem', color: '#7a635c', margin: '2px 0 0 0' }}>Slowly baked for 45 mins at 175°C then rested for 4 hours</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom CTA */}
                    <div style={{ borderTop: '2px solid #f0ebe4', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>Price</span>
                            <h3 style={{ color: '#a36b4f', fontSize: '1.5rem' }}>₹{product.price}</h3>
                        </div>
                        <button
                            className="cta-btn"
                            onClick={() => {
                                onAddToCart(product);
                                onClose();
                            }}
                            style={{ padding: '12px 25px' }}
                        >
                            🛒 Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cake4DModal;
