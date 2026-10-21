
"use strict";

const allowedUrls = new Set([
  "https://mudeung.github.io/gpscall.html",
  "https://mudeung.github.io/gps.html",
  "https://mudeung.github.io/emscall.html",
  "https://mudeung.github.io/rescue.html"
]);

// 기본 화면 잠금용 예시 암호.
// GitHub Pages에서는 이 암호가 소스 코드에 노출됩니다.
const COMMON_PASSWORD = "1187";

const protectedUrls = new Set([
  "https://mudeung.github.io/gpscall.html",
  "https://mudeung.github.io/emscall.html"
]);

const cards = document.querySelectorAll(".icon-card[data-href]");
const panel = document.getElementById("passwordPanel");
const form = document.getElementById("passwordForm");
const passwordInput = document.getElementById("accessPassword");
const status = document.getElementById("passwordStatus");
const targetText = document.getElementById("passwordTarget");
const cancelButton = document.getElementById("cancelPassword");

let pendingUrl = null;

function closePasswordPanel() {
  panel.hidden = true;
  form.reset();
  status.textContent = "";
  pendingUrl = null;
}

function openPasswordPanel(url) {
  pendingUrl = url;
  panel.hidden = false;
  status.textContent = "";

  targetText.textContent =
    url === "https://mudeung.github.io/gpscall.html"
      ? "산악구조문자 메뉴에 접속하려면 공통 암호를 입력하세요."
      : "위치확인 메뉴에 접속하려면 공통 암호를 입력하세요.";

  passwordInput.value = "";
  passwordInput.focus();

  panel.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function navigate(url) {
  if (!allowedUrls.has(url)) return;

  if (protectedUrls.has(url)) {
    openPasswordPanel(url);
    return;
  }

  window.location.assign(url);
}

cards.forEach(card => {
  function handleNavigation() {
    navigate(card.dataset.href);
  }

  card.addEventListener("click", handleNavigation);

  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigation();
    }
  });
});

form.addEventListener("submit", event => {
  event.preventDefault();

  if (!pendingUrl || !allowedUrls.has(pendingUrl)) {
    closePasswordPanel();
    return;
  }

  if (passwordInput.value !== COMMON_PASSWORD) {
    status.textContent = "암호가 올바르지 않습니다. 다시 입력해주세요.";
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  const destination = pendingUrl;

  closePasswordPanel();
  window.location.assign(destination);
});

cancelButton.addEventListener("click", closePasswordPanel);
