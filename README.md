# kaufe-ein-ebook.de

Statisches Grundgerüst für den Landing-Page-Auftritt des E-Book-Stores (HTML/CSS/JS, kein Build-Schritt) plus ein kleines Vercel-Functions-Backend für den eigenen Stripe-Checkout.

## Struktur

```
index.html              Startseite
checkout.html            Kassenseite (Stripe Payment Element)
checkout-return.html     Rücksprungseite für weiterleitende Zahlungsmethoden
products.json             Produktkatalog (Preis, Name, Danke-Seite je Produkt-Slug)
api/create-payment-intent.js  Vercel Function: erstellt das Stripe PaymentIntent serverseitig
assets/css/style.css    Styles
assets/js/main.js       Mobile-Nav, Newsletter-Formular
assets/img/logo.webp    Logo (WebP, für Header/Hero)
assets/img/logo-256.webp Logo (WebP, für Favicon/Footer)
assets/img/source/      Original-Logo-Datei (PNG, unkomprimiert)
```

## Lokal ansehen

Für die reinen Landingpages reicht ein einfacher statischer Server, z. B.:

```
python -m http.server 8080
```

Danach [http://localhost:8080](http://localhost:8080) öffnen. **Für den Kaufvorgang reicht das nicht** – dafür braucht es die Vercel-Functions unter `/api`, siehe unten.

## Zahlungs-Backend (Vercel Functions + Stripe)

`npm install` installiert das Stripe-SDK für die Function unter `api/create-payment-intent.js`.

Benötigte Umgebungsvariablen (im Vercel-Dashboard unter Project → Settings → Environment Variables hinterlegen, **nie einchecken**):

- `STRIPE_SECRET_KEY` – Secret Key, serverseitig für `stripe.paymentIntents.create`
- `STRIPE_PUBLISHABLE_KEY` – Publishable Key, wird vom Frontend über die Antwort von `/api/create-payment-intent` genutzt

Test-Keys für die Environments „Preview"/„Development", Live-Keys nur für „Production" hinterlegen.

Lokal testen mit der [Vercel CLI](https://vercel.com/docs/cli):

```
vercel dev
vercel env pull   # lädt die im Dashboard hinterlegten Variablen in .env.local
```

`checkout.html?product=buchhaltung-steuern`, `?product=google-ads` bzw. `?product=buchhaltung-fuer-anfaenger` aufrufen und mit einer [Stripe-Testkarte](https://docs.stripe.com/testing) (z. B. `4242 4242 4242 4242`) durchspielen.

## Rechtliches

Datenschutz- und Impressum-Seiten werden extern verlinkt:

- https://function-concept.com/datenschutz
- https://function-concept.com/impressum
