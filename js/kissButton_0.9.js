import { Draggable } from './Draggable';

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
let isFree = false;  // Flag to track if the button has broken free

// Function to handle click event on the kiss button
if (kissButton) {
  kissButton.addEventListener("click", (e) => {
    // Always show the love message
    showLoveMessage();

    // If the kiss button is free, apply physics movement
    if (isFree) {
      handleFreeButtonMovement(e);
    } else {
      clickCount++;

      // Check if the max click threshold has been reached
      if (clickCount >= maxClicks) {
        breakFreeFromPosition();
      }
    }
  });
}

// Function to show love messages on click
function showLoveMessage() {
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

  // Position the love message relative to the kiss button
  kissButton.appendChild(loveMessage);

  setTimeout(() => {
    const randomX = Math.random() * 200 - 100;
    const randomY = Math.random() * 200 - 100;
    loveMessage.style.transform = `translate(calc(-50% + ${randomX}px), calc(-50% + ${randomY}px))`;
    loveMessage.style.opacity = "0";
  }, 100);

  setTimeout(() => {
    kissButton.removeChild(loveMessage);
  }, 1600);
}

// Function to "break free" from the kiss button's initial position
function breakFreeFromPosition() {
  isFree = true;
  kissButton.style.cursor = 'pointer';  // Change cursor style to indicate interaction

  // Give it an initial direction based on where it was clicked
  const rect = kissButton.getBoundingClientRect();
  const clickX = event.clientX;
  const clickY = event.clientY;

  const directionX = (clickX - rect.left) / rect.width;
  const directionY = (clickY - rect.top) / rect.height;

  const velocityX = directionX * 10;  // Customize the speed here
  const velocityY = directionY * 10;

  // Start applying physics and release the button
  startPhysics(velocityX, velocityY);
}

// Function to handle the kiss button's movement after breaking free (physics)
function startPhysics(initialVelocityX, initialVelocityY) {
  let velocity = { x: initialVelocityX, y: initialVelocityY };
  let position = { x: kissButton.offsetLeft, y: kissButton.offsetTop };
  let friction = 0.98;

  // Function to update position and apply physics
  function updatePhysics() {
    if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1) {
      return;  // Stop the movement if velocity is small enough
    }

    // Apply friction
    velocity.x *= friction;
    velocity.y *= friction;

    position.x += velocity.x;
    position.y += velocity.y;

    // Update the button's position
    kissButton.style.left = `${position.x}px`;
    kissButton.style.top = `${position.y}px`;

    // Request the next animation frame
    requestAnimationFrame(updatePhysics);
  }

  // Start the physics update loop
  requestAnimationFrame(updatePhysics);
}

// Function to handle the kiss button's movement before it breaks free
function handleFreeButtonMovement(e) {
  const rect = kissButton.getBoundingClientRect();
  const clickX = e.clientX;
  const clickY = e.clientY;

  const directionX = (clickX - rect.left) / rect.width;
  const directionY = (clickY - rect.top) / rect.height;

  const velocityX = directionX * 15;  // Customize speed here
  const velocityY = directionY * 15;

  startPhysics(velocityX, velocityY);  // Call physics function after break free
}
