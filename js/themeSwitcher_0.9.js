import { Draggable } from './draggable.js';

// themeSwitcher_0.9.js
document.addEventListener('DOMContentLoaded', () => {
  // Ensure the draggable element exists before initializing Draggable
  const draggableElement = document.getElementById('musicPlayer'); // Change to 'musicPlayer'

  if (!draggableElement) {
    throw new Error("Element with ID 'musicPlayer' not found. Please check the HTML.");
  }

  // Initialize the Draggable instance once
  const draggable = new Draggable(draggableElement);

  // Define the function to control zero-gravity mode
  function setZeroGravityMode(isZeroGravity) {
    draggable.setZeroGravityMode(isZeroGravity);
  }

  const themes = [
    { name: "classic", displayName: "😎" },
    { name: "modern", displayName: "🌚" },
    { name: "nature", displayName: "🌞" },
    { name: "retro", displayName: "🕹️" },
    { name: "space", displayName: "🚀" }
  ];

  let currentThemeIndex = 0;
  const spaceBackground = document.createElement("iframe");
  spaceBackground.classList.add("space-background-stream");
  spaceBackground.setAttribute("frameborder", "0");
  spaceBackground.setAttribute("allow", "autoplay; encrypted-media");
  spaceBackground.setAttribute("allowfullscreen", "");
  spaceBackground.setAttribute("src", "https://www.youtube.com/embed/H999s0P1Er0?autoplay=1&mute=1&controls=0&loop=1");
  document.body.prepend(spaceBackground);

  // Apply theme based on the current index
  function applyTheme() {
    const currentTheme = themes[currentThemeIndex];
    document.body.className = `theme-${currentTheme.name}`;
    themeButton.textContent = currentTheme.displayName;

    if (currentTheme.name === "space") {
      spaceBackground.style.display = "block";
      setZeroGravityMode(true);  // Enable zero-gravity mode
    } else {
      spaceBackground.style.display = "none";
      setZeroGravityMode(false);  // Disable zero-gravity mode
    }
  }

  let inactivityTimer;

  // Function to hide space theme UI
  function hideSpaceThemeUI() {
    if (document.body.classList.contains("theme-space")) {
      document.querySelector(".grid-container").style.opacity = "0";
      document.querySelector(".grid-container").style.pointerEvents = "none";
    }
  }

  // Function to show space theme UI
  function showSpaceThemeUI() {
    if (document.body.classList.contains("theme-space")) {
      document.querySelector(".grid-container").style.opacity = "1";
      document.querySelector(".grid-container").style.pointerEvents = "auto";
    }
  }

  // Reset the inactivity timer
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    showSpaceThemeUI(); // Ensure UI is visible when active
    inactivityTimer = setTimeout(hideSpaceThemeUI, 7000); // 7 seconds timeout
  }

  // Listen for pointer movements to detect activity
  document.addEventListener("mousemove", resetInactivityTimer);
  document.addEventListener("keydown", resetInactivityTimer);
  document.addEventListener("click", resetInactivityTimer);
  document.addEventListener("touchstart", resetInactivityTimer);

  // Initialize the timer when the page loads
  resetInactivityTimer();

  const themeButton = document.getElementById("themeButton");
  themeButton.addEventListener("click", () => {
    themeButton.style.animation = "spin 0.5s ease-in-out";
    setTimeout(() => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      applyTheme();
      themeButton.style.animation = "";
    }, 500);
  });

  applyTheme();  // Apply the initial theme
});
