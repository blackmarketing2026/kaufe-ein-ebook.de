const Stripe = require("stripe");
const products = require("../products.json");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const productId = req.body && req.body.product;
  const product = products[productId];

  if (!product) {
    return res.status(400).json({ error: "Unbekanntes Produkt" });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY) {
    console.error("Stripe API keys are not configured in the environment.");
    return res.status(500).json({
      error: "Zahlung derzeit nicht verfügbar. Bitte versuche es später erneut.",
    });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: product.amount,
      currency: product.currency,
      automatic_payment_methods: { enabled: true },
      metadata: { product: productId },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error("Stripe PaymentIntent creation failed:", error);
    return res.status(500).json({
      error: "Zahlung derzeit nicht verfügbar. Bitte versuche es später erneut.",
    });
  }
};
