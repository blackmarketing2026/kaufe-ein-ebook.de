(function () {
  document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("product");

  const summaryEl = document.getElementById("checkout-summary");
  const formEl = document.getElementById("payment-form");
  const submitButton = document.getElementById("checkout-submit");
  const messageEl = document.getElementById("payment-message");
  const paymentElementContainer = document.getElementById("payment-element");
  const emailInput = document.getElementById("checkout-email");

  function fail(text) {
    formEl.hidden = true;
    KaufeCheckout.showMessage(messageEl, text, "error");
  }

  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      const product = products[productId];

      if (!product) {
        fail("Unbekanntes Produkt. Bitte kehre zur Produktseite zurück und versuche es erneut.");
        return;
      }

      summaryEl.innerHTML =
        '<img src="' + product.cover + '" alt="Cover: ' + product.name + '" />' +
        "<h1>" + product.name + "</h1>" +
        '<div class="checkout-price">' + product.priceLabel + "</div>" +
        '<p class="checkout-note">Digitales E-Book · Sofortiger Download nach erfolgreicher Zahlung</p>';

      startCheckout(product);
    })
    .catch(() => fail("Produktdaten konnten nicht geladen werden. Bitte versuche es später erneut."));

  function startCheckout(product) {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: productId }),
    })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data: data })))
      .then((result) => {
        if (!result.ok) {
          fail(result.data.error || "Zahlung derzeit nicht verfügbar. Bitte versuche es später erneut.");
          return;
        }

        const clientSecret = result.data.clientSecret;
        const publishableKey = result.data.publishableKey;
        const stripe = Stripe(publishableKey, { locale: "de" });

        const elements = stripe.elements({
          clientSecret: clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#f47920",
              colorText: "#1b2a4a",
              colorBackground: "#ffffff",
              borderRadius: "10px",
              fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
            },
          },
        });

        const paymentElement = elements.create("payment");
        paymentElement.mount(paymentElementContainer);
        paymentElement.on("ready", () => {
          submitButton.disabled = false;
        });

        formEl.addEventListener("submit", (event) => {
          event.preventDefault();
          submitButton.disabled = true;
          messageEl.hidden = true;

          stripe
            .confirmPayment({
              elements: elements,
              redirect: "if_required",
              confirmParams: {
                return_url: KaufeCheckout.buildReturnUrl(productId, publishableKey),
                receipt_email: emailInput.value,
              },
            })
            .then((confirmResult) => {
              if (confirmResult.error) {
                submitButton.disabled = false;
                KaufeCheckout.showMessage(messageEl, confirmResult.error.message, "error");
                return;
              }

              const status = KaufeCheckout.describeStatus(confirmResult.paymentIntent.status);
              KaufeCheckout.showMessage(messageEl, status.message, status.type);

              if (status.type === "success") {
                window.location.href = product.thankYouUrl;
              } else {
                submitButton.disabled = false;
              }
            });
        });
      })
      .catch(() => fail("Zahlung derzeit nicht verfügbar. Bitte versuche es später erneut."));
  }
})();
