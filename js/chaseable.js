const spotifyButton = document.querySelector(".spotify");

if (spotifyButton) {
  let isFree = false;
  let hoverTimer = null;
  let animationFrame = null;
  let lastFrameTime = 0;

  const velocity = { x: 0, y: 0 };
  const friction = 0.93;
  const bounce = 0.9;
  const hoverBreakDelay = 5000;
  const retroFrameInterval = 1000 / 15;

  function getMode() {
    if (document.body.classList.contains("theme-space")) return "zero-gravity";
    if (document.body.classList.contains("theme-retro")) return "retro";
    return "normal";
  }

  function getRect() {
    return spotifyButton.getBoundingClientRect();
  }

  function getCenter() {
    const rect = getRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      radius: Math.max(rect.width, rect.height) / 2
    };
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function openSpotifyNow() {
    const url = spotifyButton.getAttribute("href");
    if (!url || url === "#") return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function startHoverBreakTimer() {
    if (isFree || hoverTimer) return;
    hoverTimer = setTimeout(() => {
      freeSpotify();
    }, hoverBreakDelay);
  }

  function clearHoverBreakTimer() {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
  }

  function applyInitialImpulseFromCursor(clientX, clientY) {
    const center = getCenter();

    let dx = center.x - clientX;
    let dy = center.y - clientY;
    let dist = Math.hypot(dx, dy);

    if (dist < 0.001) {
      const angle = Math.random() * Math.PI * 2;
      dx = Math.cos(angle);
      dy = Math.sin(angle);
      dist = 1;
    }

    const nx = dx / dist;
    const ny = dy / dist;

    const speed = 20 + Math.random() * 12;
    velocity.x = nx * speed;
    velocity.y = ny * speed;
  }

  function freeSpotify(event = null) {
    if (isFree) return;

    isFree = true;
    clearHoverBreakTimer();

    const rect = spotifyButton.getBoundingClientRect();

    spotifyButton.classList.add("free", "fleeing");
    spotifyButton.style.position = "fixed";
    spotifyButton.style.left = `${rect.left}px`;
    spotifyButton.style.top = `${rect.top}px`;
    spotifyButton.style.width = `${rect.width}px`;
    spotifyButton.style.height = `${rect.height}px`;
    spotifyButton.style.margin = "0";

    const cx = event?.clientX ?? (rect.left + rect.width / 2);
    const cy = event?.clientY ?? (rect.top + rect.height / 2);
    applyInitialImpulseFromCursor(cx, cy);

    startAnimation();
  }

  function repelFromCursor(event) {
    if (!isFree) return;

    const center = getCenter();
    const dx = center.x - event.clientX;
    const dy = center.y - event.clientY;
    const distance = Math.hypot(dx, dy);

    const triggerRadius = center.radius + 40;
    if (distance > triggerRadius) return;

    const nx = dx / (distance || 1);
    const ny = dy / (distance || 1);

    const intensity = clamp((triggerRadius - distance) / triggerRadius, 0, 1);
    const shove = 2 + intensity * 14;

    velocity.x += nx * shove;
    velocity.y += ny * shove;

    spotifyButton.classList.add("fleeing");
    startAnimation();
  }

  function step(time) {
    const mode = getMode();

    if (mode === "retro") {
      if (time - lastFrameTime < retroFrameInterval) return true;
      lastFrameTime = time;
    }

    if (mode !== "zero-gravity") {
      velocity.x *= friction;
      velocity.y *= friction;
    }

    const rect = getRect();
    const width = rect.width;
    const height = rect.height;

    let left = parseFloat(spotifyButton.style.left || "0") + velocity.x;
    let top = parseFloat(spotifyButton.style.top || "0") + velocity.y;

    const maxX = window.innerWidth - width;
    const maxY = window.innerHeight - height;

    if (left <= 0) {
      left = 0;
      velocity.x *= -bounce;
    } else if (left >= maxX) {
      left = maxX;
      velocity.x *= -bounce;
    }

    if (top <= 0) {
      top = 0;
      velocity.y *= -bounce;
    } else if (top >= maxY) {
      top = maxY;
      velocity.y *= -bounce;
    }

    spotifyButton.style.left = `${left}px`;
    spotifyButton.style.top = `${top}px`;

    if (mode !== "zero-gravity") {
      const speed = Math.hypot(velocity.x, velocity.y);
      if (speed < 0.18) {
        velocity.x = 0;
        velocity.y = 0;
        return false;
      }
    }

    return true;
  }

  function animate(time) {
    const keepGoing = step(time);

    if (!keepGoing) {
      animationFrame = null;
      return;
    }

    animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (animationFrame) return;
    animationFrame = requestAnimationFrame(animate);
  }

  function keepInsideViewport() {
    if (!isFree) return;

    const rect = getRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    spotifyButton.style.left = `${clamp(parseFloat(spotifyButton.style.left || "0"), 0, maxX)}px`;
    spotifyButton.style.top = `${clamp(parseFloat(spotifyButton.style.top || "0"), 0, maxY)}px`;
  }

  spotifyButton.addEventListener("mouseenter", startHoverBreakTimer);
  spotifyButton.addEventListener("mouseleave", clearHoverBreakTimer);

  spotifyButton.addEventListener("click", (event) => {
    if (!isFree) {
      openSpotifyNow();
      freeSpotify(event);
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  });

  document.addEventListener("mousemove", repelFromCursor);
  window.addEventListener("resize", keepInsideViewport);

  document.addEventListener("themeChange", () => {
    if (isFree) startAnimation();
  });
}
