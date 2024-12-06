document.addEventListener("DOMContentLoaded", () => {
  const kissButton = document.querySelector(".kiss-button");
  kissButton.addEventListener("click", () => {
    // Create a new div for the message
    const loveMessage = document.createElement("div");
    loveMessage.textContent = "I love you!";
    loveMessage.style.position = "absolute";
    loveMessage.style.color = "#FF1493";
    loveMessage.style.fontSize = "1.5rem";
    loveMessage.style.fontWeight = "bold";
    loveMessage.style.top = "50%";
    loveMessage.style.left = "50%";
    loveMessage.style.transform = "translate(-50%, -50%)";
    loveMessage.style.opacity = "1";
    loveMessage.style.transition = "opacity 1s ease, transform 1s ease";

    // Append the message to the button
    kissButton.appendChild(loveMessage);

    // Animate the message
    setTimeout(() => {
      loveMessage.style.opacity = "0";
      loveMessage.style.transform = "translate(-50%, -100%)";
    }, 100);

    // Remove the message after the animation
    setTimeout(() => {
      kissButton.removeChild(loveMessage);
    }, 1100);
  });
});
