import { Bounceable } from './bounceable.js';

const kissButton = document.querySelector(".kiss-button");

const messages = [
  "i love you!",
  "я тебя люблю!",
  "☀️ solnyshko ☀️",
  "Horse Balls!",
  "красивая!",
];

const holeMessages = [
  "Nice!",
  "Молодец!",
  "u made it!",
  "Ну ты даешь!",
];

if (kissButton) {
  new Bounceable(kissButton);

  function applyKissThemeMode() {
    const currentTheme = document.body.classList.contains("theme-space")
      ? "space"
      : document.body.classList.contains("theme-retro")
      ? "retro"
      : "normal";

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
  }

  function showFloatingMessage(text, options = {}) {
    const {
      color = "#FF1493",
      fontSize = "1.5rem",
      fontWeight = "bold",
      zIndex = "5",
      maxOffset = 100,
      duration = 1600
    } = options;

    const message = document.createElement("div");
    message.textContent = text;
    message.style.position = "absolute";
    message.style.color = color;
    message.style.fontSize = fontSize;
    message.style.fontWeight = fontWeight;
    message.style.top = "50%";
    message.style.left = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.opacity = "1";
    message.style.transition = "opacity 1.5s ease, transform 1.5s ease";
    message.style.pointerEvents = "none";
    message.style.zIndex = zIndex;
    message.style.whiteSpace = "nowrap";

    kissButton.appendChild(message);

    setTimeout(() => {
      const randomX = Math.random() * (maxOffset * 2) - maxOffset;
      const randomY = Math.random() * (maxOffset * 2) - maxOffset;
      message.style.transform = `translate(calc(-50% + ${randomX}px), calc(-50% + ${randomY}px))`;
      message.style.opacity = "0";
    }, 100);

    setTimeout(() => {
      if (message.parentNode === kissButton) {
        kissButton.removeChild(message);
      }
    }, duration);
  }

  function showLoveMessage() {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showFloatingMessage(randomMessage, {
      color: "#FF1493",
      fontSize: "1.5rem",
      fontWeight: "bold",
      zIndex: "5",
      maxOffset: 100,
      duration: 1600
    });
  }

  function showSinkMessages(strokeCount) {
    const randomHoleMessage = holeMessages[Math.floor(Math.random() * holeMessages.length)];
    const strokeLabel = `${strokeCount} stroke${strokeCount === 1 ? "" : "s"}`;

    showFloatingMessage(strokeLabel, {
      color: "#FFD700",
      fontSize: "1.15rem",
      fontWeight: "bold",
      zIndex: "6",
      maxOffset: 70,
      duration: 1700
    });

    setTimeout(() => {
      showFloatingMessage(randomHoleMessage, {
        color: "#FFFFFF",
        fontSize: "1.3rem",
        fontWeight: "bold",
        zIndex: "6",
        maxOffset: 110,
        duration: 1800
      });
    }, 90);
  }

  applyKissThemeMode();

  kissButton.addEventListener("click", () => {
    showLoveMessage();
  });

  kissButton.addEventListener("bounceable:locked-in-hole", (event) => {
    const strokeCount = event.detail?.strokeCount ?? 0;
    showSinkMessages(strokeCount);
  });

  document.addEventListener("themeChange", applyKissThemeMode);
}
