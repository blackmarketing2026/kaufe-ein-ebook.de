document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const newsletterForm = document.getElementById("newsletter-form");
newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = newsletterForm.querySelector("input[type='email']").value;
  alert(`Danke für deine Anmeldung, ${email}!`);
  newsletterForm.reset();
});
