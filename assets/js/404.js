document.getElementById("year").textContent = new Date().getFullYear();

const jokes = [
  "Diese Seite wurde offenbar nie als E-Book veröffentlicht.",
  "404 – das Kapitel, das es nie ins Buch geschafft hat.",
  "Sieht so aus, als hättest du eine Seite aus dem Buch gerissen, die es gar nicht gab.",
  "Diese URL ist vergriffen. Und nein, wir drucken sie nicht nach.",
  "Entweder ist die Seite verloren gegangen, oder Du hast Dich im Inhaltsverzeichnis vertan.",
  "Selbst unser bester Ratgeber hat kein Kapitel für „Seite nicht gefunden\".",
  "Diese Seite hat sich offenbar selbst weggebucht.",
  "Fehler 404: der spannendste Cliffhanger, den wir nie geschrieben haben.",
  "Diese PDF-Datei existiert nur in einer Parallelwelt mit besserem WLAN.",
  "Du hast eine Anleitung gesucht - gefunden hast Du nur diese Sackgasse."
];

const jokeText = document.getElementById("joke-text");
const rerollBtn = document.getElementById("joke-reroll");
let lastIndex = -1;

function showRandomJoke() {
  let index = Math.floor(Math.random() * jokes.length);
  if (jokes.length > 1) {
    while (index === lastIndex) {
      index = Math.floor(Math.random() * jokes.length);
    }
  }
  lastIndex = index;

  jokeText.classList.add("fading");
  window.setTimeout(() => {
    jokeText.textContent = jokes[index];
    jokeText.classList.remove("fading");
  }, 150);
}

if (jokeText) {
  lastIndex = Math.floor(Math.random() * jokes.length);
  jokeText.textContent = jokes[lastIndex];
}

if (rerollBtn) {
  rerollBtn.addEventListener("click", showRandomJoke);
}

window.dataLayer = window.dataLayer || [];
dataLayer.push({
  event: "page_not_found",
  page_path: window.location.pathname,
  referrer: document.referrer || "(direct)"
});
