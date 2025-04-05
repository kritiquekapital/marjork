import { Draggable } from './draggable.js';
import { initLogisticsTheme } from './logistics.js';

document.addEventListener('DOMContentLoaded', () => {
  const draggableElement = document.getElementById('musicPlayer');
  if (!draggableElement) throw new Error("Music player element not found");
  const draggable = new Draggable(draggableElement);

  const themes = [
    { name: "classic", displayName: "😎" },
    { name: "modern", displayName: "🌚" },
    { name: "nature", displayName: "🌞" },
    { name: "logistics", displayName: "📦" },
    { name: "retro", displayName: "🕹️" },
    { name: "space", displayName: "🚀" }
  ];

  let currentThemeIndex = 0;
  let cleanupLogistics = () => {};

  // Background Manager
  const spaceBackground = document.createElement("iframe");
  spaceBackground.className = "space-background-stream";
  spaceBackground.setAttribute("frameborder", "0");
  spaceBackground.setAttribute("allow", "autoplay; encrypted-media");
  spaceBackground.setAttribute("src", 
    "https://www.youtube.com/embed/H999s0P1Er0?autoplay=1&mute=1&controls=0&loop=1&vq=hd1080"
  );
  document.body.prepend(spaceBackground);

  // Theme Application
  function applyTheme() {
    cleanupLogistics();
    const previousTheme = themes[currentThemeIndex].name;
    document.body.classList.remove(`theme-${previousTheme}`);

    const newTheme = themes[currentThemeIndex];
    document.body.classList.add(`theme-${newTheme.name}`);
    document.getElementById('themeButton').textContent = newTheme.displayName;

    // Theme-Specific Setup
    spaceBackground.style.display = newTheme.name === "space" ? "block" : "none";
    
    if (newTheme.name === "logistics") {
      cleanupLogistics = initLogisticsTheme() || (() => {});
    }

    draggable.setZeroGravityMode(newTheme.name === "space");
  }

  // UI State Management
  let inactivityTimer;
  const handleUIState = (shouldHide) => {
    if (!document.body.classList.contains("theme-logistics")) return;

    const gridContainer = document.querySelector(".grid-container");
    const mediaControls = document.querySelector(".media-controls");

    if (gridContainer) {
      gridContainer.style.opacity = shouldHide ? "0" : "1";
      gridContainer.style.pointerEvents = shouldHide ? "none" : "auto";
    }
    
    if (mediaControls) {
      mediaControls.style.opacity = shouldHide ? "0" : "1";
      mediaControls.style.transform = shouldHide ? "translateY(100%)" : "translateY(0)";
    }
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    handleUIState(false);
    inactivityTimer = setTimeout(() => handleUIState(true), 7000);
  };

  // Event Listeners
  document.getElementById('themeButton').addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme();
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.logistics-shipper')) {
      const gridContainer = document.querySelector(".grid-container");
      const mediaControls = document.querySelector(".media-controls");
      if (gridContainer) gridContainer.classList.toggle("shipped");
      if (mediaControls) mediaControls.classList.toggle("visible");
    }
  });

  ['mousemove', 'keydown', 'click', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer);
  });

  // Initialization
  applyTheme();
  resetInactivityTimer();
});
