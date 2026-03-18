const spotifyButton = document.querySelector(".spotify");

if (spotifyButton) {
  let isFree = false;
  let hoverTimer = null;
  let animationFrame = null;
  let lastFrameTime = 0;
  let lastMouseTime = performance.now();

  const velocity = { x: 0, y: 0 };

  const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    prevX: window.innerWidth / 2,
    prevY: window.innerHeight / 2,
    vx: 0,
    vy: 0,
    speed: 0,
    hasMoved: false
  };

  const friction = 0.992;
  const bounce = 0.94;
  const hoverBreakDelay = 5000;
  const retroFrameInterval = 1000 / 15;

  const TRIGGER_PADDING = 150;
  const HARD_PADDING = 36;
  const ESCAPE_FORCE = 4.5;
  const HARD_ESCAPE_FORCE = 13.5;
  const CURSOR_LEAD = 10;
  const MIN_ESCAPE_SPEED = 13;
  const MAX_SPEED = 36;

  function getMode() {
    if (document.body.classList.contains("theme-space")) return "zero-gravity";
    if (document.body.classList.contains("theme-retro")) return "retro";
    return "normal";
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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

  function updateMouse(clientX, clientY) {
    const now = performance.now();
    const dt = Math.max((now - lastMouseTime) / 16.6667, 0.001);

    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = clientX;
    mouse.y = clientY;
    mouse.vx = (mouse.x - mouse.prevX) / dt;
    mouse.vy = (mouse.y - mouse.prevY) / dt;
    mouse.speed = Math.hypot(mouse.vx, mouse.vy);
    mouse.hasMoved = true;

    lastMouseTime = now;
  }

  function setSpeedFloor(minSpeed) {
    const speed = Math.hypot(velocity.x, velocity.y);
    if (speed >= minSpeed) return;

    const center = getCenter();
    let dx = center.x - (mouse.x + mouse.vx * CURSOR_LEAD);
    let dy = center.y - (mouse.y + mouse.vy * CURSOR_LEAD);
    let dist = Math.hypot(dx, dy);

    if (dist < 0.001) {
      const angle = Math.random() * Math.PI * 2;
      dx = Math.cos(angle);
      dy = Math.sin(angle);
      dist = 1;
    }

    velocity.x = (dx / dist) * minSpeed;
    velocity.y = (dy / dist) * minSpeed;
  }

  function capSpeed(maxSpeed) {
    const speed = Math.hypot(velocity.x, velocity.y);
    if (speed <= maxSpeed) return;

    const scale = maxSpeed / speed;
    velocity.x *= scale;
    velocity.y *= scale;
  }

  function startHoverBreakTimer() {
    if (isFree || hoverTimer) return;
    hoverTimer = setTimeout(() => freeSpotify(), hoverBreakDelay);
  }

  function clearHoverBreakTimer() {
    if (!hoverTimer) return;
    clearTimeout(hoverTimer);
    hoverTimer = null;
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

    velocity.x = (dx / dist) * 24;
    velocity.y = (dy / dist) * 24;
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

    const cx = event?.clientX ?? mouse.x ?? (rect.left + rect.width / 2);
    const cy = event?.clientY ?? mouse.y ?? (rect.top + rect.height / 2);

    applyInitialImpulseFromCursor(cx, cy);
    startAnimation();
  }

  function applyCursorEscapePhysics() {
    if (!isFree || !mouse.hasMoved) return;

    const center = getCenter();

    const threatX = mouse.x + mouse.vx * CURSOR_LEAD;
    const threatY = mouse.y + mouse.vy * CURSOR_LEAD;

    let dx = center.x - threatX;
    let dy = center.y - threatY;
    let distance = Math.hypot(dx, dy) || 0.0001;

    const triggerRadius = center.radius + TRIGGER_PADDING;
    const hardRadius = center.radius + HARD_PADDING;

    if (distance > triggerRadius) return;

    const nx = dx / distance;
    const ny = dy / distance;

    const intensity = 1 - clamp(distance / triggerRadius, 0, 1);
    const movingToward =
      ((mouse.vx * (center.x - mouse.x)) + (mouse.vy * (center.y - mouse.y))) > 0;

    velocity.x += nx * (ESCAPE_FORCE + intensity * 10);
    velocity.y += ny * (ESCAPE_FORCE + intensity * 10);

    velocity.x += mouse.vx * 0.15;
    velocity.y += mouse.vy * 0.15;

    if (movingToward) {
      velocity.x += nx * 4.8;
      velocity.y += ny * 4.8;
    }

    if (distance < hardRadius) {
      velocity.x += nx * HARD_ESCAPE_FORCE;
      velocity.y += ny * HARD_ESCAPE_FORCE;
      setSpeedFloor(MIN_ESCAPE_SPEED + 7);
    } else {
      setSpeedFloor(MIN_ESCAPE_SPEED);
    }

    capSpeed(MAX_SPEED);
  }

  function step(time) {
    const mode = getMode();

    if (mode === "retro") {
      if (time - lastFrameTime < retroFrameInterval) return;
      lastFrameTime = time;
    }

    applyCursorEscapePhysics();

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
      velocity.x = Math.abs(velocity.x) * bounce;
    } else if (left >= maxX) {
      left = maxX;
      velocity.x = -Math.abs(velocity.x) * bounce;
    }

    if (top <= 0) {
      top = 0;
      velocity.y = Math.abs(velocity.y) * bounce;
    } else if (top >= maxY) {
      top = maxY;
      velocity.y = -Math.abs(velocity.y) * bounce;
    }

    spotifyButton.style.left = `${left}px`;
    spotifyButton.style.top = `${top}px`;
  }

  function animate(time) {
    step(time);
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

  spotifyButton.addEventListener("mouseenter", (event) => {
    updateMouse(event.clientX, event.clientY);
    startHoverBreakTimer();
  });

  spotifyButton.addEventListener("mousemove", (event) => {
    updateMouse(event.clientX, event.clientY);
    if (isFree) startAnimation();
  });

  spotifyButton.addEventListener("mouseleave", clearHoverBreakTimer);

  document.addEventListener("mousemove", (event) => {
    updateMouse(event.clientX, event.clientY);
    if (isFree) startAnimation();
  });

  spotifyButton.addEventListener("click", (event) => {
    updateMouse(event.clientX, event.clientY);

    if (!isFree) {
      freeSpotify(event);
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener("resize", keepInsideViewport);

  document.addEventListener("themeChange", () => {
    if (isFree) startAnimation();
  });
}
