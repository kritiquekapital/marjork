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
  let hasOpenedOnGoal = false;

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

    goal.style.opacity = isFree ? "1" : "0";
    goal.style.transition = "opacity 0.18s ease-out";

    goal.style.border = "5px solid rgba(255,255,255,0.98)";
    goal.style.borderBottomWidth = "14px";
    goal.style.borderRadius = "20px 20px 28px 28px";

    goal.style.background = `
      linear-gradient(180deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.08) 18%, rgba(255,255,255,0.02) 100%),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.24) 0 14px, rgba(255,255,255,0.05) 14px 28px),
      repeating-linear-gradient(180deg, rgba(255,255,255,0.18) 0 14px, rgba(255,255,255,0.04) 14px 28px)
    `;

    goal.style.boxShadow = `
      inset 0 12px 16px rgba(255,255,255,0.22),
      inset 0 -16px 24px rgba(0,0,0,0.20),
      inset 10px 0 14px rgba(255,255,255,0.10),
      inset -12px 0 18px rgba(0,0,0,0.16),
      0 18px 30px rgba(0,0,0,0.32),
      0 0 20px rgba(255,255,255,0.16)
    `;

    goal.style.backdropFilter = "blur(1.5px)";
    goal.style.transformOrigin = "center center";

    if (isCoarsePointer) {
      goal.style.width = "272px";
      goal.style.height = "118px";
      goal.style.left = "50%";
      goal.style.right = "auto";
      goal.style.top = "auto";
      goal.style.bottom = "-30px";
      goal.style.transform = "translateX(-50%)";

      goal.style.borderTopWidth = "14px";
      goal.style.borderBottomWidth = "5px";
      goal.style.borderRadius = "28px 28px 20px 20px";
    } else {
      goal.style.width = "110px";
      goal.style.height = "276px";
      goal.style.left = "-42px";
      goal.style.right = "auto";
      goal.style.top = "50%";
      goal.style.bottom = "auto";
      goal.style.transform = "translateY(-50%)";
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
    goal.style.opacity = "0";

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
    if (urlLinksDisabled()) return false;
    if (hasOpenedOnGoal) return false;

    const url = spotifyButton.getAttribute("href");
    if (!url) return false;

    hasOpenedOnGoal = true;

    track("spotify_goal_open", {
      device: isCoarsePointer ? "mobile" : "desktop"
    });

    if (isCoarsePointer) {
      window.location.href = url;
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }

    return true;
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

    const linksDisabled = urlLinksDisabled();

    if (!linksDisabled) {
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

    const buttonRect = getRect();
    const goalRect = getGoalRect();

    const buttonInset = isCoarsePointer ? 10 : 8;
    const goalInsetX = isCoarsePointer ? 18 : 28;
    const goalInsetY = isCoarsePointer ? 10 : 18;

    const buttonLeft = buttonRect.left + buttonInset;
    const buttonRight = buttonRect.right - buttonInset;
    const buttonTop = buttonRect.top + buttonInset;
    const buttonBottom = buttonRect.bottom - buttonInset;

    const goalLeft = goalRect.left + goalInsetX;
    const goalRight = goalRect.right - goalInsetX;
    const goalTop = goalRect.top + goalInsetY;
    const goalBottom = goalRect.bottom - goalInsetY;

    const overlaps =
      buttonRight >= goalLeft &&
      buttonLeft <= goalRight &&
      buttonBottom >= goalTop &&
      buttonTop <= goalBottom;

    if (overlaps) {
      handleGoal();
    }
  }
    function circleIntersectsRect(circleX, circleY, circleRadius, rect) {
    const closestX = clamp(circleX, rect.left, rect.right);
    const closestY = clamp(circleY, rect.top, rect.bottom);

    const dx = circleX - closestX;
    const dy = circleY - closestY;

    return dx * dx + dy * dy <= circleRadius * circleRadius;
  }

  function resolvePostCollision(postRect, damping = 0.92) {
    const center = getCenter();
    const rect = getRect();

    const closestX = clamp(center.x, postRect.left, postRect.right);
    const closestY = clamp(center.y, postRect.top, postRect.bottom);

    let dx = center.x - closestX;
    let dy = center.y - closestY;
    let dist = Math.hypot(dx, dy);

    if (dist < 0.001) {
      const postCenterX = (postRect.left + postRect.right) / 2;
      const postCenterY = (postRect.top + postRect.bottom) / 2;
      dx = center.x - postCenterX;
      dy = center.y - postCenterY;
      dist = Math.hypot(dx, dy) || 1;
    }

    const nx = dx / dist;
    const ny = dy / dist;
    const overlap = center.radius - dist;

    if (overlap > 0) {
      const push = overlap + 2;

      spotifyButton.style.left = `${parseFloat(spotifyButton.style.left || "0") + nx * push}px`;
      spotifyButton.style.top = `${parseFloat(spotifyButton.style.top || "0") + ny * push}px`;

      const dot = velocity.x * nx + velocity.y * ny;

      if (dot < 0) {
        velocity.x = (velocity.x - 2 * dot * nx) * damping;
        velocity.y = (velocity.y - 2 * dot * ny) * damping;
      } else {
        velocity.x += nx * 2.5;
        velocity.y += ny * 2.5;
      }

      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;

      spotifyButton.style.left = `${clamp(parseFloat(spotifyButton.style.left || "0"), 0, maxX)}px`;
      spotifyButton.style.top = `${clamp(parseFloat(spotifyButton.style.top || "0"), 0, maxY)}px`;

      return true;
    }

    return false;
  }

  function applyGoalPostCollision() {
    if (!isFree || isScored) return;

    const goalRect = getGoalRect();
    const center = getCenter();

    let posts = [];

    if (isCoarsePointer) {
      const postWidth = 18;
      const crossbarHeight = 14;

      posts = [
        {
          left: goalRect.left,
          right: goalRect.left + postWidth,
          top: goalRect.top,
          bottom: goalRect.bottom
        },
        {
          left: goalRect.right - postWidth,
          right: goalRect.right,
          top: goalRect.top,
          bottom: goalRect.bottom
        },
        {
          left: goalRect.left,
          right: goalRect.right,
          top: goalRect.top,
          bottom: goalRect.top + crossbarHeight
        }
      ];
    } else {
      const postWidth = 18;
      const crossbarHeight = 14;

      posts = [
        {
          left: goalRect.left,
          right: goalRect.right,
          top: goalRect.top,
          bottom: goalRect.top + postWidth
        },
        {
          left: goalRect.left,
          right: goalRect.right,
          top: goalRect.bottom - postWidth,
          bottom: goalRect.bottom
        },
        {
          left: goalRect.left,
          right: goalRect.left + crossbarHeight,
          top: goalRect.top,
          bottom: goalRect.bottom
        }
      ];
    }

    for (const post of posts) {
      if (circleIntersectsRect(center.x, center.y, center.radius, post)) {
        resolvePostCollision(post, 0.9);
      }
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
    
    applyGoalPostCollision();
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
