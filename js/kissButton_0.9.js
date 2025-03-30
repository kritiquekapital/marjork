import { Bounceable } from './bounceable.js';

const kissButton = document.querySelector(".kiss-button");
const messages = [
  "i love you!",
  "я тебя люблю!",
  "☀️ solnyshko ☀️",
  "Horse Balls!",
  "красивый!",
];

if (kissButton) {
  const kissBounceable = new Bounceable(kissButton); // Handle bounce physics independently

  let clickCount = 0;
  let isFree = false;

  kissButton.addEventListener("click", (e) => {
    if (!isFree) {
      // Increment clicks until it breaks free
      clickCount++;
      if (clickCount >= 10) {
        isFree = true;
      }
    } else {
      // Once free, move in opposite direction and apply bounce physics
      kissBounceable.moveOppositeDirection(e.clientX, e.clientY);
    }

    // Floating love message animation
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const loveMessage = document.createElement("div");

    loveMessage.textContent = randomMessage;
    loveMessage.style.position = "absolute";
    loveMessage.style.color = "#FF1493";
    loveMessage.style.fontSize = "1
