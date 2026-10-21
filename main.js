
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const passwordPanel = document.getElementById("passwordPanel");
  const passwordForm = document.getElementById("passwordForm");
  const passwordInput = document.getElementById("accessPassword");
  const passwordStatus = document.getElementById("passwordStatus");
  const passwordTarget = document.getElementById("passwordTarget");
  const cancelButton = document.getElementById("cancelPassword");

  if (
    !passwordPanel ||
    !passwordForm ||
    !passwordInput ||
    !passwordStatus ||
    !passwordTarget ||
    !cancelButton
  ) {
    console.error("암호 입력창 HTML 요소를 확인하세요.");
    return;
  }

  // 실제 사용할 암호로 변경하세요.
  const ACCESS_PASSWORD = "1234";

  let pendingUrl = null;

  function openPasswordDialog(url) {
    pendingUrl = url;
    passwordForm.reset();
    passwordStatus.textContent = "";
    passwordTarget.textContent =
      "접속하려면 공통 암호를 입력하세요.";

    if (typeof passwordPanel.showModal === "function") {
      if (!passwordPanel.open) {
        passwordPanel.showModal();
      }
    } else {
      // dialog 미지원 브라우저용 대체 처리
      passwordPanel.setAttribute("open", "");
    }

    passwordInput.focus();
  }

  function closePasswordDialog() {
    pendingUrl = null;
    passwordForm.reset();
    passwordStatus.textContent = "";

    if (typeof passwordPanel.close === "function") {
      if (passwordPanel.open) {
        passwordPanel.close();
      }
    } else {
      passwordPanel.removeAttribute("open");
    }
  }

  document.querySelectorAll(".icon-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      const href = card.getAttribute("href");

      // 기존 HTML의 data-href 방식도 지원
      const destination = href || card.getAttribute("data-href");

      if (!destination) return;

      event.preventDefault();
      openPasswordDialog(destination);
    });

    // 링크가 아닌 기존 div.icon-card도 키보드로 사용 가능
    if (card.tagName !== "A") {
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          card.click();
        }
      });
    }
  });

  passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!pendingUrl) {
      passwordStatus.textContent = "메뉴를 다시 선택해 주세요.";
      return;
    }

    if (!passwordInput.value) {
      passwordStatus.textContent = "암호를 입력해 주세요.";
      passwordInput.focus();
      return;
    }

    if (passwordInput.value !== ACCESS_PASSWORD) {
      passwordStatus.textContent =
        "암호가 올바르지 않습니다. 다시 입력해 주세요.";
      passwordInput.value = "";
      passwordInput.focus();
      return;
    }

    let destination;

    try {
      destination = new URL(pendingUrl, window.location.href);
    } catch {
      passwordStatus.textContent = "접속 주소가 올바르지 않습니다.";
      return;
    }

    const allowedPaths = [
      "/gpscall.html",
      "/gps.html",
      "/emscall.html",
      "/rescue.html"
    ];

    if (
      destination.protocol !== "https:" ||
      destination.hostname !== "mudeung.github.io" ||
      !allowedPaths.includes(destination.pathname)
    ) {
      passwordStatus.textContent = "허용되지 않은 접속 주소입니다.";
      return;
    }

    window.location.assign(destination.href);
  });

  cancelButton.addEventListener("click", closePasswordDialog);

  passwordPanel.addEventListener("close", () => {
    pendingUrl = null;
  });
});
