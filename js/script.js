// Hardcoded list of live links for the first button
const liveLinks1 = [
  "https://archive.org/details/playtime-jacques-tati-1967",
  "https://archive.org/details/burden-of-dreams",
  "https://www.youtube.com/watch?v=2NWdFWp0XKE&ab_channel=Abdala%27sPirataria",    
  "https://www.youtube.com/watch?v=-DoaUyMGPWI&t=1480s&ab_channel=SecretBase",
  "https://www.youtube.com/watch?v=EGAzxO851c4&ab_channel=Fernanda",
  "https://www.youtube.com/watch?v=T2IaJwkqgPk&ab_channel=AdityaShukla",
  "https://www.youtube.com/watch?v=lvh6NLqKRfs&t=913s&ab_channel=SecretBase"
];

let currentLinkIndex1 = 0;

// Handle click on the "LIVE" button
document.addEventListener("DOMContentLoaded", () => {
  const propagandaLink = document.querySelector(".propaganda-link");

  if (propagandaLink) {
    propagandaLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.open(liveLinks1[currentLinkIndex1], '_blank');
      currentLinkIndex1 = (currentLinkIndex1 + 1) % liveLinks1.length;
    });
  }
});

// Hardcoded list of live links for the vinyl button
const liveLinks2 = [
  "https://www.youtube.com/watch?v=6riDJMI-Y8U&ab_channel=Crunchyroll",
  "https://www.youtube.com/watch?v=y1TNuHPSBXI&list=WL&index=82&ab_channel=e-dubble",
  "https://www.youtube.com/watch?v=G4CKmzBf5Cs&list=WL&index=3&ab_channel=MetaBeats",
  "https://www.youtube.com/watch?v=taCRBFkUqdM&ab_channel=e-dubble",
  "https://www.youtube.com/watch?v=taCRBFkUqdM&ab_channel=RhythmRadar",
  "https://www.youtube.com/watch?v=PPoH0Gn50Nc&list=WL&index=65&ab_channel=RhythmRadar",
  "https://www.youtube.com/watch?v=FNKPYhXmzoE&rco=1&ab_channel=GreenDay",
  "https://www.youtube.com/watch?v=7xxgRUyzgs0&list=WL&index=23&ab_channel=LivingColourVEVO",
  "https://www.youtube.com/watch?v=_mjDnMy2sL8&ab_channel=ChrisLongFilms",
  "https://www.youtube.com/watch?v=UtcxL4XXUGk&ab_channel=ChrisLongFilms",
  "https://archive.org/details/16-millers-blues-alternate-take-previously-unissued/08+-+Three-Four.mp3"
];

let currentLinkIndex2 = 0;

// Handle click on the vinyl button
document.addEventListener("DOMContentLoaded", () => {
  const vinylButton = document.querySelector(".vinyl");

  if (vinylButton) {
    vinylButton.addEventListener("click", (event) => {
      event.preventDefault();
      window.open(liveLinks2[currentLinkIndex2], '_blank');
      currentLinkIndex2 = (currentLinkIndex2 + 1) % liveLinks2.length;
    });
  }
});
const vinylButton = document.querySelector('.vinyl');
const arm = document.querySelector('.vinyl .arm');

vinylButton.addEventListener('mouseover', () => {
  // First, make it quickly jump to 290°.
  arm.style.transition = 'transform';
  arm.style.transform = 'rotate(290deg)';

  // After 2000ms, smoothly rotate to 320°.
  setTimeout(() => {
    arm.style.transition = 'transform 5s ease-out';
    arm.style.transform = 'rotate(322deg)';
  }, 1500);
});

vinylButton.addEventListener('mouseleave', () => {
  // Return to initial state when mouse leaves
  arm.style.transition = 'transform 0.5s ease-in';
  arm.style.transform = 'rotate(270deg)';
});

// Handle kiss button's random message
document.addEventListener("DOMContentLoaded", () => {
  const kissButton = document.querySelector(".kiss-button");

  const messages = [
    "i love you!",
    "я тебя люблю!",
    "☀️ solnyshko ☀️"
  ];

  if (kissButton) {
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
        loveMessage.style.transform = `translate(calc(-50% + ${Math.random() * 250 - 125}px), calc(-50% + ${Math.random() * 250 - 125}px))`;
        loveMessage.style.opacity = "0";
      }, 100);

      kissButton.appendChild(loveMessage);

      setTimeout(() => {
        kissButton.removeChild(loveMessage);
      }, 1600);
    });
  }
});
