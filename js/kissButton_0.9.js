import { Draggable } from "./draggable.js";

const kissButton = document.querySelector(".kiss-button");
const messages = [
  "i love you!",
  "я тебя люблю!",
  "☀️ solnyshko ☀️",
  "Horse Balls!",
  "красивый!",
];

if (kissButton) {
  const kissDraggable = new Draggable(kissButton, true); // Mark as a kiss button

  kissButton.addEventListener("click", (e) => {
    if (!kissDraggable.isFree) {
      // Increment clicks until it breaks free
      kissDraggable.clickCount++;
      if (kissDraggable.clickCount >= 10) {
        kissDraggable.isFree = true;
      }
    } else {
      // Once free, move in opposite direction
      kissDraggable.handleKissButtonClick(e);
    }

    // Floating love message animation
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
  });
}
