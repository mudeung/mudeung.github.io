"use strict";

document.addEventListener("DOMContentLoaded", () => { /*

무등산 위치 공유시스템
메뉴 암호 입력 기능 제거
각 메뉴는 기존 href 주소로 바로 이동 */

document.querySelectorAll(".icon-card").forEach((card) => { card.addEventListener("click", (event) => { const url = card.getAttribute("href");

  if (!url) {
    event.preventDefault();
    console.error("메뉴 주소를 찾을 수 없습니다.");
  }
});


});

console.log("무등산 위치 공유시스템이 정상적으로 초기화되었습니다."); });

/* ===================================================== 우클릭 메뉴 방지 ===================================================== */

document.addEventListener("contextmenu", (event) => { event.preventDefault(); });

/* ===================================================== 일부 단축키 방지 ===================================================== */

document.addEventListener("keydown", (event) => { const key = event.key.toLowerCase();

const blocked = event.key === "F12" || (event.ctrlKey && !event.shiftKey && ["u", "s"].includes(key)) || (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key));

if (blocked) { event.preventDefault(); } });
