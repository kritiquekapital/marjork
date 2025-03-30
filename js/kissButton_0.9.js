import { Draggable } from './Draggable'; // Assuming the Draggable class is in a separate file

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

// Function to handle the click event on the kiss button
if (kissButton) {
  kissButton.addEventListener("click", (e) => {
    showLoveMessage();

    // If the kiss button is free, apply physics movement
    if (isFree) {
      console.log("Button is free, applying physics movement...");
      handleFreeButtonMovement(e);
    } else {
      clickCount++;

      // Check if the max click threshold has been reached
      if (clickCount >= maxClicks) {
        console.log("Max clicks reached, breaking free from position...");
        breakFreeFromPosition();
      }
    }
  });
}

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
}

// Function to handle the button movement after breaking free
function breakFreeFromPosition() {
  isFree = true;
  kissButton.style.cursor = 'pointer'; // Add cursor style for interactivity

  // Apply draggable physics now that it's free
  const draggable = new Draggable(kissButton);

  // Debug: Check the button’s position
  console.log("Button is now draggable. Current position:", kissButton.style.left, kissButton.style.top);
}

// Function to handle movement when the button is free
function handleFreeButtonMovement(e) {
  // Get the dimensions and position of the button
  const rect = kissButton.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;

  // Limit movement to a small range after breaking free
  const maxMovement = 30; // Reduce the distance moved significantly
  const newLeft = Math.min(
    document.documentElement.clientWidth - rect.width - 20,
    Math.max(20, e.clientX - offsetX + (Math.random() * maxMovement - maxMovement / 2))
  );
  const newTop = Math.min(
    document.documentElement.clientHeight - rect.height - 20,
    Math.max(20, e.clientY - offsetY + (Math.random() * maxMovement - maxMovement / 2))
  );

  // Update button position
  kissButton.style.left = `${newLeft}px`;
  kissButton.style.top = `${newTop}px`;

  // Debug: Log the button's new position
  console.log("New position:", newLeft, newTop);
}
