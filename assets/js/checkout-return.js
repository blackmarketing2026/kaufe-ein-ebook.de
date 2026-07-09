(function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("product");
  const publishableKey = params.get("pk");
  const clientSecret = params.get("payment_intent_client_secret");

  const spinnerEl = document.getElementById("checkout-return-spinner");
  const messageEl = document.getElementById("payment-message");
  const backLinkEl = document.getElementById("checkout-return-back");

  function showResult(text, type, showBackLink) {
    spinnerEl.hidden = true;
    KaufeCheckout.showMessage(messageEl, text, type);
    backLinkEl.hidden = !showBackLink;
    if (showBackLink && productId) {
      backLinkEl.href = "checkout.html?product=" + encodeURIComponent(productId);
    }
  }

  if (!publishableKey || !clientSecret) {
    showResult("Es gab ein Problem mit deiner Zahlung. Bitte versuche es erneut.", "error", true);
    return;
  }

  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      const product = products[productId];
      const stripe = Stripe(publishableKey, { locale: "de" });

      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent, error }) => {
        if (error || !paymentIntent) {
          showResult("Es gab ein Problem mit deiner Zahlung. Bitte versuche es erneut.", "error", true);
          return;
        }

        const status = KaufeCheckout.describeStatus(paymentIntent.status);

        if (status.type === "success" && product) {
          showResult(status.message, status.type, false);
          window.location.href = product.thankYouUrl;
          return;
        }

        showResult(status.message, status.type, status.type === "error");
      });
    })
    .catch(() => showResult("Es gab ein Problem mit deiner Zahlung. Bitte versuche es erneut.", "error", true));
})();
