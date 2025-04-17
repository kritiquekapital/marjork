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

  const natureVideo = document.createElement("video");
  natureVideo.classList.add("nature-background-video");
  natureVideo.src = "https://github.com/kritiquekapital/marjork/releases/download/duck/book_mill_lapse_x07.mp4";
  natureVideo.autoplay = true;
  natureVideo.loop = true;
  natureVideo.muted = true; // optional: set to false if you want natural sound only from here
  natureVideo.playsInline = true;

  const natureAudio = document.createElement("audio");
  natureAudio.src = "https://github.com/kritiquekapital/marjork/releases/download/duck/book_mill_flow.mp3";
  natureAudio.loop = true;
  natureAudio.volume = 0.4; // optional, tweak volume

  const volumeSlider = document.createElement("input");
  volumeSlider.type = "range";
  volumeSlider.min = "0";
  volumeSlider.max = "1";
  volumeSlider.step = "0.01";
  volumeSlider.value = natureAudio.volume;
  volumeSlider.classList.add("nature-volume-slider");

  volumeSlider.addEventListener("input", () => {
    natureAudio.volume = volumeSlider.value;
  });

  const speedSlider = document.createElement("input");
  speedSlider.type = "range";
  speedSlider.min = "0.25";
  speedSlider.max = "2.0";
  speedSlider.step = "0.05";
  speedSlider.value = "1.0";
  speedSlider.classList.add("nature-speed-slider");

  speedSlider.addEventListener("input", () => {
    natureVideo.playbackRate = speedSlider.value;
  });

  document.body.appendChild(volumeSlider);
  document.body.appendChild(speedSlider);
  document.body.prepend(spaceBackground);
  document.body.prepend(natureVideo);
  document.body.appendChild(natureAudio);

  let currentThemeIndex = 0;
  const themeButton = document.getElementById("themeButton");

  // Cleanup previous theme
  document.querySelectorAll('[data-theme]').forEach(link => link.remove());

  function applyTheme() {
    cleanupLogistics();
    document.querySelectorAll('[data-theme]').forEach(link => link.remove());

    const themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.href = `css/themes/theme-${themes[currentThemeIndex].name}.css`;
    themeLink.dataset.theme = true;
  
    const responsiveLink = document.querySelector('link[href="css/responsive.css"]');
    document.head.insertBefore(themeLink, responsiveLink);

    const currentTheme = themes[currentThemeIndex];
    document.body.className = `theme-${currentTheme.name}`;
   themeButton.textContent = currentTheme.displayName;

    if (currentTheme.name === "nature") {
      natureVideo.style.display = "block";
      natureAudio.play().catch(e => console.warn("Nature audio autoplay failed:", e));
    } else {
      natureVideo.style.display = "none";
      natureAudio.pause();
    }
   
    speedSlider.style.display = currentTheme.name === "nature" ? "block" : "none";
    volumeSlider.style.display = currentTheme.name === "nature" ? "block" : "none";
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
  const arrowButton = document.querySelector(".logistics-shipper");

  if (!gridContainer) console.warn("grid-container not found");
  if (!mediaControlBar) console.warn("media-controls not found");
  if (!arrowButton) console.warn("logistics-shipper button not found");

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

document.addEventListener('click', (event) => {
  if (event.target.closest('.logistics-shipper')) {
    const gridContainer = document.querySelector(".grid-container");
    const mediaControlBar = document.querySelector(".media-controls");
    const shipper = document.querySelector(".logistics-shipper");

    if (!gridContainer || !mediaControlBar || !shipper) return;

    gridContainer.classList.toggle("shipped");
    mediaControlBar.classList.toggle("visible");
    shipper.classList.toggle("visible");
  }
});

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
