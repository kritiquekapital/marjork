import { Bounceable } from './bounceable.js';
import { Draggable } from './draggable.js';
import { initLogisticsTheme } from './logistics.js';

document.addEventListener('DOMContentLoaded', () => {
  const draggableElement = document.getElementById('musicPlayer');
  if (!draggableElement) throw new Error("Element with ID 'musicPlayer' not found");

  const draggable = new Draggable(draggableElement);

  const allThemes = [
    { name: "retro", displayName: "🕹️" },
    { name: "lofi", displayName: "🎧" },
    { name: "art", displayName: "🎨" },
    { name: "space", displayName: "🚀" },
    { name: "modern", displayName: "🌚" },
    { name: "nature", displayName: "🌞" },
    { name: "classic", displayName: "😎" },
    { name: "logistics", displayName: "📦" }
  ];

  const isPhone = window.innerWidth <= 480;
  const isTablet = window.innerWidth > 480 && window.innerWidth <= 1024;

  const savedThemeIndex = parseInt(localStorage.getItem("currentThemeIndex")) || 0;
  const savedThemeName = allThemes[savedThemeIndex]?.name;

  let themes;
  if (isPhone) {
    themes = allThemes.filter(t => ["retro", "art"].includes(t.name) || t.name === savedThemeName);
  } else if (isTablet) {
    themes = allThemes.filter(t => ["retro", "art", "modern", "classic", "space"].includes(t.name));
  } else {
    themes = allThemes;
  }

  let currentThemeIndex = themes.findIndex(t => t.name === savedThemeName);
  if (currentThemeIndex === -1) currentThemeIndex = 0;

  let cleanupLogistics = () => {};
  let paintSplatterListenerAdded = false;

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
  natureVideo.muted = true;
  natureVideo.playsInline = true;

  const natureAudio = document.createElement("audio");
  natureAudio.src = "https://github.com/kritiquekapital/marjork/releases/download/duck/book_mill_flow.mp3";
  natureAudio.loop = true;
  natureAudio.volume = 0.4;

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

  const themeButton = document.getElementById("themeButton");

  function preloadThemes() {
    const activeHref = `css/themes/theme-${themes[currentThemeIndex].name}.css`;
    themes.forEach(theme => {
      const href = `css/themes/theme-${theme.name}.css`;
      if (href !== activeHref) {
        const themeLink = document.createElement("link");
        themeLink.rel = "preload";
        themeLink.href = href;
        themeLink.as = "style";
        document.head.appendChild(themeLink);
      }
    });
  }

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

    document.body.classList.remove(
      'theme-classic', 'theme-modern', 'theme-retro', 'theme-nature', 'theme-space', 'theme-art', 'theme-logistics'
    );
    document.body.classList.add(`theme-${currentTheme.name}`);
    themeButton.textContent = currentTheme.displayName;

    document.dispatchEvent(new Event("themeChange"));

    if (currentTheme.name === "art") {
      if (!paintSplatterListenerAdded) {
        document.addEventListener("click", handleArtSplatter);
        paintSplatterListenerAdded = true;
      }
    } else {
      document.removeEventListener("click", handleArtSplatter);
      paintSplatterListenerAdded = false;
    }

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
    localStorage.setItem("currentThemeIndex", allThemes.findIndex(t => t.name === currentTheme.name));
  }

  function handleArtSplatter(e) {
    if (!document.body.classList.contains("theme-art")) return;

    const splatter = document.createElement("div");
    splatter.className = "paint-splatter";
    splatter.style.position = "absolute";
    splatter.style.left = `${e.clientX}px`;
    splatter.style.top = `${e.clientY}px`;
    splatter.style.setProperty("--rot", `${Math.floor(Math.random() * 360)}deg`);

    const colors = ["#ff1f57", "#1fd2ff", "#ffe71f", "#41ff1f", "#bc1fff"];
    const numBlobs = Math.floor(Math.random() * 5) + 4;

    for (let i = 0; i < numBlobs; i++) {
      const blob = document.createElement("div");
      blob.className = "blob";

      const size = Math.random() * 60 + 20;
      blob.style.width = `${size}px`;
      blob.style.height = `${size}px`;
      blob.style.background = colors[Math.floor(Math.random() * colors.length)];
      blob.style.left = `${(Math.random() - 0.5) * 100}px`;
      blob.style.top = `${(Math.random() - 0.5) * 100}px`;

      splatter.appendChild(blob);
    }

    document.body.appendChild(splatter);

    setTimeout(() => {
      splatter.style.transition = "opacity 2s ease-out";
      splatter.style.opacity = "0";
      setTimeout(() => splatter.remove(), 2000);
    }, 600);
  }

  let inactivityTimer;
  const gridContainer = document.querySelector(".grid-container");
  const mediaControlBar = document.querySelector(".media-controls");
  const arrowButton = document.querySelector(".logistics-shipper");

  if (!gridContainer) console.warn("grid-container not found");
  if (!mediaControlBar) console.warn("media-controls not found");
  if (!arrowButton) console.warn("logistics-shipper button not found");

  const handleUIState = (shouldHide) => {
    if (!gridContainer || !mediaControlBar) return;

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
      localStorage.setItem("currentThemeIndex", allThemes.findIndex(t => t.name === themes[currentThemeIndex].name));
      applyTheme();
      themeButton.style.animation = "";
    }, 500);
  });

  resetInactivityTimer();
  applyTheme();
  preloadThemes();
});

