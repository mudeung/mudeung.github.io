"use strict";

document.querySelectorAll(".icon-card[data-href]").forEach(card => {
  card.addEventListener("click", () => {
    const url = card.dataset.href;

    const allowedUrls = new Set([
      "https://mudeung.github.io/gpscall.html",
      "https://mudeung.github.io/gps.html",
      "https://mudeung.github.io/emscall.html",
      "https://mudeung.github.io/rescue.html"
    ]);

    if (allowedUrls.has(url)) {
      window.location.assign(url);
    }
  });
});
