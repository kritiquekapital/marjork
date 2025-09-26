(function () {
  const THEME_CLASS = "theme-lofi";
  const lofiStreams = [
    "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=0&mute=1&vq=hd1080",
    "https://www.youtube.com/embed/Zq9-4INDsvY?autoplay=1&controls=0&mute=1&vq=hd1080"
  ];
  let currentIndex = 0;

  // ---- create background iframe ----
  const iframe = document.createElement("iframe");
  Object.assign(iframe, {
    src: lofiStreams[currentIndex],
    className: "lofi-background-stream",
    allow: "autoplay; encrypted-media",
    frameborder: "0",
    style: `
      position:fixed;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:-1;opacity:1;display:block;
      transition: opacity 0.5s ease-in-out;
    `
  });
  document.body.prepend(iframe);

  // ---- helpers to show / hide UI ----
  let fadeTimer;
  const uiEvents = ["mousemove","keydown","click","touchstart"];

  function setUIVisible(show) {
    const grid  = document.querySelector(".grid-container");
    const media = document.querySelector(".media-controls");
    if (!grid || !media) return;

    grid.style.opacity  = show ? "1" : "0";
    grid.style.pointerEvents = show ? "auto" : "none";
    grid.style.transition = "opacity 0.5s ease-in-out";

    media.style.opacity  = show ? "1" : "0";
    media.style.transform = show ? "translateY(0)" : "translateY(100%)";
    media.style.transition = "opacity 0.5s ease-in-out, transform 0.5s ease-in-out";
  }

  function resetTimer() {
    clearTimeout(fadeTimer);
    setUIVisible(true);
    fadeTimer = setTimeout(() => setUIVisible(false), 7000);
  }

  function startFadeLogic() {
    resetTimer();
    uiEvents.forEach(ev => document.addEventListener(ev, resetTimer, { passive: true }));
  }

  function stopFadeLogic() {
    clearTimeout(fadeTimer);
    uiEvents.forEach(ev => document.removeEventListener(ev, resetTimer));
    setUIVisible(true);
  }

  // ---- cycle streams with “N” key ----
  function handleCycleKey(e) {
    if (e.key && e.key.toLowerCase() === "n" &&
        document.body.classList.contains(THEME_CLASS)) {
      currentIndex = (currentIndex + 1) % lofiStreams.length;
      iframe.src = lofiStreams[currentIndex];
    }
  }

  // ---- watch for theme changes ----
  const observer = new MutationObserver(() => {
    const active = document.body.classList.contains(THEME_CLASS);
    iframe.style.display = active ? "block" : "none";

    if (active) {
      startFadeLogic();
      document.addEventListener("keydown", handleCycleKey);
    } else {
      stopFadeLogic();
      document.removeEventListener("keydown", handleCycleKey);
    }
  });

  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
})();
