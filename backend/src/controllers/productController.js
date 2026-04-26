const Product = require('../models/Product');
const Seller = require('../models/Seller');
const { validateProductData } = require('../middleware/validation');

exports.getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12, // Default 12 per page
    } = req.query;

    let filter = { isActive: true, productKycStatus: 'Approved' };

    if (search) {
      // Use MongoDB text index if available, else regex fallback
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(parseInt(limit), 20); // Max 20 per page
    const skip = (pageNum - 1) * limitNum;

    // Only return fields needed for the product grid — no reviews, no heavy data
    const projection = 'title imageUrl price rating numReviews category seller stock productKycStatus';

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select(projection)
        .populate('seller', 'name')
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limitNum)
        .lean(), // .lean() returns plain JS objects — 3-4x faster than Mongoose docs
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      products,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      hasMore: pageNum < Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email avatar');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).populate(
      'seller',
      'name email avatar'
    );

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelpers');

exports.createProduct = async (req, res) => {
  try {
    // Check if seller is approved
    const seller = await Seller.findOne({ userId: req.user.id });
    if (!seller || seller.kycStatus !== 'Approved') {
      return res.status(403).json({ message: 'Your seller account must be approved before publishing products.' });
    }

    const { title, description, price, currency, category, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    const product = await Product.create({
      title,
      description,
      price,
      currency: currency || 'ZMW',
      category,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      stock,
      seller: req.user.id,
      productKycStatus: 'Pending',
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this product' });
    }

    const updates = { ...req.body };
    if (req.body.currency) updates.currency = req.body.currency;

    // If there is a new image file, handle upload and delete old
    if (req.file) {
      // Delete old image
      await deleteFromCloudinary(product.cloudinaryId);

      // Upload new image
      const result = await uploadToCloudinary(req.file.buffer);
      updates.imageUrl = result.secure_url;
      updates.cloudinaryId = result.public_id;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this product' });
    }

    // Remove image from Cloudinary
    await deleteFromCloudinary(product.cloudinaryId);

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      user: req.user.id,
      rating,
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
