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

const purchaseToast = document.getElementById("purchase-toast");
const purchaseToastName = document.getElementById("purchase-toast-name");
const purchaseToastTime = document.getElementById("purchase-toast-time");

const purchaseNotifications = [
  { name: "Person M.", time: "38 Sekunden" },
  { name: "Person K.", time: "2 Minuten" },
  { name: "Person S.", time: "54 Sekunden" },
  { name: "Person L.", time: "4 Minuten" },
  { name: "Person T.", time: "27 Sekunden" }
];

let purchaseNotificationIndex = 0;

function showPurchaseNotification() {
  if (!purchaseToast || !purchaseToastName || !purchaseToastTime) {
    return;
  }

  const notification = purchaseNotifications[purchaseNotificationIndex];
  purchaseNotificationIndex = (purchaseNotificationIndex + 1) % purchaseNotifications.length;

  purchaseToastName.textContent = notification.name;
  purchaseToastTime.textContent = notification.time;
  purchaseToast.hidden = false;

  window.requestAnimationFrame(() => {
    purchaseToast.classList.add("is-visible");
  });

  window.setTimeout(() => {
    purchaseToast.classList.remove("is-visible");

    window.setTimeout(() => {
      purchaseToast.hidden = true;
    }, 260);
  }, 5200);
}

if (purchaseToast && purchaseToastName && purchaseToastTime) {
  window.setTimeout(showPurchaseNotification, 3600);
  window.setInterval(showPurchaseNotification, 14000);
}
