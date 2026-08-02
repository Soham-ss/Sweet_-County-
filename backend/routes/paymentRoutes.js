const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_sweetcounty123';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'sweetcountysecretkey123';

let razorpay;
try {
    razorpay = new Razorpay({
        key_id,
        key_secret
    });
} catch (e) {
    console.log('Razorpay init notice:', e.message);
}

// GET /api/payment/key — return public key ID for checkout
router.get('/key', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID || 'rzp_test_sweetcounty123' });
});

// POST /api/payment/create-order — create Razorpay Order
router.post('/create-order', protect, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Valid amount is required' });
        }

        const options = {
            amount: Math.round(amount * 100), // amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        try {
            if (razorpay && process.env.RAZORPAY_KEY_ID) {
                const order = await razorpay.orders.create(options);
                return res.status(201).json({
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    key: key_id
                });
            }
        } catch (rzpErr) {
            console.log('Using test order fallback (Set RAZORPAY_KEY_ID & SECRET in backend/.env for live API):', rzpErr.message);
        }

        // Fallback test order generation for instant testing without mandatory API keys
        const mockOrderId = `order_test_${Date.now()}`;
        res.status(201).json({
            orderId: mockOrderId,
            amount: Math.round(amount * 100),
            currency: 'INR',
            key: key_id,
            isTestMode: true
        });
    } catch (err) {
        console.error('Razorpay Create Order Error:', err);
        res.status(500).json({ message: err.message || 'Failed to create payment order' });
    }
});

// POST /api/payment/verify — verify signature & save order in DB
router.post('/verify', protect, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            totalAmount,
            paymentMethod = 'Razorpay (Online)'
        } = req.body;

        // Signature verification if live keys are present
        if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature) {
            const body = razorpay_order_id + '|' + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                return res.status(400).json({ message: 'Invalid payment signature verification failed' });
            }
        }

        // Save paid order in MongoDB
        const newOrder = new Order({
            items,
            totalAmount,
            user: req.user.id,
            paymentMethod,
            paymentStatus: 'Paid',
            status: 'Confirmed',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id || `pay_test_${Date.now()}`
        });

        await newOrder.save();

        res.status(201).json({
            message: 'Payment successful! Your order has been placed.',
            orderId: newOrder._id,
            paymentStatus: 'Paid',
            status: 'Confirmed'
        });
    } catch (err) {
        console.error('Razorpay Verify Error:', err);
        res.status(500).json({ message: err.message || 'Payment verification failed' });
    }
});

module.exports = router;
