import { Bounceable } from './bounceable.js';
import { Draggable } from './draggable.js';
import { initLogisticsTheme } from './logistics.js';
import { track } from './analytics.js';

document.addEventListener('DOMContentLoaded', () => {
  const draggableElement = document.getElementById('musicPlayer');
  if (!draggableElement) throw new Error("Element with ID 'musicPlayer' not found");

  const draggable = new Draggable(draggableElement);

  const allThemes = [
    { name: "retro", displayName: "🕹️" },
    { name: "lofi", displayName: "🎧" },
    { name: "art", displayName: "🎨" },
    { name: "space", displayName: "🚀" },
    { name: "rain", displayName: "🌧️" },
    { name: "glitch", displayName: "🥴" },
    { name: "modern", displayName: "🌚" },
    { name: "nature", displayName: "🌞" },
    { name: "classic", displayName: "😎" },
    { name: "logistics", displayName: "📦" }
  ];

  const isPhone = window.innerWidth <= 480;
  const isTablet = window.innerWidth > 480 && window.innerWidth <= 1024;

  const savedThemeIndex = parseInt(localStorage.getItem("currentThemeIndex"), 10) || 0;
  const savedThemeName = allThemes[savedThemeIndex]?.name || allThemes[0].name;

  function getDisabledThemes() {
    try {
      const parsed = JSON.parse(localStorage.getItem("disabledThemes") || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function getBaseThemes() {
    if (isPhone) {
      return allThemes.filter(t => ["retro", "art", "space", "rain", "glitch"].includes(t.name) || t.name === savedThemeName);
    }

    if (isTablet) {
      return allThemes.filter(t => ["retro", "art", "space", "rain", "glitch", "modern", "classic"].includes(t.name));
    }

    return allThemes;
  }

  function buildEnabledThemes() {
    const disabledThemes = getDisabledThemes();
    const baseThemes = getBaseThemes();

    let enabledThemes = baseThemes.filter(t => !disabledThemes.includes(t.name));

    if (!enabledThemes.length) {
      enabledThemes = baseThemes.slice();
    }

    return enabledThemes;
  }

  let themes = buildEnabledThemes();

  let currentThemeIndex = themes.findIndex(t => t.name === savedThemeName);
  if (currentThemeIndex === -1) currentThemeIndex = 0;

  function rebuildThemes(keepThemeName = null) {
    const previousThemeName = keepThemeName || themes[currentThemeIndex]?.name || savedThemeName;
    themes = buildEnabledThemes();

    let nextIndex = themes.findIndex(t => t.name === previousThemeName);
    if (nextIndex === -1) nextIndex = 0;

    currentThemeIndex = nextIndex;
  }

  let cleanupLogistics = () => {};
  let paintSplatterListenerAdded = false;
  
  const savedSiteWideVolume = parseFloat(localStorage.getItem("siteWideVolume"));
  const initialSiteWideVolume = Number.isFinite(savedSiteWideVolume) ? savedSiteWideVolume : 0.40;

  const natureAudio = document.createElement("audio");
    natureAudio.src = "https://github.com/kritiquekapital/marjork/releases/download/duck/book_mill_flow.mp3";
    natureAudio.loop = true;
    natureAudio.volume = initialSiteWideVolume;

  const createBackground = (url, className) => {
    const iframe = document.createElement("iframe");
    iframe.classList.add(className);
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allow", "autoplay; encrypted-media");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("src", url);
    return iframe;
  };

  const SPACE_VIDEO_SRC =
    "https://pub-8650efffd80b4f968cb70c0cee274715.r2.dev/Space_by_Colin_Jones.mp4";

  const spaceBackground = document.createElement("video");
  spaceBackground.classList.add("space-background-video");
  spaceBackground.src = SPACE_VIDEO_SRC;
  spaceBackground.autoplay = true;
  spaceBackground.loop = true;
  spaceBackground.muted = true;
  spaceBackground.playsInline = true;
  spaceBackground.preload = "auto";
  spaceBackground.style.display = "none";
  spaceBackground.style.position = "fixed";
  spaceBackground.style.top = "0";
  spaceBackground.style.left = "0";
  spaceBackground.style.width = "100%";
  spaceBackground.style.height = "100%";
  spaceBackground.style.objectFit = "cover";
  spaceBackground.style.pointerEvents = "none";
  spaceBackground.style.zIndex = "-1";

  function applySpaceVideoOrientation() {
    const phoneNow = window.innerWidth <= 480;
    const portraitNow = window.matchMedia("(orientation: portrait)").matches;

    if (phoneNow && portraitNow) {
      spaceBackground.style.top = "50%";
      spaceBackground.style.left = "50%";
      spaceBackground.style.width = "100vh";
      spaceBackground.style.height = "100vw";
      spaceBackground.style.transform = "translate(-50%, -50%) rotate(90deg)";
      spaceBackground.style.transformOrigin = "center center";
      spaceBackground.style.objectFit = "cover";
    } else {
      spaceBackground.style.top = "0";
      spaceBackground.style.left = "0";
      spaceBackground.style.width = "100%";
      spaceBackground.style.height = "100%";
      spaceBackground.style.transform = "none";
      spaceBackground.style.transformOrigin = "center center";
      spaceBackground.style.objectFit = "cover";
    }
  }

  const RAIN_VIDEO_SRC =
  "https://pub-8650efffd80b4f968cb70c0cee274715.r2.dev/Rain_by_Alex_BM.mp4";

  const RAIN_AUDIO_SRC =
  "temp";

  const rainVideo = document.createElement("video");
  rainVideo.classList.add("rain-background-video");
  rainVideo.src = RAIN_VIDEO_SRC;
  rainVideo.autoplay = true;
  rainVideo.loop = true;
  rainVideo.muted = true;
  rainVideo.playsInline = true;
  rainVideo.preload = "auto";
  rainVideo.style.display = "none";
  rainVideo.style.position = "fixed";
  rainVideo.style.top = "50%";
  rainVideo.style.left = "50%";
  rainVideo.style.width = "100vw";
  rainVideo.style.height = "100dvh";
  rainVideo.style.transform = "translate(-50%, -50%)";
  rainVideo.style.objectFit = "cover";
  rainVideo.style.objectPosition = "center center";
  rainVideo.style.pointerEvents = "none";
  rainVideo.style.zIndex = "-1";
  rainVideo.style.transition = "opacity 0.25s ease-in-out";

  const rainAudio = document.createElement("audio");
  rainAudio.src = RAIN_AUDIO_SRC;
  rainAudio.loop = true;
  rainAudio.volume = initialSiteWideVolume;

  const GLITCH_GIF_SRC =
    "https://pub-8650efffd80b4f968cb70c0cee274715.r2.dev/SIG.DECAY_01.gif";

  const glitchBackground = document.createElement("div");
  glitchBackground.classList.add("glitch-background-gif");
  glitchBackground.style.display = "none";
  glitchBackground.style.position = "fixed";
  glitchBackground.style.top = "50%";
  glitchBackground.style.left = "50%";
  glitchBackground.style.width = "100vw";
  glitchBackground.style.height = "100dvh";
  glitchBackground.style.transform = "translate(-50%, -50%)";
  glitchBackground.style.backgroundImage = `url("${GLITCH_GIF_SRC}")`;
  glitchBackground.style.backgroundSize = "cover";
  glitchBackground.style.backgroundPosition = "center center";
  glitchBackground.style.backgroundRepeat = "no-repeat";
  glitchBackground.style.pointerEvents = "none";
  glitchBackground.style.zIndex = "-1";
  glitchBackground.style.transition = "opacity 0.25s ease-in-out";

  const LOFI_MUTED_SRC =
    "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&controls=0&loop=1&playlist=jfKfPfyJRdk&vq=hd1080";

  const LOFI_AUDIO_SRC =
    "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=0&loop=1&playlist=jfKfPfyJRdk&vq=hd1080";

  const lofiBackground = createBackground(
    LOFI_AUDIO_SRC,
    "lofi-background-stream"
  );
  lofiBackground.style.display = "none";
  document.body.prepend(lofiBackground);

  function setLofiMode(withAudio) {
    const targetSrc = withAudio ? LOFI_AUDIO_SRC : LOFI_MUTED_SRC;
    if (lofiBackground.getAttribute("src") !== targetSrc) {
      lofiBackground.setAttribute("src", targetSrc);
    }
  }

  const natureVideo = document.createElement("video");
  natureVideo.classList.add("nature-background-video");
  natureVideo.src = "https://github.com/kritiquekapital/marjork/releases/download/duck/book_mill_lapse_x07.mp4";
  natureVideo.autoplay = true;
  natureVideo.loop = true;
  natureVideo.muted = true;
  natureVideo.playsInline = true;
  natureVideo.style.display = "none";

  const volumeSlider = document.createElement("input");
  volumeSlider.type = "range";
  volumeSlider.min = "0";
  volumeSlider.max = "1";
  volumeSlider.step = "0.01";
  volumeSlider.value = String(initialSiteWideVolume);
  volumeSlider.classList.add("nature-volume-slider");
  volumeSlider.style.display = "none";
  volumeSlider.addEventListener("input", () => {
    natureAudio.volume = parseFloat(volumeSlider.value);
  });

  document.addEventListener("siteVolumeChange", (event) => {
    const volume = event.detail?.volume;
    if (!Number.isFinite(volume)) return;
    natureAudio.volume = volume;
    volumeSlider.value = String(volume);
  });

  const speedSlider = document.createElement("input");
  speedSlider.type = "range";
  speedSlider.min = "0.25";
  speedSlider.max = "2.0";
  speedSlider.step = "0.05";
  speedSlider.value = "1.0";
  speedSlider.classList.add("nature-speed-slider");
  speedSlider.style.display = "none";
  speedSlider.addEventListener("input", () => {
    natureVideo.playbackRate = parseFloat(speedSlider.value);
  });

  document.body.appendChild(volumeSlider);
  document.body.appendChild(speedSlider);
  document.body.prepend(spaceBackground);
  applySpaceVideoOrientation();
  window.addEventListener("resize", applySpaceVideoOrientation);
  window.addEventListener("orientationchange", applySpaceVideoOrientation);
  document.body.prepend(natureVideo);
  document.body.appendChild(natureAudio);
  document.body.prepend(rainVideo);
  document.body.prepend(glitchBackground);
  document.body.appendChild(rainAudio);

  const themeButton = document.getElementById("themeButton");

  function getThemeHref(themeName) {
    return `css/themes/theme-${themeName}.css`;
  }

  function updateSubstackFlower() {
    const flower = document.querySelector(".substack-flower");
    if (!flower) return;

    if (document.body.classList.contains("theme-retro")) {
      flower.src = "https://raw.githubusercontent.com/kritiquekapital/marjork/main/css/pic/Psych-Flower%20%2301.png";
    } else if (document.body.classList.contains("theme-space")) {
      flower.src = "https://raw.githubusercontent.com/kritiquekapital/marjork/main/css/pic/YOUR_SPACE_FLOWER.png";
    } else if (document.body.classList.contains("theme-rain")) {
      flower.src = "https://raw.githubusercontent.com/kritiquekapital/marjork/main/css/pic/YOUR_RAIN_FLOWER.png";
    } else {
      flower.src = "https://raw.githubusercontent.com/kritiquekapital/marjork/main/css/pic/Psych-Flower%20%2304.png";
    }
  }

  function getOrCreateThemeLink() {
    let themeLink = document.querySelector('link[data-theme="true"]');

    if (!themeLink) {
      themeLink = document.createElement('link');
      themeLink.rel = 'stylesheet';
      themeLink.dataset.theme = 'true';

      const responsiveLink = document.querySelector('link[href="css/responsive.css"]');
      if (responsiveLink) {
        document.head.insertBefore(themeLink, responsiveLink);
      } else {
        document.head.appendChild(themeLink);
      }
    }

    return themeLink;
  }

  function preloadThemes() {
    if (!themes.length) return;

    const activeTheme = themes[currentThemeIndex];
    const activeHref = activeTheme ? getThemeHref(activeTheme.name) : null;

    themes.forEach(theme => {
      const href = getThemeHref(theme.name);
      if (href === activeHref) return;

      const alreadyExists = document.head.querySelector(
        `link[rel="preload"][as="style"][href="${href}"]`
      );

      if (!alreadyExists) {
        const themeLink = document.createElement("link");
        themeLink.rel = "preload";
        themeLink.href = href;
        themeLink.as = "style";
        document.head.appendChild(themeLink);
      }
    });
  }

  function setThemeByName(themeName) {
    const nextIndex = themes.findIndex(t => t.name === themeName);
    if (nextIndex === -1) return;

    currentThemeIndex = nextIndex;
    localStorage.setItem(
      "currentThemeIndex",
      allThemes.findIndex(t => t.name === themeName)
    );
    applyTheme();
  }

  document.addEventListener("setTheme", (event) => {
    const themeName = event.detail?.themeName;
    if (!themeName) return;
    setThemeByName(themeName);
  });

  document.addEventListener("themeRotationSettingsChanged", () => {
    const previousThemeName = themes[currentThemeIndex]?.name || savedThemeName;

    rebuildThemes(previousThemeName);

    const nextThemeName = themes[currentThemeIndex]?.name;

    if (nextThemeName !== previousThemeName) {
      applyTheme();
    } else {
      if (themeButton) {
        const currentTheme = themes[currentThemeIndex];
        if (currentTheme) themeButton.textContent = currentTheme.displayName;
      }

      localStorage.setItem(
        "currentThemeIndex",
        allThemes.findIndex(t => t.name === previousThemeName)
      );

      document.dispatchEvent(new Event("themeChange"));
    }

    preloadThemes();
  });

  function applyTheme() {
    if (!themes.length) {
      rebuildThemes(savedThemeName);
      if (!themes.length) return;
    }

    cleanupLogistics();

    const currentTheme = themes[currentThemeIndex];
    const nextHref = getThemeHref(currentTheme.name);
    const themeLink = getOrCreateThemeLink();

    if (themeLink.getAttribute('href') !== nextHref) {
      themeLink.setAttribute('href', nextHref);
    }

  document.body.classList.remove(
    'theme-classic',
    'theme-modern',
    'theme-retro',
    'theme-nature',
    'theme-space',
    'theme-rain',
    'theme-glitch',
    'theme-art',
    'theme-logistics',
    'theme-lofi'
  );
    document.body.classList.add(`theme-${currentTheme.name}`);

    track("theme_change", {
      theme: currentTheme.name
    });

    if (themeButton) themeButton.textContent = currentTheme.displayName;

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

    if (currentTheme.name === "rain") {
      rainVideo.style.display = "block";
      rainVideo.play().catch(() => {});
      rainAudio.play().catch(e => console.warn("Rain audio autoplay failed:", e));
    } else {
      rainVideo.style.display = "none";
      rainVideo.pause();
      rainAudio.pause();
    }

    if (currentTheme.name === "glitch") {
      glitchBackground.style.display = "block";
      glitchBackground.style.opacity = "1";
    } else {
      glitchBackground.style.opacity = "0";
      glitchBackground.style.display = "none";
    }

    if (currentTheme.name === "space") {
      applySpaceVideoOrientation();
      spaceBackground.style.display = "block";
      spaceBackground.play().catch(() => {});
    } else {
      spaceBackground.pause();
      spaceBackground.style.display = "none";
    }

    if (currentTheme.name === "lofi") {
      setLofiMode(true);
      lofiBackground.style.display = "block";
    } else {
      setLofiMode(false);
      lofiBackground.style.display = "none";
    }

    const logisticsPlayer = document.getElementById('logistics-player');
    if (currentTheme.name === "logistics") {
      if (logisticsPlayer) logisticsPlayer.style.display = "block";
      cleanupLogistics = initLogisticsTheme() || (() => {});
    } else {
      if (logisticsPlayer) logisticsPlayer.style.display = "none";
      cleanupLogistics = () => {};
    }

    draggable.setZeroGravityMode(currentTheme.name === "space");

    localStorage.setItem(
      "currentThemeIndex",
      allThemes.findIndex(t => t.name === currentTheme.name)
    );
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

    if (
      document.body.classList.contains("theme-space") ||
      document.body.classList.contains("theme-logistics")
    ) {
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

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      if (!themes.length) return;

      themeButton.style.animation = "spin 0.5s ease-in-out";
      setTimeout(() => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        localStorage.setItem(
          "currentThemeIndex",
          allThemes.findIndex(t => t.name === themes[currentThemeIndex].name)
        );
        applyTheme();
        preloadThemes();
        themeButton.style.animation = "";
      }, 500);
    });
  }

  resetInactivityTimer();
  applyTheme();
  preloadThemes();
});
