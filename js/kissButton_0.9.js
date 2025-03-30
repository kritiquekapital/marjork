const kissButton = document.querySelector(".kiss-button");
const messages = [
  "i love you!",
  "я тебя люблю!",
  "☀️ solnyshko ☀️",
  "Horse Balls!",
  "красивый!",
];

let clickCount = 0;
const maxClicks = 30;
let velocity = { x: 0, y: 0 }; // Velocity for movement after the 30th click
let friction = 0.92; // Apply friction
let animationFrame = null; // Store animation frame for physics updates

// Boundaries similar to other draggable elements (calculated dynamically)
const boundaries = {
  minX: 0,
  minY: 0,
  maxX: document.documentElement.clientWidth - 10,
  maxY: document.documentElement.clientHeight - 10,
};

if (kissButton) {
  kissButton.addEventListener("click", (e) => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const loveMessage = document.createElement("div");

    loveMessage.textContent = randomMessage;
    loveMessage.style.position = "absolute";
    loveMessage.style.color = "#FF1493";
    loveMessage.style.fontSize = "1.5rem";
    loveMessage.style.fontWeight = "bold";
    loveMessage.style.top = "50%";
    loveMessage.style.left = "50%";
    loveMessage.style.transform = "translate(-50%, -50%)";
    loveMessage.style.opacity = "1";
    loveMessage.style.transition = "opacity 1.5s ease, transform 1.5s ease";

    setTimeout(() => {
      const randomX = Math.random() * 200 - 100;
      const randomY = Math.random() * 200 - 100;
      loveMessage.style.transform = `translate(calc(-50% + ${randomX}px), calc(-50% + ${randomY}px))`;
      loveMessage.style.opacity = "0";
    }, 100);

    kissButton.appendChild(loveMessage);

    setTimeout(() => {
      kissButton.removeChild(loveMessage);
    }, 1600);

    clickCount++;

    if (clickCount >= maxClicks) {
      // Start physics-based movement after 30 clicks
      moveKissButton(e);
    }
  });
}

function moveKissButton(e) {
  // Get click position relative to the kiss button
  const rect = kissButton.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Calculate direction: Move toward the opposite corner
  const directionX = (rect.width / 2 - clickX) / rect.width;
  const directionY = (rect.height / 2 - clickY) / rect.height;

  // Set velocity based on the direction of the click
  velocity.x = directionX * 10;
  velocity.y = directionY * 10;

  // Start physics-based movement
  applyPhysics();
}

function applyPhysics() {
  // Physics loop to handle the movement
  const animate = () => {
    if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1) {
      cancelAnimationFrame(animationFrame);
      return;
    }

    // Apply friction to the velocity
    velocity.x *= friction;
    velocity.y *= friction;

    // Update position based on velocity
    let newLeft = parseFloat(kissButton.style.left || 0) + velocity.x;
    let newTop = parseFloat(kissButton.style.top || 0) + velocity.y;

    // Apply boundaries
    if (newLeft < boundaries.minX || newLeft > boundaries.maxX) {
      velocity.x *= -1; // Reverse velocity if hitting a boundary
    }
    if (newTop < boundaries.minY || newTop > boundaries.maxY) {
      velocity.y *= -1; // Reverse velocity if hitting a boundary
    }

    // Ensure the button stays within the boundaries
    kissButton.style.left = `${Math.min(boundaries.maxX, Math.max(boundaries.minX, newLeft))}px`;
    kissButton.style.top = `${Math.min(boundaries.maxY, Math.max(boundaries.minY, newTop))}px`;

    animationFrame = requestAnimationFrame(animate);
  };

  // Start the physics loop
  animationFrame = requestAnimationFrame(animate);
}
