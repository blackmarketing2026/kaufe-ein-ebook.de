window.KaufeCheckout = (function () {
  function buildReturnUrl(productId, publishableKey) {
    return (
      window.location.origin +
      "/checkout-return.html?product=" +
      encodeURIComponent(productId) +
      "&pk=" +
      encodeURIComponent(publishableKey)
    );
  }

  function describeStatus(status) {
    switch (status) {
      case "succeeded":
        return { type: "success", message: "Zahlung erfolgreich – du wirst weitergeleitet …" };
      case "processing":
        return {
          type: "processing",
          message: "Deine Zahlung wird noch verarbeitet. Bitte lade diese Seite in ein paar Minuten neu.",
        };
      case "requires_payment_method":
        return {
          type: "error",
          message: "Die Zahlung war nicht erfolgreich. Bitte versuche es mit einer anderen Zahlungsmethode erneut.",
        };
      default:
        return {
          type: "error",
          message: "Es gab ein Problem mit deiner Zahlung. Bitte versuche es erneut.",
        };
    }
  }

  function showMessage(el, text, type) {
    if (!el) {
      return;
    }
    el.hidden = false;
    el.textContent = text;
    el.className = "payment-message payment-message--" + type;
  }

  return { buildReturnUrl: buildReturnUrl, describeStatus: describeStatus, showMessage: showMessage };
})();
