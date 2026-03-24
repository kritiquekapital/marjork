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
