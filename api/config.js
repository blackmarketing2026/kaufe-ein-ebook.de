module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    console.error("Stripe publishable key is not configured in the environment.");
    return res.status(500).json({
      error: "Zahlung derzeit nicht verfügbar. Bitte versuche es später erneut.",
    });
  }

  return res.status(200).json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
};
