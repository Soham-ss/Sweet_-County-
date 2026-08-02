import React, { useState } from 'react';

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  // Mouse move effect for magnetic 3D parallax & golden fairy dust trail
  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;

    const rotX = ((relY / rect.height) - 0.5) * -24; // tilt X
    const rotY = ((relX / rect.width) - 0.5) * 24;  // tilt Y
    setMousePos({ x: rotY, y: rotX });

    // Spawn trailing fairy dust
    if (Math.random() > 0.6) {
      const id = Date.now() + Math.random();
      const newParticle = {
        id,
        x: relX,
        y: relY,
        size: Math.random() * 14 + 10,
        icon: ['✨', '⭐', '🍓', '🍫', '💖', '🧁', '🍩'][Math.floor(Math.random() * 7)],
        rotate: Math.random() * 360
      };
      setTrail(prev => [...prev.slice(-20), newParticle]);
      setTimeout(() => {
        setTrail(prev => prev.filter(p => p.id !== id));
      }, 800);
    }
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Multi-particle confetti blast on click
  const handleHeroClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const burstId = Date.now();

    const burstCount = 24;
    const particles = Array.from({ length: burstCount }).map((_, i) => {
      const angle = (i / burstCount) * Math.PI * 2 + (Math.random() * 0.4);
      const velocity = Math.random() * 120 + 80;
      return {
        id: `${burstId}-${i}`,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        icon: ['✨', '🎂', '🍓', '🍫', '🍩', '🥐', '🧁', '🌟', '💖', '🎉'][Math.floor(Math.random() * 10)],
        scale: Math.random() * 0.8 + 0.8,
        rot: Math.random() * 720 - 360
      };
    });

    setExplosions(prev => [...prev.slice(-3), { id: burstId, x: clickX, y: clickY, particles }]);
    setTimeout(() => {
      setExplosions(prev => prev.filter(ex => ex.id !== burstId));
    }, 950);
  };

  // 6 Floating Orbital Ingredient Badges
  const badges = [
    { id: 1, icon: '🎂', title: 'Belgian Truffle Cake', tag: '100% Belgian Cocoa', pos: { top: '15%', left: '8%' }, anim: 'heroFloat1' },
    { id: 2, icon: '🍓', title: 'Organic Strawberries', tag: 'Farm Fresh Daily', pos: { top: '22%', right: '9%' }, anim: 'heroFloat2' },
    { id: 3, icon: '🍫', title: 'Dark Ganache Glaze', tag: '64% Valrhona', pos: { bottom: '22%', left: '10%' }, anim: 'heroFloat3' },
    { id: 4, icon: '🍩', title: 'Glazed Brioche Donuts', tag: 'Melt-in-your-mouth', pos: { bottom: '18%', right: '11%' }, anim: 'heroFloat1' },
    { id: 5, icon: '🥐', title: 'Butter Croissants', tag: 'French AOP Butter', pos: { top: '48%', left: '4%' }, anim: 'heroFloat2' },
    { id: 6, icon: '✨', title: '24K Gold Leaf', tag: 'Edible Gold Dust', pos: { top: '52%', right: '5%' }, anim: 'heroFloat3' }
  ];

  return (
    <section
      className="crazy-hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleHeroClick}
    >
      {/* Dynamic Background Ambient Glow Nebulas */}
      <div className="hero-nebula nebula-1"></div>
      <div className="hero-nebula nebula-2"></div>
      <div className="hero-nebula nebula-3"></div>

      {/* Trailing Fairy Dust Trail */}
      {trail.map(t => (
        <span
          key={t.id}
          className="fairy-dust-particle"
          style={{
            left: t.x,
            top: t.y,
            fontSize: `${t.size}px`,
            transform: `rotate(${t.rotate}deg)`
          }}
        >
          {t.icon}
        </span>
      ))}

      {/* Confetti Explosion Burst */}
      {explosions.map(ex => (
        <div key={ex.id} style={{ position: 'absolute', left: ex.x, top: ex.y, pointerEvents: 'none', zIndex: 100 }}>
          {ex.particles.map(p => (
            <span
              key={p.id}
              className="confetti-burst-item"
              style={{
                '--vx': `${p.vx}px`,
                '--vy': `${p.vy}px`,
                '--rot': `${p.rot}deg`,
                transform: `scale(${p.scale})`
              }}
            >
              {p.icon}
            </span>
          ))}
        </div>
      ))}

      {/* 3D Orbiting Floating Badges */}
      {badges.map(b => (
        <div
          key={b.id}
          className={`hero-orbit-badge ${b.anim}`}
          style={{ ...b.pos }}
          onMouseEnter={() => setActiveItem(b.id)}
          onMouseLeave={() => setActiveItem(null)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="badge-glass-card">
            <span className="badge-emoji">{b.icon}</span>
            <div className="badge-text-wrap">
              <strong className="badge-title">{b.title}</strong>
              <span className="badge-tag">{b.tag}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Main Interactive 3D Tilt Glass Content Box */}
      <div
        className="hero-3d-tilt-box"
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg) translateZ(20px)`,
          transition: 'transform 0.12s cubic-bezier(0.1, 0.8, 0.2, 1)'
        }}
      >
        {/* Pulsing Live Badge */}
        <div className="hero-live-badge">
          <span className="live-pulse-dot"></span>
          <span>FRESHLY BAKED EVERY 2 HOURS • 100% ARTISANAL</span>
        </div>

        {/* Shimmer Headline */}
        <h1 className="hero-shock-title">
          <span className="shock-word word-1">Freshly</span>{' '}
          <span className="shock-word word-2">Baked</span>{' '}
          <span className="shock-word word-3">Happiness</span>
        </h1>

        <p className="hero-shock-subtext">
          Handcrafted artisanal cakes, delicate pastries, and melt-in-your-mouth donuts.
          Click anywhere on screen to launch a magical confetti explosion!
        </p>

        {/* Glowing Action CTA Button */}
        <div className="hero-btn-wrapper">
          <button
            className="hero-shock-btn"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore the Menu 🍰
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
