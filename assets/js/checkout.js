(function () {
  document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("product");

  const productEl = document.getElementById("checkout-product");
  const formEl = document.getElementById("payment-form");
  const submitButton = document.getElementById("checkout-submit");
  const messageEl = document.getElementById("payment-message");
  const paymentElementContainer = document.getElementById("payment-element");
  const addressElementContainer = document.getElementById("address-element");
  const skeletonEl = document.getElementById("checkout-skeleton");
  const emailInput = document.getElementById("checkout-email");

  function failProduct(text) {
    formEl.hidden = true;
    productEl.innerHTML = "<p>Produkt konnte nicht geladen werden.</p>";
    KaufeCheckout.showMessage(messageEl, text, "error");
  }

  function failPayment(text) {
    formEl.hidden = true;
    KaufeCheckout.showMessage(messageEl, text, "error");
  }

  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      const product = products[productId];

      if (!product) {
        failProduct("Unbekanntes Produkt. Bitte kehre zur Produktseite zurück und versuche es erneut.");
        return;
      }

      productEl.innerHTML =
        '<img src="' + product.cover + '" alt="Cover: ' + product.name + '" />' +
        "<h1>" + product.name + "</h1>" +
        '<div class="checkout-price">' + product.priceLabel + "</div>" +
        '<p class="checkout-note">Digitales E-Book · Sofortiger Download nach erfolgreicher Zahlung</p>';

      startCheckout(product);
    })
    .catch(() => failProduct("Produktdaten konnten nicht geladen werden. Bitte versuche es später erneut."));

  function startCheckout(product) {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: productId }),
    })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data: data })))
      .then((result) => {
        if (!result.ok) {
          failPayment(result.data.error || "Zahlung derzeit nicht verfügbar. Bitte versuche es später erneut.");
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

        const addressElement = elements.create("address", {
          mode: "billing",
          fields: { phone: "always" },
        });
        addressElement.mount(addressElementContainer);

        const paymentElement = elements.create("payment");
        paymentElement.mount(paymentElementContainer);
        paymentElement.on("ready", () => {
          skeletonEl.hidden = true;
          submitButton.disabled = false;
        });

        formEl.addEventListener("submit", (event) => {
          event.preventDefault();
          submitButton.disabled = true;
          messageEl.hidden = true;

          addressElement.getValue().then((addressResult) => {
            if (!addressResult.complete) {
              submitButton.disabled = false;
              KaufeCheckout.showMessage(messageEl, "Bitte fülle Name, Telefonnummer und Adresse vollständig aus.", "error");
              return;
            }

            const billingDetails = {
              name: addressResult.value.name,
              phone: addressResult.value.phone,
              email: emailInput.value,
              address: addressResult.value.address,
            };

            stripe
              .confirmPayment({
                elements: elements,
                redirect: "if_required",
                confirmParams: {
                  return_url: KaufeCheckout.buildReturnUrl(productId, publishableKey),
                  receipt_email: emailInput.value,
                  payment_method_data: { billing_details: billingDetails },
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
        });
      })
      .catch(() => failPayment("Zahlung derzeit nicht verfügbar. Bitte versuche es später erneut."));
  }
})();
