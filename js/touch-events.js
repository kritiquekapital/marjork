import { track } from './analytics.js';

document.addEventListener("DOMContentLoaded", function () {
  document.body.style.touchAction = "manipulation";
});

document.addEventListener("gesturestart", function (event) {
  event.preventDefault();
});

function disableScroll() {
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.body.style.height = "100dvh";
}

function enableScroll() {
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";
  document.body.style.height = "";
}

/* keep mobile fixed / no page scroll */
if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  disableScroll();
}

/* prevent page drag / swipe scrolling on touch devices,
   but do NOT synthesize fake clicks */
document.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);

/* ==================== */
/* Grid page switching (wip click + swipe right) */
/* ==================== */
document.addEventListener("DOMContentLoaded", function () {
  const gridContainer = document.querySelector(".grid-container");
  const wipButton = document.querySelector(".wip");
  if (!gridContainer) return;

  let onPage2 = false;

  function goToPage(pageNum) {
    const shouldBeOnPage2 = pageNum === 2;
    if (shouldBeOnPage2 === onPage2) return;
    onPage2 = shouldBeOnPage2;
    gridContainer.classList.toggle("page-2", onPage2);
    track("page_switch", { page: onPage2 ? 2 : 1 });
  }

  wipButton?.addEventListener("click", () => {
    goToPage(onPage2 ? 1 : 2);
  });

  let touchStartX = null;
  let touchStartY = null;

  gridContainer.addEventListener(
    "touchstart",
    (event) => {
      const t = event.changedTouches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    },
    { passive: true }
  );

  gridContainer.addEventListener(
    "touchend",
    (event) => {
      if (touchStartX === null) return;
      const t = event.changedTouches[0];
      const deltaX = t.clientX - touchStartX;
      const deltaY = t.clientY - touchStartY;
      touchStartX = null;
      touchStartY = null;

      const SWIPE_THRESHOLD = 50;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return; // mostly vertical, ignore

      goToPage(deltaX > 0 ? 2 : 1); // swipe right → page 2, swipe left → back
    },
    { passive: true }
  );
});

document.addEventListener("DOMContentLoaded", function () {
  const placeholders = document.querySelectorAll(".placeholder-button");

  placeholders.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("popped");
      setTimeout(() => button.classList.remove("popped"), 1400);

      const slot = Array.from(button.classList).find((c) => c.startsWith("ph-")) || "unknown";
      track("placeholder_click", { slot });
    });
  });
});

document.addEventListener("click", (event) => {
  const btn = event.target.closest("button:not(.wip):not(.kiss-button)");
  if (!btn) return;
  btn.classList.add("theme-flash");
  clearTimeout(btn._themeFlashTimer);
  btn._themeFlashTimer = setTimeout(() => {
    btn.classList.remove("theme-flash");
  }, 150);
});
