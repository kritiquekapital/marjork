const themes = [
  { name: "classic", displayName: "😎" },
  { name: "modern", displayName: "🌚" },
  { name: "nature", displayName: "🌞" },
  { name: "retro", displayName: "🕹️" },
  { name: "space", displayName: "🚀" }
];

let inactivityTimer;

document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.querySelector(".grid-container");

  // Ensure the tint div exists
  let tintDiv = document.querySelector(".space-tint");
  if (!tintDiv) {
    tintDiv = document.createElement("div");
    tintDiv.classList.add("space-tint");
    document.body.appendChild(tintDiv);
  }

  function hideSpaceThemeUI() {
    if (document.body.classList.contains("theme-space") && gridContainer) {
      gridContainer.style.opacity = "0";
      gridContainer.style.pointerEvents = "none";
      tintDiv.style.opacity = "1"; // Keep tint visible
    }
  }

  function showSpaceThemeUI() {
    if (document.body.classList.contains("theme-space") && gridContainer) {
      gridContainer.style.opacity = "1";
      gridContainer.style.pointerEvents = "auto";
      tintDiv.style.opacity = "1"; // Ensure tint remains
    }
  }

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    if (document.body.classList.contains("theme-space")) {
      showSpaceThemeUI(); // Show UI if active
      inactivityTimer = setTimeout(hideSpaceThemeUI, 10000); // 10s timeout
    }
  }

  // Detect activity and reset timer
  ["mousemove", "keydown", "click", "touchstart"].forEach((event) => {
    document.addEventListener(event, resetInactivityTimer);
  });

  // Core function to apply themes
  function applyTheme(themeName) {
    document.body.className = `theme-${themeName}`;

    if (themeName === "space") {
      resetInactivityTimer(); // Enable inactivity timer
      tintDiv.classList.remove("hidden");
    } else {
      clearTimeout(inactivityTimer); // Disable inactivity hiding for other themes
      showSpaceThemeUI(); // Ensure UI is visible
      tintDiv.classList.add("hidden"); // Hide tint in non-space themes
    }
  }

  // Theme switching via button
  const themeButton = document.getElementById("themeButton");
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const currentTheme = document.body.className.replace("theme-", "");
      const nextTheme = themes[(themes.findIndex(t => t.name === currentTheme) + 1) % themes.length].name;
      applyTheme(nextTheme);
    });
  }

  // Apply current theme when page loads
  const currentTheme = document.body.className.replace("theme-", "");
  if (currentTheme === "space") {
    resetInactivityTimer();
  }
});
