import { Bounceable } from './bounceable.js';
import { track } from './analytics.js';

const kissButton = document.querySelector(".kiss-button");

const messages = [
  "u get it",
  "i love you!",
  "я тебя люблю!",
  "☀️ solnyshko ☀️",
  "Horse Balls!",
  "красивая!",
];

const holeMessages = [
  "holed",
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
      : document.body.classList.contains("theme-glitch")
      ? "glitch"
      : "normal";

    switch (currentTheme) {
      case "retro":
        Bounceable.switchMode(Bounceable.modes.RETRO);
        break;
      case "space":
        Bounceable.switchMode(Bounceable.modes.ZERO_GRAVITY);
        break;
      case "glitch":
        Bounceable.switchMode(Bounceable.modes.GLITCH);
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
      duration = 1600,
      scale = 1,
      drift = 1
    } = options;

    const message = document.createElement("div");
    message.textContent = text;

    message.style.position = "absolute";
    message.style.color = color;
    message.style.fontSize = fontSize;
    message.style.fontWeight = fontWeight;
    message.style.top = "50%";
    message.style.left = "50%";
    message.style.transform = `translate(-50%, -50%) scale(${scale})`;
    message.style.opacity = "1";
    message.style.transition = "opacity 1.4s ease, transform 1.4s ease";
    message.style.pointerEvents = "none";
    message.style.zIndex = zIndex;
    message.style.whiteSpace = "nowrap";

    kissButton.appendChild(message);

    setTimeout(() => {
      const randomX = (Math.random() * 2 - 1) * maxOffset * drift;
      const randomY = (Math.random() * 2 - 1) * maxOffset * drift;

      message.style.transform =
        `translate(calc(-50% + ${randomX}px), calc(-50% + ${randomY}px)) scale(${scale * 0.9})`;
      message.style.opacity = "0";
    }, 80);

    setTimeout(() => {
      if (message.parentNode === kissButton) {
        kissButton.removeChild(message);
      }
    }, duration);
  }

  function showLoveMessage() {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    track("kiss_button_click", {
      message: randomMessage
    });

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
    const randomHoleMessage =
      holeMessages[Math.floor(Math.random() * holeMessages.length)];

    const strokeLabel =
      `${strokeCount} stroke${strokeCount === 1 ? "" : "s"}`;

    track("kiss_button_sink", {
      strokes: strokeCount
    });

    showFloatingMessage(strokeLabel, {
      color: "#FF1493",
      fontSize: "1.9rem",
      fontWeight: "900",
      zIndex: "6",
      maxOffset: 80,
      duration: 1700,
      scale: 1.25,
      drift: 0.8
    });

    setTimeout(() => {
      showFloatingMessage(randomHoleMessage, {
        color: "#FF69B4",
        fontSize: "1.35rem",
        fontWeight: "bold",
        zIndex: "6",
        maxOffset: 120,
        duration: 1800,
        scale: 1,
        drift: 1.2
      });
    }, 140);
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
