// Hardcoded list of live links
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
document.querySelector(".propaganda-link").addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default anchor link behavior
  window.open(liveLinks[currentLinkIndex], '_blank'); // Open link in a new tab
  currentLinkIndex = (currentLinkIndex + 1) % liveLinks.length; // Rotate to the next link
});

// Hardcoded list of live links2
const liveLinks2 = [
"https://www.youtube.com/watch?v=6riDJMI-Y8U&ab_channel=Crunchyroll",  
"https://archive.org/details/16-millers-blues-alternate-take-previously-unissued/08+-+Three-Four.mp3",   
"https://www.youtube.com/watch?v=y1TNuHPSBXI&list=WL&index=82&ab_channel=e-dubble",   
"https://www.youtube.com/watch?v=taCRBFkUqdM&ab_channel=e-dubble",   
"https://www.youtube.com/watch?v=taCRBFkUqdM&ab_channel=RhythmRadar",   
"https://www.youtube.com/watch?v=PPoH0Gn50Nc&list=WL&index=65&ab_channel=RhythmRadar",   
"https://www.youtube.com/watch?v=FNKPYhXmzoE&rco=1&ab_channel=GreenDay",   
"https://www.youtube.com/watch?v=7xxgRUyzgs0&list=WL&index=23&ab_channel=LivingColourVEVO",   
"https://www.youtube.com/watch?v=_mjDnMy2sL8&ab_channel=ChrisLongFilms",  
"https://www.youtube.com/watch?v=UtcxL4XXUGk&ab_channel=ChrisLongFilms"   
];

let currentLinkIndex2 = 0;

// Handle click on the "vinyl" button
document.querySelector(".vinyl-link").addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default anchor link behavior
  window.open(liveLinks[currentLinkIndex], '_blank'); // Open link in a new tab
  currentLinkIndex = (currentLinkIndex + 1) % liveLinks.length; // Rotate to the next link
});


document.addEventListener("DOMContentLoaded", () => {
  const kissButton = document.querySelector(".kiss-button");

  // Array of possible messages
  const messages = [
    "i love you!",
    "я тебя люблю!",
    "☀️ solnyshko ☀️"
  ];

  kissButton.addEventListener("click", () => {
    // Randomly select a message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Create a new div for the message
    const loveMessage = document.createElement("div");
    loveMessage.textContent = randomMessage;
    loveMessage.style.position = "absolute";
    loveMessage.style.color = "#FF1493";
    loveMessage.style.fontSize = "1.5rem";
    loveMessage.style.fontWeight = "bold";
    loveMessage.style.whiteSpace = "nowrap"; // Ensure the text is on one line
    loveMessage.style.top = "50%";
    loveMessage.style.left = "50%";
    loveMessage.style.transform = "translate(-50%, -50%)";
    loveMessage.style.opacity = "1";
    loveMessage.style.transition = "opacity 1.5s ease, transform 1.5s ease";

    // Generate a random angle (in radians) and distance for the movement
    const randomAngle = Math.random() * 2 * Math.PI; // Angle between 0 and 2π
    const randomDistance = Math.random() * 250 + 150; // Distance between 150px and 400px
    const offsetX = Math.cos(randomAngle) * randomDistance;
    const offsetY = Math.sin(randomAngle) * randomDistance;

    // Animate the message
    setTimeout(() => {
      loveMessage.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
      loveMessage.style.opacity = "0";
    }, 100);

    // Append the message to the button
    kissButton.appendChild(loveMessage);

    // Remove the message after the animation
    setTimeout(() => {
      kissButton.removeChild(loveMessage);
    }, 1600);
  });
});

const vinylButton = document.querySelector('.vinyl');
const arm = document.querySelector('.vinyl .arm');

vinylButton.addEventListener('mouseover', () => {
  // First, make it quickly jump to 290°.
  arm.style.transition = 'transform 1.5s ease-in';
  arm.style.transform = 'rotate(290deg)';

  // After 200ms, smoothly rotate to 320°.
  setTimeout(() => {
    arm.style.transition = 'transform 7s ease-out';
    arm.style.transform = 'rotate(328deg)';
  }, 3000);
});

vinylButton.addEventListener('mouseleave', () => {
  // Return to initial state when mouse leaves
  arm.style.transition = 'transform 0.5s ease-in';
  arm.style.transform = 'rotate(270deg)';
});
