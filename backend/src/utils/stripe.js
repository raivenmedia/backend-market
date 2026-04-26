const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (cart, orderId, successUrl, cancelUrl) => {
  try {
    const lineItems = cart.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
        },
        unit_amount: Math.round(item.price * 100), // cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: orderId.toString(),
      metadata: {
        orderId: orderId.toString()
      }
    });

    return session;
  } catch (error) {
    throw new Error(`Checkout session creation failed: ${error.message}`);
  }
};

module.exports = { stripe, createCheckoutSession };
