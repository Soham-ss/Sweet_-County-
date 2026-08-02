import React, { useState } from 'react';

const BakeryGridBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 50;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 50;
    setMousePos({ x, y });

    // Spawn trailing golden sparkles on side margins
    if (Math.random() > 0.82) {
      const id = Date.now() + Math.random();
      setRipples(prev => [
        ...prev.slice(-10),
        {
          id,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          icon: ['✨', '🌟', '🍓', '🍫', '💖', '🥐'][Math.floor(Math.random() * 6)]
        }
      ]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 1000);
    }
  };

  // Side margin floating ingredients (Left and Right margins)
  const marginFloatingItems = [
    // Left Side Margin Items
    { icon: '🍓', style: { top: '5%', left: '2%' }, anim: 'gridFloatSlow1', size: '3.8rem' },
    { icon: '🥐', style: { top: '22%', left: '3%' }, anim: 'gridFloatSlow2', size: '4rem' },
    { icon: '🍫', style: { top: '40%', left: '1.5%' }, anim: 'gridFloatSlow3', size: '3.6rem' },
    { icon: '🍩', style: { top: '58%', left: '3.5%' }, anim: 'gridFloatSlow1', size: '3.8rem' },
    { icon: '🎂', style: { top: '76%', left: '2%' }, anim: 'gridFloatSlow2', size: '4.2rem' },
    { icon: '✨', style: { top: '92%', left: '4%' }, anim: 'gridFloatSlow3', size: '3rem' },

    // Right Side Margin Items
    { icon: '🍫', style: { top: '8%', right: '2%' }, anim: 'gridFloatSlow2', size: '3.8rem' },
    { icon: '🧁', style: { top: '25%', right: '3%' }, anim: 'gridFloatSlow3', size: '3.6rem' },
    { icon: '🍓', style: { top: '44%', right: '1.5%' }, anim: 'gridFloatSlow1', size: '4rem' },
    { icon: '🍪', style: { top: '62%', right: '3%' }, anim: 'gridFloatSlow2', size: '3.5rem' },
    { icon: '🍯', style: { top: '80%', right: '2.5%' }, anim: 'gridFloatSlow3', size: '3.8rem' },
    { icon: '🌟', style: { top: '94%', right: '4%' }, anim: 'gridFloatSlow1', size: '3rem' }
  ];

  return (
    <div
      className="full-bleed-bakery-bg"
      onMouseMove={handleMouseMove}
      style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        overflow: 'hidden',
        pointerEvents: 'auto',
        zIndex: 1
      }}
    >
      {/* 1. Full-Bleed Scrolling Watermark Marquee */}
      <div className="bg-watermark-marquee">
        <div className="marquee-track">
          <span>SWEET COUNTY ARTISANAL BAKERY • FRESHLY BAKED DAILY • PREMIUM BELGIAN CHOCOLATE • </span>
          <span>SWEET COUNTY ARTISANAL BAKERY • FRESHLY BAKED DAILY • PREMIUM BELGIAN CHOCOLATE • </span>
        </div>
      </div>

      {/* 2. Full-Bleed Side Glow Nebulas */}
      <div
        className="bg-side-glow glow-left-margin"
        style={{
          transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`
        }}
      ></div>
      <div
        className="bg-side-glow glow-right-margin"
        style={{
          transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`
        }}
      ></div>

      {/* 3. Trailing Cursor Sparkle Ripples on Margins */}
      {ripples.map(r => (
        <span
          key={r.id}
          className="bg-cursor-ripple"
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            pointerEvents: 'none',
            fontSize: '1.6rem',
            zIndex: 3
          }}
        >
          {r.icon}
        </span>
      ))}

      {/* 4. Large Floating Ingredients on Left & Right Side Margins */}
      {marginFloatingItems.map((item, idx) => (
        <div
          key={idx}
          className={`side-margin-floating-card ${item.anim}`}
          style={{
            ...item.style,
            position: 'absolute',
            transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)`
          }}
        >
          <span style={{ fontSize: item.size, display: 'block' }}>{item.icon}</span>
        </div>
      ))}
    </div>
  );
};

export default BakeryGridBackground;
