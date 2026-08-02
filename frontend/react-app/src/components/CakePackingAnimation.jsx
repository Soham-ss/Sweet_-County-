import React, { useState, useEffect } from 'react';

const CakePackingAnimation = ({ cakeImage, cakeName, onComplete }) => {
  const [step, setStep] = useState(1); // 1: Float into box, 2: Close Lid, 3: Tie Ribbon & Stamp

  useEffect(() => {
    // Step 1 -> Step 2: Close Lid after 1.2s
    const t1 = setTimeout(() => {
      setStep(2);
    }, 1200);

    // Step 2 -> Step 3: Ribbon & Stamp after 2.4s
    const t2 = setTimeout(() => {
      setStep(3);
    }, 2400);

    // Step 3 -> Finish: Complete after 3.8s
    const t3 = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(20, 13, 9, 0.92)', backdropFilter: 'blur(15px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 20000, userSelect: 'none'
    }}>
      {/* Dynamic Status Banner */}
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <span style={{
          background: 'rgba(241, 210, 122, 0.2)', color: '#f1d27a', border: '1.5px solid #f1d27a',
          padding: '6px 20px', borderRadius: '25px', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1.5px'
        }}>
          {step === 1 && '📦 STEP 1: PLACING FRESH CAKE IN BOX...'}
          {step === 2 && '🔒 STEP 2: SEALING SWEET COUNTY BAKERY BOX...'}
          {step === 3 && '✨ STEP 3: TYING GOLD RIBBON & QUALITY STAMP!'}
        </span>
        <h2 style={{ color: '#ffffff', fontSize: '2.4rem', marginTop: '12px', fontFamily: 'Playfair Display, serif' }}>
          Packing Your {cakeName || 'Artisanal Cake'} 🍰
        </h2>
      </div>

      {/* 3D Bakery Box Stage */}
      <div className="packing-stage">
        {/* The Bakery Gift Box Container */}
        <div className={`sweet-county-box ${step >= 2 ? 'box-closed' : ''}`}>
          
          {/* Box Brand Header */}
          <div className="box-brand">
            <span className="box-logo-text">SWEET COUNTY</span>
            <span className="box-sub-text">ARTISANAL BAKERY • EST. 2026</span>
          </div>

          {/* Floating Cake Image */}
          <div className={`packing-cake-wrapper ${step >= 1 ? 'cake-dropped-in' : ''}`}>
            <img
              src={cakeImage || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'}
              alt="Cake"
              className="packing-cake-img"
            />
          </div>

          {/* Folding Box Lid */}
          <div className={`box-lid ${step >= 2 ? 'lid-closed' : ''}`}>
            <div className="lid-crest">
              <span>🍰 SWEET COUNTY</span>
              <small>FRESH & DELICIOUS</small>
            </div>
          </div>

          {/* Golden Satin Ribbon & Bow */}
          {step >= 3 && (
            <div className="box-ribbon-wrap">
              <div className="ribbon-v"></div>
              <div className="ribbon-h"></div>
              <div className="ribbon-bow">🎀</div>
              <div className="wax-seal-stamp">
                <span>SEALED</span>
                <strong>FRESH</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '300px', height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', marginTop: '40px', overflow: 'hidden' }}>
        <div className="packing-progress-bar"></div>
      </div>

      <button
        onClick={onComplete}
        style={{
          marginTop: '20px', background: 'transparent', border: 'none', color: '#f1d27a',
          fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', opacity: 0.8
        }}
      >
        Skip Animation ➔
      </button>
    </div>
  );
};

export default CakePackingAnimation;
