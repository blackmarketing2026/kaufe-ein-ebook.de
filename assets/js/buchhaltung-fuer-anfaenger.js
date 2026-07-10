// Zentrale Konstante für den internen Checkout (gleiche Payment-Intent-API wie
// die anderen Produkte, Produkt-Slug muss zu products.json passen).
const CHECKOUT_URL = "checkout.html?product=buchhaltung-fuer-anfaenger";
const PRODUCT_NAME = "Buchhaltung für Anfänger";

const buyLinks = document.querySelectorAll(".js-buy-link");

buyLinks.forEach((link) => {
  link.href = CHECKOUT_URL;
});

document.getElementById("year").textContent = new Date().getFullYear();

// FAQ-Akkordeon
document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove("open");
        openItem.querySelector(".faq-answer").style.maxHeight = null;
      }
    });

    if (isOpen) {
      item.classList.remove("open");
      answer.style.maxHeight = null;
    } else {
      item.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// Sticky mobile CTA sobald die Hero-Aktionen aus dem Sichtbereich scrollen
const stickyCta = document.getElementById("sticky-cta");
const heroActions = document.querySelector(".hero-actions");

if (stickyCta && heroActions && "IntersectionObserver" in window) {
  const stickyObserver = new IntersectionObserver(
    ([entry]) => {
      stickyCta.classList.toggle("visible", !entry.isIntersecting);
    },
    { threshold: 0 }
  );

  stickyObserver.observe(heroActions);
}

// Dezentes Einblenden der Sections beim Scrollen
const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (motionAllowed && revealItems.length && "IntersectionObserver" in window) {
  document.documentElement.classList.add("animations-ready");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// GTM DataLayer: view_item beim Laden der Seite
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  event: "view_item",
  item_name: PRODUCT_NAME,
  item_category: "ebook"
});

// GTM DataLayer: begin_checkout beim Klick auf einen Kaufbutton,
// danach Weiterleitung zum bestehenden Stripe-Checkout (normaler Linkklick).
buyLinks.forEach((link) => {
  link.addEventListener("click", () => {
    dataLayer.push({
      event: "begin_checkout",
      item_name: PRODUCT_NAME,
      item_category: "ebook"
    });

    if (typeof fbq === "function") {
      fbq("trackCustom", "Stripe");
    }
  });
});
