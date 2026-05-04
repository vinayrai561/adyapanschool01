const express = require('express');
const router  = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');

// POST /api/payment/create-order
router.post('/create-order', createOrder);

// POST /api/payment/verify-payment
router.post('/verify-payment', verifyPayment);

module.exports = router;
