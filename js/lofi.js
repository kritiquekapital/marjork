(function () {
  const lofiStreams = [
    "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=0&loop=1",
    "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=0&loop=1",
    "https://www.youtube.com/embed/DWcJFNfaw9c?autoplay=1&controls=0&loop=1"
  ];
  let currentIndex = 0;

  const THEME_CLASS = "theme-lofi";

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

  // Show/hide when theme toggles
  const observer = new MutationObserver(() => {
    const active = document.body.classList.contains(THEME_CLASS);
    iframe.style.display = active ? "block" : "none";
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  // Rotate streams on “n” key while lofi is active
  document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "n" && document.body.classList.contains(THEME_CLASS)) {
      currentIndex = (currentIndex + 1) % lofiStreams.length;
      iframe.src = lofiStreams[currentIndex];
    }
  });
})();
