(function () {
  const lofiStreams = [
    "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=0&loop=1",
    "https://www.youtube.com/embed/Zq9-4INDsvY?autoplay=1&controls=0&loop=1"
  ];
  let currentIndex = 0;

  const iframe = document.createElement("iframe");
  Object.assign(iframe, {
    src: lofiStreams[currentIndex],
    className: "lofi-background-stream",
    allow: "autoplay; encrypted-media",
    frameborder: "0",
    style: `position:fixed;top:0;left:0;width:100%;height:100%;
            pointer-events:none;z-index:-1;opacity:0.25;display:none;`
  });
  document.body.prepend(iframe);

  // Show/hide the background when theme changes
  const observer = new MutationObserver(() => {
    const active = document.body.classList.contains(THEME_CLASS);
    iframe.style.display = active ? "block" : "none";
    if (active) startFadeLogic();
    else stopFadeLogic();
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  // Rotate streams with “n” key
  document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "n" && document.body.classList.contains(THEME_CLASS)) {
      currentIndex = (currentIndex + 1) % lofiStreams.length;
      iframe.src = lofiStreams[currentIndex];
    }
  });

  // --- inactivity fade just for lofi ---
  let fadeTimer;
  function startFadeLogic() {
    resetTimer();
    ["mousemove","keydown","click","touchstart"].forEach(ev =>
      document.addEventListener(ev, resetTimer)
    );
  }
  function stopFadeLogic() {
    clearTimeout(fadeTimer);
    ["mousemove","keydown","click","touchstart"].forEach(ev =>
      document.removeEventListener(ev, resetTimer)
    );
    setUIVisible(true);
  }
  function resetTimer() {
    clearTimeout(fadeTimer);
    setUIVisible(true);
    fadeTimer = setTimeout(() => setUIVisible(false), 7000);
  }
  function setUIVisible(show) {
    const grid = document.querySelector(".grid-container");
    const media = document.querySelector(".media-controls");
    if (!grid || !media) return;
    grid.style.opacity = show ? "1" : "0";
    grid.style.pointerEvents = show ? "auto" : "none";
    media.style.opacity = show ? "1" : "0";
    media.style.transform = show ? "translateY(0)" : "translateY(100%)";
  }
})();
