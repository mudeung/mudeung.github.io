"use strict";

(() => {
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
    console.error("암호 입력 UI 요소를 찾을 수 없습니다.");
    return;
  }

  // 주의: 브라우저에 저장하는 암호는 안전한 비밀 정보가 아닙니다.
  // 실제 보안이 필요한 서비스에서는 서버 측 인증을 사용하세요.
  const ACCESS_PASSWORD = "CHANGE_THIS_PASSWORD";

  let pendingUrl = null;
  let isSubmitting = false;

  function openPasswordDialog(url) {
    pendingUrl = url;
    passwordInput.value = "";
    passwordStatus.textContent = "";
    passwordTarget.textContent =
      "접속하려면 공통 암호를 입력하세요.";

    if (!passwordPanel.open) {
      passwordPanel.showModal();
    }

    passwordInput.focus();
  }

  function closePasswordDialog() {
    pendingUrl = null;
    passwordInput.value = "";
    passwordStatus.textContent = "";

    if (passwordPanel.open) {
      passwordPanel.close();
    }
  }

  passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (isSubmitting || !pendingUrl) {
      return;
    }

    if (!passwordForm.reportValidity()) {
      return;
    }

    isSubmitting = true;

    try {
      if (passwordInput.value !== ACCESS_PASSWORD) {
        passwordStatus.textContent =
          "암호가 올바르지 않습니다. 다시 입력해 주세요.";
        passwordInput.value = "";
        passwordInput.focus();
        return;
      }

      // 사전에 지정된 HTTPS 주소만 허용
      const allowedHosts = new Set(["mudeung.github.io"]);
      const destination = new URL(pendingUrl, window.location.href);

      if (
        destination.protocol !== "https:" ||
        !allowedHosts.has(destination.hostname) ||
        ![
          "/gpscall.html",
          "/gps.html",
          "/emscall.html",
          "/rescue.html"
        ].includes(destination.pathname)
      ) {
        passwordStatus.textContent =
          "허용되지 않은 접속 주소입니다.";
        return;
      }

      const destinationUrl = destination.href;
      closePasswordDialog();
      window.location.assign(destinationUrl);
    } catch (error) {
      console.error("메뉴 이동 중 오류가 발생했습니다.", error);
      passwordStatus.textContent =
        "처리 중 오류가 발생했습니다. 다시 시도해 주세요.";
    } finally {
      isSubmitting = false;
    }
  });

  cancelButton.addEventListener("click", closePasswordDialog);

  passwordPanel.addEventListener("close", () => {
    pendingUrl = null;
    passwordInput.value = "";
    passwordStatus.textContent = "";
  });

  // 링크를 클릭할 때 암호 입력창 표시
  document.querySelectorAll(".icon-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      const href = card.getAttribute("href");

      if (!href) {
        return;
      }

      event.preventDefault();
      openPasswordDialog(href);
    });
  });
})();
