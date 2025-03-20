const themes = [
  { name: "classic", displayName: "😎" },
  { name: "modern", displayName: "🌚" },
  { name: "nature", displayName: "🌞" },
  { name: "retro", displayName: "🕹️" },
  { name: "space", displayName: "🚀" }
];

let inactivityTimer;

// Create and append the tint div if it doesn't exist
if (!document.querySelector(".space-tint")) {
  const tintDiv = document.createElement("div");
  tintDiv.classList.add("space-tint");
  document.body.appendChild(tintDiv);
}

function hideSpaceThemeUI() {
  if (document.body.classList.contains("theme-space")) {
    document.querySelector(".grid-container").style.opacity = "0";
    document.querySelector(".grid-container").style.pointerEvents = "none";
    document.querySelector(".space-tint").style.opacity = "1"; // Keep tint active
  }
}

function showSpaceThemeUI() {
  if (document.body.classList.contains("theme-space")) {
    document.querySelector(".grid-container").style.opacity = "1";
    document.querySelector(".grid-container").style.pointerEvents = "auto";
    document.querySelector(".space-tint").style.opacity = "1"; // Keep tint active
  }
}

// Reset the inactivity timer
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  if (document.body.classList.contains("theme-space")) {
    showSpaceThemeUI(); // Ensure UI is visible when active
    inactivityTimer = setTimeout(hideSpaceThemeUI, 10000); // 10 seconds timeout
  }
}

// Event listeners to detect activity
document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("keydown", resetInactivityTimer);
document.addEventListener("click", resetInactivityTimer);
document.addEventListener("touchstart", resetInactivityTimer);

// Apply theme logic
function applyTheme(themeName) {
  document.body.className = `theme-${themeName}`;

  if (themeName === "space") {
    resetInactivityTimer(); // Start inactivity detection when space theme is activated
    document.querySelector(".space-tint").classList.remove("hidden");
  } else {
    clearTimeout(inactivityTimer); // Disable inactivity hiding for other themes
    showSpaceThemeUI(); // Ensure UI stays visible in non-space themes
    document.querySelector(".space-tint").classList.add("hidden"); // Hide tint if switching themes
  }
}

// Example: Applying a theme dynamically (replace with your theme-switching logic)
document.getElementById("themeButton").addEventListener("click", () => {
  const currentTheme = document.body.className.replace("theme-", "");
  const nextTheme = themes[(themes.findIndex(t => t.name === currentTheme) + 1) % themes.length].name;
  applyTheme(nextTheme);
});
