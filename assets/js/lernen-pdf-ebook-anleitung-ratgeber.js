document.getElementById("year").textContent = new Date().getFullYear();

window.dataLayer = window.dataLayer || [];
dataLayer.push({
  event: "view_item_list",
  item_list_name: "lernen-pdf-ebook-anleitung-ratgeber"
});

// FAQ-Akkordeon
document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove("open");
        openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        openItem.querySelector(".faq-answer").style.maxHeight = null;
      }
    });

    if (isOpen) {
      item.classList.remove("open");
      question.setAttribute("aria-expanded", "false");
      answer.style.maxHeight = null;
    } else {
      item.classList.add("open");
      question.setAttribute("aria-expanded", "true");
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
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// Scroll-Fortschrittsanzeige
const progressBar = document.getElementById("scroll-progress");

if (progressBar) {
  let ticking = false;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = percent + "%";
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  });

  updateProgress();
}

// Sprungnavigation: aktiven Link beim Scrollen hervorheben
const quicknavLinks = document.querySelectorAll(".quicknav a");
const trackedSections = Array.from(quicknavLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (quicknavLinks.length && trackedSections.length && "IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = "#" + entry.target.id;
        const link = document.querySelector(`.quicknav a[href="${id}"]`);
        if (!link) return;

        if (entry.isIntersecting) {
          quicknavLinks.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  trackedSections.forEach((section) => sectionObserver.observe(section));
}

// Interaktiver Themenfinder
const finderCard = document.querySelector(".finder-card");

if (finderCard) {
  const state = { topic: null, format: null };

  const stepTopic = finderCard.querySelector('[data-step="1"]');
  const stepFormat = finderCard.querySelector('[data-step="2"]');
  const stepResult = finderCard.querySelector('[data-step="result"]');
  const dots = finderCard.querySelectorAll(".finder-dot");
  const backBtn = finderCard.querySelector(".finder-back");
  const restartBtn = finderCard.querySelector(".finder-restart");

  const resultTitle = document.getElementById("finder-result-title");
  const resultText = document.getElementById("finder-result-text");
  const resultLink = document.getElementById("finder-result-link");

  const recommendations = {
    "Selbstständigkeit": {
      name: "Buchhaltung für Anfänger",
      url: "buchhaltung-fuer-anfaenger.html",
      note: "Der praktische Einstieg für Selbstständige und Gründer ohne Vorwissen."
    },
    "Buchhaltung": {
      name: "Buchhaltung für Anfänger",
      url: "buchhaltung-fuer-anfaenger.html",
      note: "Der praktische Einstieg für Selbstständige und Gründer ohne Vorwissen."
    },
    "Finanzen": {
      name: "Buchhaltung und Steuern einfach geregelt",
      url: "buchhaltung-steuern-ebook.html",
      note: "Der Praxis-Guide für Solo-Selbstständige zu Steuern und Finanzen."
    },
    "Steuern": {
      name: "Buchhaltung und Steuern einfach geregelt",
      url: "buchhaltung-steuern-ebook.html",
      note: "Der Praxis-Guide für Solo-Selbstständige zu Steuern und Finanzen."
    },
    "Marketing": {
      name: "So gewinnt man Kunden über Google Ads",
      url: "google-ads-ebook.html",
      note: "Der Schritt-für-Schritt-Fahrplan für mehr Kundenanfragen über Google Ads."
    },
    "Persönliche Entwicklung": {
      name: "unseren gesamten Themenkatalog",
      url: "index.html#produkt",
      note: "Entdecke alle digitalen Ratgeber und E-Books im Überblick."
    },
    "Beruf & Karriere": {
      name: "unseren gesamten Themenkatalog",
      url: "index.html#produkt",
      note: "Entdecke alle digitalen Ratgeber und E-Books im Überblick."
    },
    "Allgemeines Wissen": {
      name: "unseren gesamten Themenkatalog",
      url: "index.html#produkt",
      note: "Entdecke alle digitalen Ratgeber und E-Books im Überblick."
    }
  };

  const formatPhrase = {
    PDF: "als PDF",
    Ebook: "als Ebook",
    "E-Book": "als E-Book",
    Anleitung: "als Anleitung",
    Ratgeber: "als digitalen Ratgeber"
  };

  const setActiveDot = (n) => {
    dots.forEach((dot) => dot.classList.toggle("active", Number(dot.dataset.dot) === n));
  };

  const showStep = (step) => {
    stepTopic.hidden = step !== 1;
    stepFormat.hidden = step !== 2;
    stepResult.hidden = step !== 3;
    setActiveDot(step);
  };

  finderCard.querySelectorAll('[data-question="topic"] .finder-option').forEach((btn) => {
    btn.addEventListener("click", () => {
      state.topic = btn.dataset.value;
      finderCard.querySelectorAll('[data-question="topic"] .finder-option').forEach((b) => b.classList.toggle("selected", b === btn));
      showStep(2);
    });
  });

  finderCard.querySelectorAll('[data-question="format"] .finder-option').forEach((btn) => {
    btn.addEventListener("click", () => {
      state.format = btn.dataset.value;
      finderCard.querySelectorAll('[data-question="format"] .finder-option').forEach((b) => b.classList.toggle("selected", b === btn));

      const rec = recommendations[state.topic];
      const phrase = formatPhrase[state.format] || "als digitalen Ratgeber";

      resultTitle.textContent = `Unsere Empfehlung für „${state.topic}"`;
      resultText.textContent = `Für das Thema „${state.topic}" empfehlen wir Dir aktuell ${rec.name} ${phrase}. ${rec.note}`;
      resultLink.href = rec.url;

      showStep(3);

      dataLayer.push({
        event: "topic_finder_result",
        finder_topic: state.topic,
        finder_format: state.format,
        finder_recommendation: rec.name
      });
    });
  });

  if (backBtn) {
    backBtn.addEventListener("click", () => showStep(1));
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      state.topic = null;
      state.format = null;
      finderCard.querySelectorAll(".finder-option.selected").forEach((b) => b.classList.remove("selected"));
      showStep(1);
    });
  }
}

// GTM DataLayer: Klick-Tracking für Links zu Produktseiten
document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach((link) => {
  link.addEventListener("click", () => {
    dataLayer.push({
      event: "select_content",
      link_url: link.getAttribute("href")
    });
  });
});
