const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Paid', 'Refunded']
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Order', orderSchema);