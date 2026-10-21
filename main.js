
"use strict";

const allowedUrls = new Set([
  "https://mudeung.github.io/gpscall.html",
  "https://mudeung.github.io/gps.html",
  "https://mudeung.github.io/emscall.html",
  "https://mudeung.github.io/rescue.html"
]);

document.querySelectorAll(".icon-card[data-href]").forEach(card => {
  function navigate() {
    const url = card.dataset.href;

    if (allowedUrls.has(url)) {
      window.location.assign(url);
    }
  }

  card.addEventListener("click", navigate);

  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate();
    }
  });
});
