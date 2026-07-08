const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

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
