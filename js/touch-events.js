// Prevent double-tap zoom
document.addEventListener("touchstart", function (event) {
    if (event.target.tagName === "BUTTON" || event.target.tagName === "A") {
        event.target.click();
    }
}, { passive: true });

// Disable gesture zoom
document.addEventListener("gesturestart", function (event) {
    event.preventDefault();
});

// Additional mobile-specific functions
document.addEventListener("DOMContentLoaded", function () {
    document.body.style.touchAction = "manipulation"; // Prevents double-tap zoom
});

function disableScroll() {
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed"; // Prevents jumping when re-enabling
}

function enableScroll() {
  document.body.style.overflow = "";
  document.body.style.position = "";
}

// Disable scroll on mobile
if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  disableScroll();
}

document.addEventListener("touchmove", function (event) {
  event.preventDefault(); // Blocks swipe scrolling
}, { passive: false });
