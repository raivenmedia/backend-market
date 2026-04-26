const express = require('express');
const {
  getAllProducts,
  getProductById,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { darkhorseProtect, darkhorseLogActivity } = require('../middleware/darkhorseMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(darkhorseLogActivity); // Log all product modifications

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/seller/products', protect, authorize('seller'), getSellerProducts);

router.post('/', protect, darkhorseProtect, authorize('seller'), upload.single('image'), createProduct);
router.put('/:id', protect, darkhorseProtect, authorize('seller'), upload.single('image'), updateProduct);
router.delete('/:id', protect, darkhorseProtect, authorize('seller'), deleteProduct);

router.post('/:id/reviews', protect, darkhorseProtect, addReview);

module.exports = router;
