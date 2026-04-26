const express = require('express');
const { stripeWebhook } = require('../controllers/orderController');

const router = express.Router();

// The webhook needs the raw body (Buffer) and signature
router.post('/', stripeWebhook);

module.exports = router;
