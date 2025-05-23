import { Bounceable } from './bounceable.js';

document.dispatchEvent(new Event("themeChange"));

const kissButton = document.querySelector(".kiss-button");
const messages = [
  "i love you!",
  "я тебя люблю!",
  "☀️ solnyshko ☀️",
  "Horse Balls!",
  "красивая!",
];

if (kissButton) {
  new Bounceable(kissButton); // Initialize Bounceable (click tracking is handled there)

  kissButton.addEventListener("click", (e) => {
    // Show a love message on every click
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

  // Ensure the button follows the correct behavior based on theme changes
  document.addEventListener("themeChange", () => {
    const currentTheme = document.body.classList.contains("theme-space") ? "space" : document.body.classList.contains("theme-retro") ? "retro" : "normal";
    switch (currentTheme) {
      case "retro":
        Bounceable.switchMode(Bounceable.modes.RETRO);
        break;
      case "space":
        Bounceable.switchMode(Bounceable.modes.ZERO_GRAVITY);
        break;
      default:
        Bounceable.switchMode(Bounceable.modes.NORMAL);
    }
  });
}
