
"use strict";

const form = document.getElementById("smsForm");
const phoneInput = document.getElementById("phone");
const sendButton = document.getElementById("sendButton");
const status = document.getElementById("status");

const GPS_URL =
  const GPS_URL = "https://mudeung.github.io/gps.html";

let openingSMS = false;

function normalizePhone(value) {
  return value.replace(/[\s()-]/g, "");
}

function isValidKoreanMobile(value) {
  return /^01[016789]\d{7,8}$/.test(value);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (openingSMS) return;

  const phone = normalizePhone(phoneInput.value);

  if (!isValidKoreanMobile(phone)) {
    status.textContent =
      "휴대전화 번호를 다시 확인해주세요.";
    phoneInput.focus();
    return;
  }

  const message = [
    "[무등산 산악구조 요청]",
    "국립공원 특수구조대입니다.",
    "아래 링크를 눌러 위치를 확인해주세요.",
    GPS_URL
  ].join("\n");

  const encodedMessage = encodeURIComponent(message);

  const isIOS = /iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );

  const separator = isIOS ? "&" : "?";

  const smsURL =
    "sms:" + phone +
    separator + "body=" + encodedMessage;

  openingSMS = true;
  sendButton.disabled = true;
  status.textContent =
    "문자 앱을 여는 중입니다. 실제 전송 여부를 확인해주세요.";

  // 입력값을 로그, URL 매개변수, 저장소에 기록하지 않습니다.
  window.location.href = smsURL;

  // 페이지가 계속 활성화되어 있을 경우 재시도할 수 있게 복구
  window.setTimeout(function () {
    openingSMS = false;
    sendButton.disabled = false;
  }, 5000);
});
