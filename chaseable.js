const spotifyButton = document.querySelector(".spotify");

if (spotifyButton) {
  let isFree = false;
  let hoverTimer = null;
  let animationFrame = null;
  let lastFrameTime = 0;

  let velocity = { x: 0, y: 0 };
  let lastMouse = null;

  const friction = 0.92;
  const bounceDamping = 0.92;
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

  function startHoverBreakTimer(event) {
    if (isFree || hoverTimer) return;

    hoverTimer = setTimeout(() => {
      freeSpotify(event);
    }, hoverBreakDelay);
  }

  function clearHoverBreakTimer() {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }

  function freeSpotify(triggerEvent = null) {
    if (isFree) return;

    isFree = true;
    clearHoverBreakTimer();

    const rect = spotifyButton.getBoundingClientRect();

    spotifyButton.classList.add("free");
    spotifyButton.style.position = "fixed";
    spotifyButton.style.left = `${rect.left}px`;
    spotifyButton.style.top = `${rect.top}px`;
    spotifyButton.style.width = `${rect.width}px`;
    spotifyButton.style.height = `${rect.height}px`;

    applyImpulseFromPoint(
      triggerEvent?.clientX ?? rect.left + rect.width / 2,
      triggerEvent?.clientY ?? rect.top + rect.height / 2,
      true
    );

    startAnimation();
  }

  function applyImpulseFromPoint(pointX, pointY, strong = false) {
    const center = getCenter();

    let dx = center.x - pointX;
    let dy = center.y - pointY;
    let distance = Math.hypot(dx, dy);

    if (distance < 0.001) {
      const angle = Math.random() * Math.PI * 2;
      dx = Math.cos(angle);
      dy = Math.sin(angle);
      distance = 1;
    }

    const nx = dx / distance;
    const ny = dy / distance;

    const powerRatio = clamp(distance / center.radius, 0, 1);
    const minSpeed = strong ? 16 : 8;
    const maxSpeed = strong ? 34 : 22;
    const speed = minSpeed + (maxSpeed - minSpeed) * Math.pow(powerRatio, 1.8);

    velocity.x += nx * speed;
    velocity.y += ny * speed;
  }

  function applyMouseCollision(event) {
    if (!isFree) return;

    const rect = getRect();
    const center = getCenter();

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const dx = center.x - mouseX;
    const dy = center.y - mouseY;
    const distance = Math.hypot(dx, dy);

    const hitRadius = center.radius + 10;
    if (distance > hitRadius) {
      lastMouse = { x: mouseX, y: mouseY };
      return;
    }

    const deltaX = lastMouse ? mouseX - lastMouse.x : 0;
    const deltaY = lastMouse ? mouseY - lastMouse.y : 0;
    const mouseSpeed = Math.hypot(deltaX, deltaY);

    let nx = dx / (distance || 1);
    let ny = dy / (distance || 1);

    const shove = clamp(4 + mouseSpeed * 0.85, 4, 26);

    velocity.x += nx * shove + deltaX * 0.35;
    velocity.y += ny * shove + deltaY * 0.35;

    startAnimation();
    lastMouse = { x: mouseX, y: mouseY };
  }

  function stepPosition(time) {
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
      velocity.x *= -bounceDamping;
    } else if (left >= maxX) {
      left = maxX;
      velocity.x *= -bounceDamping;
    }

    if (top <= 0) {
      top = 0;
      velocity.y *= -bounceDamping;
    } else if (top >= maxY) {
      top = maxY;
      velocity.y *= -bounceDamping;
    }

    spotifyButton.style.left = `${left}px`;
    spotifyButton.style.top = `${top}px`;

    if (mode !== "zero-gravity") {
      const speed = Math.hypot(velocity.x, velocity.y);
      if (speed < 0.2) {
        velocity.x = 0;
        velocity.y = 0;
        return false;
      }
    }

    return true;
  }

  function animate(time) {
    const keepGoing = stepPosition(time);

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

  function clampIntoViewport() {
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
      freeSpotify(event);
    }
  });

  document.addEventListener("mousemove", (event) => {
    applyMouseCollision(event);
    lastMouse = { x: event.clientX, y: event.clientY };
  });

  window.addEventListener("resize", clampIntoViewport);
  document.addEventListener("themeChange", () => {
    if (isFree && getMode() === "zero-gravity") {
      startAnimation();
    }
  });
}
