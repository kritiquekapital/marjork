import { track } from './analytics.js';

const spotifyButton = document.querySelector(".spotify");

if (spotifyButton) {
  let isFree = false;
  let isScored = false;
  let hoverTimer = null;
  let animationFrame = null;
  let lastFrameTime = 0;
  let lastMouseTime = performance.now();
  let goalResetTimer = null;

  const isCoarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

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

  const friction = 0.996;
  const bounce = 0.94;
  const hoverBreakDelay = 5000;
  const retroFrameInterval = 1000 / 15;
  const TRIGGER_PADDING = 0;
  const HARD_PADDING = 8;
  const MAX_SPEED = 42;

  const origin = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  };

  const goal = document.createElement("div");
  goal.className = "spotify-goal";
  goal.setAttribute("aria-hidden", "true");
  document.body.appendChild(goal);

  function urlLinksDisabled() {
    return localStorage.getItem("disableUrlLinks") === "true";
  }

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

  function getGoalRect() {
    return goal.getBoundingClientRect();
  }

  function getGoalCenter() {
    const rect = getGoalRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      radius: Math.min(rect.width, rect.height) / 2
    };
  }

  function saveOrigin() {
    if (isFree) return;
    const rect = spotifyButton.getBoundingClientRect();
    origin.left = rect.left;
    origin.top = rect.top;
    origin.width = rect.width;
    origin.height = rect.height;
  }

   function styleGoal() {
    goal.style.position = "fixed";
    goal.style.zIndex = "1005";
    goal.style.pointerEvents = "none";
    goal.style.opacity = isFree ? "1" : "0.78";

    goal.style.border = "4px solid rgba(255,255,255,0.96)";
    goal.style.borderBottomWidth = "10px";
    goal.style.borderRadius = "16px 16px 24px 24px";

    goal.style.background = `
      linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 100%),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.24) 0 12px, rgba(255,255,255,0.04) 12px 24px),
      repeating-linear-gradient(180deg, rgba(255,255,255,0.18) 0 12px, rgba(255,255,255,0.03) 12px 24px)
    `;

    goal.style.boxShadow = `
      inset 0 10px 14px rgba(255,255,255,0.18),
      inset 0 -12px 18px rgba(0,0,0,0.18),
      0 14px 28px rgba(0,0,0,0.26),
      0 0 18px rgba(255,255,255,0.16)
    `;

    goal.style.transformOrigin = "center center";

    if (isCoarsePointer) {
      goal.style.width = "156px";
      goal.style.height = "112px";
      goal.style.left = "50%";
      goal.style.right = "auto";
      goal.style.top = "auto";
      goal.style.bottom = "-18px";
      goal.style.transform = "translateX(-50%)";
    } else {
      goal.style.width = "138px";
      goal.style.height = "104px";
      goal.style.left = "-26px";
      goal.style.right = "auto";
      goal.style.top = "50%";
      goal.style.bottom = "auto";
      goal.style.transform = "translateY(-50%) rotate(-90deg)";
    }
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

  function capSpeed(maxSpeed) {
    const speed = Math.hypot(velocity.x, velocity.y);
    if (speed <= maxSpeed) return;

    const scale = maxSpeed / speed;
    velocity.x *= scale;
    velocity.y *= scale;
  }

  function startHoverBreakTimer() {
    if (isFree || hoverTimer || isCoarsePointer) return;
    hoverTimer = setTimeout(() => freeSpotify(), hoverBreakDelay);
  }

  function clearHoverBreakTimer() {
    if (!hoverTimer) return;
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }

  function applyInitialImpulseFromCursor(clientX, clientY, strength = null) {
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

    const speed = strength ?? (isCoarsePointer ? 18 + Math.random() * 8 : 24 + Math.random() * 8);
    velocity.x = nx * speed;
    velocity.y = ny * speed;
  }

  function nudgeFromPointer(clientX, clientY) {
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

    const speed = isCoarsePointer ? 16 : 12;
    velocity.x += nx * speed;
    velocity.y += ny * speed;

    capSpeed(isCoarsePointer ? 26 : MAX_SPEED);
  }

  function freeSpotify(event = null) {
    if (isFree) return;

    isFree = true;
    isScored = false;
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
    styleGoal();
    startAnimation();
  }

  function applyCursorEscapePhysics() {
    if (!isFree || !mouse.hasMoved || isCoarsePointer) return;

    const center = getCenter();

    const dx = center.x - mouse.x;
    const dy = center.y - mouse.y;
    const distance = Math.hypot(dx, dy) || 0.0001;

    const triggerRadius = center.radius + TRIGGER_PADDING;
    const hardRadius = center.radius + HARD_PADDING;

    if (distance > triggerRadius) return;

    const nx = dx / distance;
    const ny = dy / distance;

    const overlap = Math.max(0, triggerRadius - distance);
    const overlapRatio =
      triggerRadius > 0
        ? overlap / Math.max(triggerRadius, 1)
        : 1 - Math.min(distance / Math.max(center.radius, 1), 1);

    const pushFromMouseMotionX = mouse.vx * 0.55;
    const pushFromMouseMotionY = mouse.vy * 0.55;
    const contactForce = 3 + overlapRatio * 10;

    velocity.x += nx * contactForce + pushFromMouseMotionX;
    velocity.y += ny * contactForce + pushFromMouseMotionY;

    if (distance < hardRadius) {
      velocity.x += nx * 10;
      velocity.y += ny * 10;
    }

    capSpeed(MAX_SPEED);
  }

  function showFloatingMessage(text) {
    const message = document.createElement("div");
    message.textContent = text;
    message.style.position = "fixed";
    message.style.left = "50%";
    message.style.top = isCoarsePointer ? "18%" : "14%";
    message.style.transform = "translate(-50%, -50%) scale(1)";
    message.style.color = "#ffffff";
    message.style.fontWeight = "900";
    message.style.fontSize = isCoarsePointer ? "2rem" : "2.4rem";
    message.style.letterSpacing = "0.08em";
    message.style.textShadow = "0 0 10px rgba(0,255,0,0.55), 0 0 20px rgba(255,255,255,0.5)";
    message.style.zIndex = "20000";
    message.style.pointerEvents = "none";
    message.style.opacity = "1";
    message.style.transition = "transform 0.9s ease, opacity 0.9s ease";

    document.body.appendChild(message);

    requestAnimationFrame(() => {
      message.style.transform = "translate(-50%, -80px) scale(1.08)";
      message.style.opacity = "0";
    });

    setTimeout(() => {
      message.remove();
    }, 950);
  }

  function openSpotifyLink() {
    if (urlLinksDisabled()) return;

    const url = spotifyButton.getAttribute("href");
    if (!url) return;

    track("spotify_goal_open", {
      device: isCoarsePointer ? "mobile" : "desktop"
    });

    window.open(url, "_blank", "noopener,noreferrer");
  }

  function resetSpotify() {
    clearTimeout(goalResetTimer);
    isFree = false;
    isScored = false;
    velocity.x = 0;
    velocity.y = 0;

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    spotifyButton.classList.remove("free", "fleeing");
    spotifyButton.style.position = "";
    spotifyButton.style.left = "";
    spotifyButton.style.top = "";
    spotifyButton.style.width = "";
    spotifyButton.style.height = "";
    spotifyButton.style.margin = "";
    spotifyButton.style.zIndex = "";

    styleGoal();
    saveOrigin();
  }

  function handleGoal() {
    if (isScored) return;

    isScored = true;
    velocity.x = 0;
    velocity.y = 0;

    track("spotify_goal_scored", {
      device: isCoarsePointer ? "mobile" : "desktop",
      theme:
        document.body.classList.contains("theme-space")
          ? "space"
          : document.body.classList.contains("theme-retro")
          ? "retro"
          : "normal"
    });

    showFloatingMessage("GOALLLL");

    if (!urlLinksDisabled()) {
      setTimeout(() => {
        openSpotifyLink();
      }, 140);
    }

    goalResetTimer = setTimeout(() => {
      resetSpotify();
    }, 900);
  }

  function checkGoalCollision() {
    if (!isFree || isScored) return;

    const buttonCenter = getCenter();
    const goalCenter = getGoalCenter();

    const dx = goalCenter.x - buttonCenter.x;
    const dy = goalCenter.y - buttonCenter.y;
    const distance = Math.hypot(dx, dy);

    const threshold = isCoarsePointer
      ? goalCenter.radius + buttonCenter.radius * 0.55
      : goalCenter.radius + buttonCenter.radius * 0.42;

    if (distance <= threshold) {
      handleGoal();
    }
  }

  function step(time) {
    if (!isFree || isScored) return;

    const mode = getMode();

    if (mode === "retro") {
      if (time - lastFrameTime < retroFrameInterval) return;
      lastFrameTime = time;
    }

    applyCursorEscapePhysics();

    if (mode !== "zero-gravity") {
      const localFriction = isCoarsePointer ? 0.985 : friction;
      velocity.x *= localFriction;
      velocity.y *= localFriction;
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

    checkGoalCollision();
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
    styleGoal();

    if (!isFree) {
      saveOrigin();
      return;
    }

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

  spotifyButton.addEventListener("pointerdown", (event) => {
    const clientX = event.clientX ?? window.innerWidth / 2;
    const clientY = event.clientY ?? window.innerHeight / 2;

    updateMouse(clientX, clientY);

    if (!isFree) {
      freeSpotify({ clientX, clientY });
    } else if (!isScored) {
      nudgeFromPointer(clientX, clientY);
      startAnimation();
    }

    event.preventDefault();
    event.stopPropagation();
  });

  spotifyButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  window.addEventListener("resize", keepInsideViewport);

  document.addEventListener("themeChange", () => {
    styleGoal();
    if (isFree) startAnimation();
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      saveOrigin();
      styleGoal();
    });
  });
}
