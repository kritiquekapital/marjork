// Hardcoded list of live links
const liveLinks = [
  "https://www.youtube.com/watch?v=EGAzxO851c4&ab_channel=Fernanda",
	"https://archive.org/details/LaSoufriere",  
	"https://archive.org/details/burden-of-dreams",  
	"https://www.youtube.com/watch?v=-DoaUyMGPWI&t=1480s&ab_channel=SecretBase",  
	"https://www.youtube.com/watch?v=lvh6NLqKRfs&t=913s&ab_channel=SecretBase"  
];

let currentLinkIndex = 0;

// Handle click on the "LIVE" button
document.querySelector(".propaganda-link").addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default anchor link behavior
  window.location.href = liveLinks[currentLinkIndex];
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
