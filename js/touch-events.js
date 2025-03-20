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