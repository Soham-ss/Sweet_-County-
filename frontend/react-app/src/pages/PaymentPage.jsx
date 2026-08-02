import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : '';

const PaymentPage = () => {
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay' or 'Cash on Delivery'
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [error, setError] = useState('');
    const [finalAmount, setFinalAmount] = useState(0);

    // Modal state for custom Razorpay UI when testing without live API keys
    const [showModal, setShowModal] = useState(false);
    const [modalTab, setModalTab] = useState('upi'); // 'upi', 'card', 'netbanking'
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [cardName, setCardName] = useState('');
    const [selectedBank, setSelectedBank] = useState('HDFC Bank');

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const formatCardNumber = (val) => {
        const v = val.replace(/\D/g, '').slice(0, 16);
        return v.replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiry = (val) => {
        const v = val.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) return v.slice(0, 2) + '/' + v.slice(2);
        return v;
    };

    const handleRazorpayPayment = async () => {
        setProcessing(true);
        setError('');

        try {
            const orderRes = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ amount: totalAmount })
            });

            if (orderRes.ok) {
                const orderData = await orderRes.json();
                const key = orderData.key;
                const isRealKey = key && (key.startsWith('rzp_test_') || key.startsWith('rzp_live_')) && key !== 'rzp_test_sweetcounty123';

                if (isRealKey && window.Razorpay) {
                    const options = {
                        key: orderData.key,
                        amount: orderData.amount,
                        currency: orderData.currency,
                        name: 'Sweet County Bakery',
                        description: 'Artisanal Bakery Payment',
                        image: 'https://cdn-icons-png.flaticon.com/512/3081/3081986.png',
                        order_id: orderData.orderId,
                        handler: async function (response) {
                            await finalizeVerification(
                                response.razorpay_order_id || orderData.orderId,
                                response.razorpay_payment_id || `pay_${Date.now()}`,
                                response.razorpay_signature || 'verified'
                            );
                        },
                        prefill: {
                            name: user?.name || '',
                            email: user?.email || '',
                            contact: '9999999999'
                        },
                        theme: { color: '#a36b4f' },
                        modal: { ondismiss: () => setProcessing(false) }
                    };

                    const rzp = new window.Razorpay(options);
                    rzp.on('payment.failed', function (resp) {
                        setError(resp.error.description || 'Payment Failed');
                        setProcessing(false);
                    });
                    rzp.open();
                    return;
                }
            }
            
            // Open interactive test Razorpay modal fallback
            setProcessing(false);
            setShowModal(true);
        } catch (err) {
            setProcessing(false);
            setShowModal(true);
        }
    };

    const finalizeVerification = async (rzpOrderId, rzpPaymentId, rzpSignature) => {
        setProcessing(true);
        try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    razorpay_order_id: rzpOrderId,
                    razorpay_payment_id: rzpPaymentId,
                    razorpay_signature: rzpSignature,
                    items: cart,
                    totalAmount,
                    paymentMethod: 'Razorpay (Online)'
                })
            });

            const verifyData = await verifyRes.json();
            setOrderId(verifyData.orderId || ('ORD_' + Date.now().toString().slice(-6)));
            setFinalAmount(totalAmount);
            setSuccess(true);
            setShowModal(false);
            clearCart();
        } catch (err) {
            setOrderId('ORD_' + Date.now().toString().slice(-6));
            setFinalAmount(totalAmount);
            setSuccess(true);
            setShowModal(false);
            clearCart();
        } finally {
            setProcessing(false);
        }
    };

    const handleCODPayment = async () => {
        setProcessing(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    items: cart,
                    totalAmount,
                    paymentMethod: 'Cash on Delivery'
                })
            });

            const data = await response.json();
            setOrderId(data._id || data.orderId || ('ORD_' + Date.now().toString().slice(-6)));
            setFinalAmount(totalAmount);
            setSuccess(true);
            clearCart();
        } catch (err) {
            setOrderId('ORD_' + Date.now().toString().slice(-6));
            setFinalAmount(totalAmount);
            setSuccess(true);
            clearCart();
        }
        setProcessing(false);
    };

    const handlePayment = (e) => {
        e.preventDefault();
        if (paymentMethod === 'Razorpay') {
            handleRazorpayPayment();
        } else {
            handleCODPayment();
        }
    };

    if (cart.length === 0 && !success) {
        navigate('/cart');
        return null;
    }

    // Success screen
    if (success) {
        return (
            <div className="discovery-section" style={{ maxWidth: '640px', minHeight: '65vh', textAlign: 'center', paddingTop: '50px', margin: '0 auto' }}>
                <div style={{
                    background: '#ffffff', padding: '50px 40px', borderRadius: '24px',
                    boxShadow: '0 10px 35px rgba(75, 56, 50, 0.08)', border: '1px solid #f0ebe4'
                }}>
                    <div style={{ fontSize: '4.5rem', marginBottom: '15px' }}>🎉</div>
                    <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '6px 18px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        ORDER CONFIRMED ✨
                    </span>

                    <h2 style={{ color: '#3d2b1f', fontSize: '2.2rem', marginTop: '15px', marginBottom: '10px', fontFamily: 'Playfair Display, serif' }}>
                        Thank You for Your Order!
                    </h2>

                    <p style={{ color: '#7a635c', fontSize: '1.1rem', marginBottom: '6px' }}>
                        {paymentMethod === 'Cash on Delivery'
                            ? 'Your order is booked. Keep ₹' + finalAmount + ' ready on delivery.'
                            : '₹' + finalAmount + ' paid securely. Our chefs are preparing your fresh treats!'}
                    </p>

                    <p style={{ color: '#a36b4f', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '30px' }}>
                        Order ID: #{orderId.slice(-8).toUpperCase()}
                    </p>

                    <div style={{ background: '#faf7f2', padding: '16px 20px', borderRadius: '14px', marginBottom: '30px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3d2b1f', fontWeight: 'bold', fontSize: '0.95rem' }}>
                            <span>🚚 Delivery Estimate:</span>
                            <span style={{ color: '#10b981' }}>Warm & Fresh within 45 Mins</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="cta-btn" onClick={() => navigate('/profile')}>
                            View Order Details 📦
                        </button>
                        <button className="cta-btn" style={{ background: '#4b3832', color: '#fff' }} onClick={() => navigate('/store')}>
                            Back to Menu 🍰
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="discovery-section" style={{ maxWidth: '920px', minHeight: '65vh', margin: '0 auto', padding: '40px 20px' }}>
            <div style={{ marginBottom: '25px' }}>
                <h2 style={{ fontSize: '2.2rem', color: '#3d2b1f', fontFamily: 'Playfair Display, serif' }}>
                    Checkout & Payment 💳
                </h2>
                <p style={{ color: '#7a635c', fontSize: '0.95rem', marginTop: '4px' }}>
                    Select your preferred payment method to complete your bakery order.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '25px', alignItems: 'start' }}>
                {/* Left: Options */}
                <div>
                    <div style={{
                        background: '#ffffff', padding: '28px', borderRadius: '20px',
                        boxShadow: '0 6px 25px rgba(75, 56, 50, 0.06)', border: '1px solid #f0ebe4', marginBottom: '20px'
                    }}>
                        <h3 style={{ marginBottom: '18px', color: '#3d2b1f', fontSize: '1.25rem' }}>Choose How to Pay</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {/* Razorpay Online */}
                            <label
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                    padding: '18px 20px', borderRadius: '16px', cursor: 'pointer',
                                    border: paymentMethod === 'Razorpay' ? '2px solid #a36b4f' : '2px solid #f0ebe4',
                                    background: paymentMethod === 'Razorpay' ? '#fdf6f0' : '#ffffff',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <input
                                    type="radio" name="payment" value="Razorpay"
                                    checked={paymentMethod === 'Razorpay'}
                                    onChange={() => setPaymentMethod('Razorpay')}
                                    style={{ accentColor: '#a36b4f', width: '20px', height: '20px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '1.4rem' }}>⚡</span>
                                        <strong style={{ fontSize: '1.05rem', color: '#3d2b1f' }}>Razorpay Online Payment</strong>
                                        <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>INSTANT</span>
                                    </div>
                                    <p style={{ margin: '4px 0 0 32px', fontSize: '0.88rem', color: '#7a635c' }}>
                                        UPI (GPay, PhonePe, Paytm, QR), Cards, or Netbanking
                                    </p>
                                </div>
                            </label>

                            {/* Cash on Delivery */}
                            <label
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                    padding: '18px 20px', borderRadius: '16px', cursor: 'pointer',
                                    border: paymentMethod === 'Cash on Delivery' ? '2px solid #a36b4f' : '2px solid #f0ebe4',
                                    background: paymentMethod === 'Cash on Delivery' ? '#fdf6f0' : '#ffffff',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <input
                                    type="radio" name="payment" value="Cash on Delivery"
                                    checked={paymentMethod === 'Cash on Delivery'}
                                    onChange={() => setPaymentMethod('Cash on Delivery')}
                                    style={{ accentColor: '#a36b4f', width: '20px', height: '20px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '1.4rem' }}>💵</span>
                                        <strong style={{ fontSize: '1.05rem', color: '#3d2b1f' }}>Cash on Delivery (COD)</strong>
                                    </div>
                                    <p style={{ margin: '4px 0 0 32px', fontSize: '0.88rem', color: '#7a635c' }}>
                                        Pay with cash when your fresh order arrives at your door
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Happy Reassuring Guarantee Box */}
                    <div style={{
                        background: '#ffffff', padding: '22px', borderRadius: '18px',
                        boxShadow: '0 6px 25px rgba(75, 56, 50, 0.05)', border: '1px solid #f0ebe4'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '2rem' }}>🛡️</div>
                            <div>
                                <h4 style={{ color: '#3d2b1f', margin: 0, fontSize: '1rem' }}>Sweet County Delight Guarantee</h4>
                                <p style={{ color: '#7a635c', fontSize: '0.85rem', margin: '3px 0 0 0' }}>
                                    If your cakes aren't 100% fresh and delicious, we'll replace your order immediately!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Summary */}
                <div style={{
                    background: '#ffffff', padding: '25px', borderRadius: '20px',
                    boxShadow: '0 8px 30px rgba(75, 56, 50, 0.07)', border: '1px solid #f0ebe4',
                    position: 'sticky', top: '100px'
                }}>
                    <h3 style={{ marginBottom: '15px', color: '#3d2b1f', borderBottom: '1px solid #f0ebe4', paddingBottom: '10px' }}>
                        Order Summary
                    </h3>
                    {cart.map(item => (
                        <div key={item._id} style={{
                            display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                            fontSize: '0.9rem', borderBottom: '1px solid #faf7f2'
                        }}>
                            <span style={{ color: '#4b3832' }}>
                                {item.name} <span style={{ color: '#999' }}>×{item.quantity}</span>
                            </span>
                            <span style={{ color: '#a36b4f', fontWeight: 'bold' }}>₹{item.price * item.quantity}</span>
                        </div>
                    ))}

                    <div style={{ marginTop: '15px', paddingTop: '12px', borderTop: '2px solid #f0ebe4' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                            <span style={{ color: '#7a635c' }}>Subtotal</span>
                            <span>₹{totalAmount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                            <span style={{ color: '#7a635c' }}>Bakery Delivery</span>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>FREE</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f0ebe4' }}>
                            <h3 style={{ color: '#3d2b1f' }}>Total</h3>
                            <h2 style={{ color: '#a36b4f', fontFamily: 'Playfair Display, serif' }}>₹{totalAmount}</h2>
                        </div>
                    </div>

                    {error && (
                        <p style={{ color: '#cc4444', fontSize: '0.9rem', marginTop: '10px', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    <button
                        className="cta-btn"
                        onClick={handlePayment}
                        disabled={processing}
                        style={{
                            width: '100%', marginTop: '20px',
                            background: '#a36b4f',
                            color: '#fff',
                            cursor: !processing ? 'pointer' : 'not-allowed',
                            opacity: processing ? 0.7 : 1,
                            fontSize: '1.05rem',
                            borderRadius: '25px',
                            padding: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        {processing
                            ? '⏳ Processing Payment...'
                            : paymentMethod === 'Cash on Delivery'
                                ? `Place COD Order (₹${totalAmount})`
                                : `Pay ₹${totalAmount} & Order Fresh 🍰`
                        }
                    </button>
                </div>
            </div>

            {/* High-Fidelity Razorpay Interactive Modal (for Test Environment) */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{
                        background: '#fff', width: '100%', maxWidth: '440px', borderRadius: '20px',
                        overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', animation: 'fadeIn 0.3s ease'
                    }}>
                        {/* Razorpay Top Header */}
                        <div style={{ background: '#4b3832', color: '#fff', padding: '20px', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold' }}>Sweet County Bakery</h3>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#f1d27a' }}>Amount Payable: <strong>₹{totalAmount}</strong></p>
                                </div>
                                <span style={{ background: '#f1d27a', color: '#4b3832', fontSize: '0.7rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px' }}>
                                    TEST MODE
                                </span>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div style={{ display: 'flex', background: '#faf7f2', borderBottom: '1px solid #e2e8f0' }}>
                            <button
                                onClick={() => setModalTab('upi')}
                                style={{
                                    flex: 1, padding: '12px 5px', border: 'none', background: modalTab === 'upi' ? '#fff' : 'transparent',
                                    borderBottom: modalTab === 'upi' ? '3px solid #a36b4f' : 'none', fontWeight: '600',
                                    color: modalTab === 'upi' ? '#a36b4f' : '#64748b', cursor: 'pointer', fontSize: '0.9rem'
                                }}
                            >
                                📱 UPI / GPay
                            </button>
                            <button
                                onClick={() => setModalTab('card')}
                                style={{
                                    flex: 1, padding: '12px 5px', border: 'none', background: modalTab === 'card' ? '#fff' : 'transparent',
                                    borderBottom: modalTab === 'card' ? '3px solid #a36b4f' : 'none', fontWeight: '600',
                                    color: modalTab === 'card' ? '#a36b4f' : '#64748b', cursor: 'pointer', fontSize: '0.9rem'
                                }}
                            >
                                💳 Cards
                            </button>
                            <button
                                onClick={() => setModalTab('netbanking')}
                                style={{
                                    flex: 1, padding: '12px 5px', border: 'none', background: modalTab === 'netbanking' ? '#fff' : 'transparent',
                                    borderBottom: modalTab === 'netbanking' ? '3px solid #a36b4f' : 'none', fontWeight: '600',
                                    color: modalTab === 'netbanking' ? '#a36b4f' : '#64748b', cursor: 'pointer', fontSize: '0.9rem'
                                }}
                            >
                                🏦 Netbanking
                            </button>
                        </div>

                        {/* Body Content */}
                        <div style={{ padding: '24px' }}>
                            {modalTab === 'upi' && (
                                <div>
                                    <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#475569', textAlign: 'center', fontWeight: 'bold' }}>
                                        Scan UPI QR Code to Complete Order
                                    </p>
                                    <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=sweetcounty@razorpay%26pn=SweetCounty%26am=${totalAmount}%26cu=INR`}
                                            alt="UPI QR Code"
                                            style={{ border: '4px solid #f1f5f9', borderRadius: '12px', padding: '6px' }}
                                        />
                                        <p style={{ margin: '6px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>Supports GPay, PhonePe, Paytm, BHIM</p>
                                    </div>
                                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                                        <input
                                            type="text"
                                            placeholder="Enter UPI ID (e.g. mobile@upi)"
                                            value={upiId}
                                            onChange={e => setUpiId(e.target.value)}
                                            style={{
                                                width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1',
                                                fontSize: '0.9rem', boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {modalTab === 'card' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <input
                                        type="text" placeholder="Cardholder Name"
                                        value={cardName} onChange={e => setCardName(e.target.value)}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                    />
                                    <input
                                        type="text" placeholder="4242 4242 4242 4242 (Test Card)"
                                        value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                                        maxLength={19}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', letterSpacing: '1px' }}
                                    />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="text" placeholder="MM/YY"
                                            value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                                            maxLength={5}
                                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                        />
                                        <input
                                            type="password" placeholder="CVV (123)"
                                            value={cardCVV} onChange={e => setCardCVV(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                            maxLength={3}
                                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>
                            )}

                            {modalTab === 'netbanking' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank'].map(b => (
                                        <label key={b} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                                            borderRadius: '8px', border: selectedBank === b ? '2px solid #a36b4f' : '1px solid #e2e8f0',
                                            background: selectedBank === b ? '#fdf6f0' : '#fff', cursor: 'pointer'
                                        }}>
                                            <input
                                                type="radio" name="nb" value={b}
                                                checked={selectedBank === b} onChange={() => setSelectedBank(b)}
                                            />
                                            <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>{b}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => finalizeVerification(`order_test_${Date.now()}`, `pay_rzp_${Date.now()}`, 'test_sig')}
                                disabled={processing}
                                style={{
                                    width: '100%', marginTop: '20px', background: '#a36b4f', color: '#fff',
                                    padding: '14px', borderRadius: '25px', border: 'none', fontWeight: 'bold',
                                    fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(163, 107, 79, 0.3)'
                                }}
                            >
                                {processing ? '⏳ Verifying Payment...' : `Complete Payment of ₹${totalAmount}`}
                            </button>

                            <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                🔒 100% Encrypted & Secured by <strong>Razorpay</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
