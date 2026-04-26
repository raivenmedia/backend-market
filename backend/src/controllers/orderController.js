const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { stripe, createCheckoutSession } = require('../utils/stripe');

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, successUrl, cancelUrl } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate(
      'items.product'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      seller: item.product.seller,
      quantity: item.quantity,
      // Always get price directly from the DB populated product, not the cart or frontend
      price: item.product.price, 
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod: 'stripe',
      totalAmount,
    });

    const session = await createCheckoutSession(
      { items: cart.items }, // Use populated cart for names
      order._id,
      successUrl || `${process.env.CORS_ORIGIN}/orders/${order._id}?success=true`,
      cancelUrl || `${process.env.CORS_ORIGIN}/cart?canceled=true`
    );

    order.stripePaymentIntentId = session.id; // Store session ID instead
    await order.save();

    res.status(201).json({
      success: true,
      order,
      checkoutUrl: session.url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product')
      .populate('items.seller', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order
    if (
      order.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .populate('items.seller', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller': req.user.id })
      .populate('user', 'name email')
      .populate('items.product')
      .populate('items.seller', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // req.body is the raw buffer due to express.raw() in server.js
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.client_reference_id;

    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'completed';
        order.orderStatus = 'processing';
        await order.save();

        // Clear user's cart
        await Cart.findOneAndUpdate(
          { user: order.user },
          { items: [], totalItems: 0, totalPrice: 0 },
          { new: true }
        );
      }
    } catch (error) {
      console.error('Error updating order on webhook:', error);
    }
  }

  res.status(200).json({ received: true });
};
