# kaufe-ein-ebook.de

Statisches Grundgerüst für den Landing-Page-Auftritt des E-Book-Stores. Reines HTML/CSS/JS, kein Build-Schritt nötig.

## Struktur

```
index.html              Startseite
assets/css/style.css    Styles
assets/js/main.js       Mobile-Nav, Newsletter-Formular
assets/img/logo.webp    Logo (WebP, für Header/Hero)
assets/img/logo-256.webp Logo (WebP, für Favicon/Footer)
assets/img/source/      Original-Logo-Datei (PNG, unkomprimiert)
```

## Lokal ansehen

Da keine Build-Tools nötig sind, reicht ein einfacher statischer Server, z. B.:

```
python -m http.server 8080
```

Danach [http://localhost:8080](http://localhost:8080) öffnen.

## Rechtliches

Datenschutz- und Impressum-Seiten werden extern verlinkt:

- https://function-concept.com/datenschutz
- https://function-concept.com/impressum
