// Hardcoded lists of live links for buttons
const liveLinks1 = [
  "https://www.kanopy.com/en/product/playtime",
  "https://archive.org/details/burden-of-dreams",
  "https://www.youtube.com/watch?v=2NWdFWp0XKE&ab_channel=Abdala%27sPirataria",
  "https://www.youtube.com/watch?v=-DoaUyMGPWI&t=1480s&ab_channel=SecretBase",
  "https://www.youtube.com/watch?v=EGAzxO851c4&ab_channel=Fernanda",
  "https://www.youtube.com/watch?v=T2IaJwkqgPk&ab_channel=AdityaShukla",
  "https://www.youtube.com/watch?v=lvh6NLqKRfs&t=913s&ab_channel=SecretBase"
];
const liveLinks2 = [
  "https://www.youtube.com/watch?v=6riDJMI-Y8U",
  "https://www.youtube.com/watch?v=y1TNuHPSBXI",
  "https://www.youtube.com/watch?v=taCRBFkUqdM",
  "https://www.youtube.com/watch?v=PPoH0Gn50Nc",
  "https://www.youtube.com/watch?v=FNKPYhXmzoE",
  "https://www.youtube.com/watch?v=7xxgRUyzgs0",
  "https://www.youtube.com/watch?v=G4CKmzBf5Cs",
  "https://www.youtube.com/watch?v=_mjDnMy2sL8",
  "https://www.youtube.com/watch?v=UtcxL4XXUGk",
  "https://www.youtube.com/watch?v=BpqOWO6ctsg&ab_channel=emanuelpereyra",
  "https://archive.org/details/16-millers-blues-alternate-take-previously-unissued/08+-+Three-Four.mp3"
];

let currentLinkIndex1 = 0;
let currentLinkIndex2 = 0;

// DOMContentLoaded to ensure DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Handle click on the "LIVE" button
  const propagandaLink = document.querySelector(".propaganda-link");
  if (propagandaLink) {
    propagandaLink.addEventListener("click", (event) => {
      event.preventDefault();
      const newTab = window.open(liveLinks1[currentLinkIndex1], "_blank");
      if (newTab) newTab.blur(); // Open in the background
      currentLinkIndex1 = (currentLinkIndex1 + 1) % liveLinks1.length;
    });
  }

  // Handle click on the "VINYL" button
  const vinylLink = document.querySelector(".vinyl-link");
  if (vinylLink) {
    vinylLink.addEventListener("click", (event) => {
      event.preventDefault();
      const newTab = window.open(liveLinks2[currentLinkIndex2], "_blank");
      if (newTab) newTab.blur(); // Open in the background
      currentLinkIndex2 = (currentLinkIndex2 + 1) % liveLinks2.length;
    });
  }

  // Vinyl button arm animation
  const vinylButton = document.querySelector(".vinyl");
  const arm = document.querySelector(".vinyl .arm");
  if (vinylButton && arm) {
    vinylButton.addEventListener("mouseover", () => {
      arm.style.transition = "transform 0.2s";
      arm.style.transform = "rotate(290deg)"; // Quick jump

      setTimeout(() => {
        arm.style.transition = "transform 5s ease-out";
        arm.style.transform = "rotate(322deg)"; // Smooth rotation
      }, 200);
    });

    vinylButton.addEventListener("mouseleave", () => {
      arm.style.transition = "transform 0.5s ease-in";
      arm.style.transform = "rotate(270deg)"; // Reset position
    });
  }

  // Kiss button random message animation
  const kissButton = document.querySelector(".kiss-button");
  if (kissButton) {
    const messages = [
      "i love you!",
      "я тебя люблю!",
      "☀️ solnyshko ☀️"
    ];

    kissButton.addEventListener("click", () => {
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
});
