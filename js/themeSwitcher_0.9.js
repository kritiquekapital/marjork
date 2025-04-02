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

  const createBackground = (url, className) => {
    const iframe = document.createElement("iframe");
    iframe.classList.add(className);
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allow", "autoplay; encrypted-media");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("src", url);
    return iframe;
  };

  const spaceBackground = createBackground(
    "https://www.youtube.com/embed/H999s0P1Er0?autoplay=1&mute=1&controls=0&loop=1&vq=hd1080",
    "space-background-stream"
  );

  document.body.prepend(spaceBackground);

  let currentThemeIndex = 0;
  const themeButton = document.getElementById("themeButton");

  function applyTheme() {
    cleanupLogistics();
    
    const currentTheme = themes[currentThemeIndex];
    document.body.className = `theme-${currentTheme.name}`;
    themeButton.textContent = currentTheme.displayName;

    spaceBackground.style.display = currentTheme.name === "space" ? "block" : "none";

    const logisticsPlayer = document.getElementById('logistics-player');
    if (currentTheme.name === "logistics") {
      if (logisticsPlayer) logisticsPlayer.style.display = "block";
      cleanupLogistics = initLogisticsTheme() || (() => {});
    } else {
      if (logisticsPlayer) logisticsPlayer.style.display = "none";
    }
    
    draggable.setZeroGravityMode(currentTheme.name === "space");
  }

  let inactivityTimer;
  const gridContainer = document.querySelector(".grid-container");
  const mediaControlBar = document.querySelector(".media-controls");

  const handleUIState = (shouldHide) => {
    if (!gridContainer || !mediaControlBar) return; // Prevent null errors

    if (document.body.classList.contains("theme-space") || 
       document.body.classList.contains("theme-logistics")) {
      gridContainer.style.opacity = shouldHide ? "0" : "1";
      gridContainer.style.pointerEvents = shouldHide ? "none" : "auto";
      gridContainer.style.transition = "opacity 0.5s ease-in-out";

      mediaControlBar.style.opacity = shouldHide ? "0" : "1";
      mediaControlBar.style.transform = shouldHide ? "translateY(100%)" : "translateY(0)";
      mediaControlBar.style.transition = "opacity 0.5s ease-in-out, transform 0.5s ease-in-out";
    }
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    handleUIState(false);
    inactivityTimer = setTimeout(() => handleUIState(true), 7000);
  };

  ['mousemove', 'keydown', 'click', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer);
  });

  const arrowButton = document.querySelector(".logistics-shipper");
  if (arrowButton) {
    arrowButton.addEventListener("click", () => {
      if (!gridContainer || !mediaControlBar) return;

      gridContainer.classList.toggle("shipped");
      mediaControlBar.classList.toggle("visible");
    });
  }

  themeButton.addEventListener("click", () => {
    themeButton.style.animation = "spin 0.5s ease-in-out";
    setTimeout(() => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      applyTheme();
      themeButton.style.animation = "";
    }, 500);
  });

  resetInactivityTimer();
  applyTheme();
});
