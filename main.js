
"use strict";

const allowedUrls = new Set([
  "https://mudeung.github.io/gpscall.html",
  "https://mudeung.github.io/gps.html",
  "https://mudeung.github.io/emscall.html",
  "https://mudeung.github.io/rescue.html"
]);

// 기본 화면 잠금 암호
const COMMON_PASSWORD = "1187";

const protectedUrls = new Set([
  "https://mudeung.github.io/gpscall.html",
  "https://mudeung.github.io/emscall.html"
]);

document.querySelectorAll(".icon-card[data-href]").forEach(card => {
  function navigate() {
    const url = card.dataset.href;

    if (!url || !allowedUrls.has(url)) return;

    if (protectedUrls.has(url)) {
      const password = window.prompt("공통 암호를 입력하세요.");

      if (password === null) return;

      if (password !== COMMON_PASSWORD) {
        window.alert("암호가 올바르지 않습니다.");
        return;
      }
    }

    window.location.assign(url);
  }

  card.addEventListener("click", navigate);

  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate();
    }
  });
});
