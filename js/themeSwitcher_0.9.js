import { Draggable } from './draggable.js';

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

  // Background setup
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
    "https://www.youtube.com/embed/H999s0P1Er0?autoplay=1&mute=1&controls=0&loop=1",
    "space-background-stream"
  );

  const logisticsBackground = createBackground(
    "https://www.youtube.com/embed/videoseries?list=PLJUn5ZRCEXamUuAOpJ5VyTb0PA5_Pqlzw&autoplay=1&mute=1&controls=0&loop=1",
    "logistics-background-stream"
  );

  document.body.prepend(logisticsBackground, spaceBackground);

  // Theme management
  let currentThemeIndex = 0;
  const themeButton = document.getElementById("themeButton");

  function applyTheme() {
    const currentTheme = themes[currentThemeIndex];
    document.body.className = `theme-${currentTheme.name}`;
    themeButton.textContent = currentTheme.displayName;

    spaceBackground.style.display = currentTheme.name === "space" ? "block" : "none";
    logisticsBackground.style.display = currentTheme.name === "logistics" ? "block" : "none";
    draggable.setZeroGravityMode(currentTheme.name === "space");
  }

  // UI Visibility Management
  let inactivityTimer;
  
  const handleUIState = (shouldHide) => {
    const gridContainer = document.querySelector(".grid-container");
    if (document.body.classList.contains("theme-space") || 
       document.body.classList.contains("theme-logistics")) {
      gridContainer.style.opacity = shouldHide ? "0" : "1";
      gridContainer.style.pointerEvents = shouldHide ? "none" : "auto";
    }
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    handleUIState(false);
    inactivityTimer = setTimeout(() => handleUIState(true), 7000);
  };

  // Event Listeners
  ['mousemove', 'keydown', 'click', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer);
  });

  themeButton.addEventListener("click", () => {
    themeButton.style.animation = "spin 0.5s ease-in-out";
    setTimeout(() => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      applyTheme();
      themeButton.style.animation = "";
    }, 500);
  });

  // Initial setup
  resetInactivityTimer();
  applyTheme();
});
