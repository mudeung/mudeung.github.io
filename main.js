
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("passwordPanel");
  const form = document.getElementById("passwordForm");
  const input = document.getElementById("accessPassword");
  const status = document.getElementById("passwordStatus");
  const target = document.getElementById("passwordTarget");
  const cancel = document.getElementById("cancelPassword");

  if (!panel || !form || !input || !status || !target || !cancel) {
    console.error("암호 입력 HTML 요소를 찾을 수 없습니다.");
    return;
  }

  // 테스트용 암호
  const ACCESS_PASSWORD = "1234";

  let pendingUrl = "";

  const allowedPaths = new Set([
    "/gpscall.html",
    "/gps.html",
    "/emscall.html",
    "/rescue.html"
  ]);

  function openPanel(url) {
    pendingUrl = url;
    form.reset();
    status.textContent = "";
    target.textContent = "접속하려면 공통 암호를 입력하세요.";

    if (typeof panel.showModal === "function") {
      if (!panel.open) panel.showModal();
    } else {
      panel.setAttribute("open", "");
    }

    input.focus();
  }

  function closePanel() {
    pendingUrl = "";
    form.reset();
    status.textContent = "";

    if (typeof panel.close === "function") {
      if (panel.open) panel.close();
    } else {
      panel.removeAttribute("open");
    }
  }

  document.querySelectorAll(".icon-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      const url = card.getAttribute("href") ||
        card.getAttribute("data-href");

      if (!url) {
        status.textContent = "메뉴 주소를 찾을 수 없습니다.";
        return;
      }

      event.preventDefault();
      openPanel(url);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!pendingUrl) {
      status.textContent = "메뉴를 다시 선택해 주세요.";
      return;
    }

    if (input.value !== ACCESS_PASSWORD) {
      status.textContent = "암호가 올바르지 않습니다.";
      input.value = "";
      input.focus();
      return;
    }

    let url;

    try {
      url = new URL(pendingUrl, window.location.href);
    } catch {
      status.textContent = "메뉴 주소가 올바르지 않습니다.";
      return;
    }

    if (
      url.protocol !== "https:" ||
      url.hostname !== "mudeung.github.io" ||
      !allowedPaths.has(url.pathname)
    ) {
      status.textContent = "허용되지 않은 메뉴 주소입니다.";
      return;
    }

    window.location.href = url.href;
  });

  cancel.addEventListener("click", closePanel);

  panel.addEventListener("close", () => {
    pendingUrl = "";
  });

  console.log("암호 입력 기능이 정상적으로 초기화되었습니다.");
});
