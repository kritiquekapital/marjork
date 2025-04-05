import { Draggable } from './draggable.js';
import { initLogisticsTheme } from './logistics.js';

document.addEventListener('DOMContentLoaded', () => {
  const draggableElement = document.getElementById('musicPlayer');
  if (!draggableElement) throw new Error("Element with ID 'musicPlayer' not found");

  const draggable = new Draggable(draggableElement);
  const themes = [
    { name: "classic", displayName: "😎" },
    { name: "modern", displayName: "🌚" },
    { name: "nature", displayName: "🌞" },
    { name: "logistics", displayName: "📦" },
    { name: "retro", displayName: "🕹️" },
    { name: "space", displayName: "🚀" }
  ];

  let cleanupLogistics = () => {};
  let currentThemeIndex = 0;

  const createBackground = () => {
    const iframe = document.createElement("iframe");
    iframe.className = "space-background-stream";
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allow", "autoplay; encrypted-media");
    iframe.setAttribute("src", "https://www.youtube.com/embed/H999s0P1Er0?autoplay=1&mute=1&controls=0&loop=1&vq=hd1080");
    return iframe;
  };

  const spaceBackground = createBackground();
  document.body.prepend(spaceBackground);

  const themeButton = document.getElementById("themeButton");
  if (!themeButton) throw new Error("Theme button not found");

  function applyTheme() {
    cleanupLogistics();
    const previousTheme = themes[currentThemeIndex].name;
    const newTheme = themes[currentThemeIndex];
    
    document.body.className = `theme-${newTheme.name}`;
    themeButton.textContent = newTheme.displayName;

    // Handle background visibility
    spaceBackground.style.display = newTheme.name === "space" ? "block" : "none";

    // Initialize theme-specific components
    if (newTheme.name === "logistics") {
      cleanupLogistics = initLogisticsTheme() || (() => {});
    }

    // Update draggable mode
    draggable.setZeroGravityMode(newTheme.name === "space");
  }

  // UI State Management
  let inactivityTimer;
  const handleUIState = (shouldHide) => {
    if (!document.body.classList.contains("theme-logistics")) return;

    const gridContainer = document.querySelector(".grid-container");
    const mediaControls = document.querySelector(".media-controls");

    [gridContainer, mediaControls].forEach(element => {
      if (!element) return;
      element.style.opacity = shouldHide ? "0" : "1";
      element.style.pointerEvents = shouldHide ? "none" : "auto";
      if (element === mediaControls) {
        element.style.transform = shouldHide ? "translateY(100%)" : "translateY(0)";
      }
    });
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    handleUIState(false);
    inactivityTimer = setTimeout(() => handleUIState(true), 7000);
  };

  // Event Listeners
  const handleThemeSwitch = () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme();
  };

  const handleShipperClick = (event) => {
    if (event.target.closest('.logistics-shipper')) {
      const gridContainer = document.querySelector(".grid-container");
      const mediaControls = document.querySelector(".media-controls");
      [gridContainer, mediaControls].forEach(element => {
        if (element) element.classList.toggle("visible");
      });
    }
  };

  themeButton.addEventListener('click', handleThemeSwitch);
  document.addEventListener('click', handleShipperClick);
  ['mousemove', 'keydown', 'click', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer);
  });

  // Initial setup
  applyTheme();
  resetInactivityTimer();
});
