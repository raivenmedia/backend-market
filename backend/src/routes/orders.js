const express = require('express');
const {
  createOrder,
  getOrderById,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { darkhorseProtect, darkhorseLogActivity } = require('../middleware/darkhorseMiddleware');

const router = express.Router();

router.use(darkhorseLogActivity);

router.post('/', protect, darkhorseProtect, createOrder);
router.get('/user', protect, getUserOrders);
router.get('/seller', protect, authorize('seller'), getSellerOrders);
router.get('/:id', protect, getOrderById);

router.put('/:id/status', protect, darkhorseProtect, authorize('seller'), updateOrderStatus);

module.exports = router;
