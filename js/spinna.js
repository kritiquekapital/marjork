document.addEventListener('DOMContentLoaded', () => {
  const substackButton = document.querySelector('.substack-button');
  const substackImage = substackButton.querySelector('img');

  let rotationSpeed = 3; // Default speed (in seconds for a full rotation)
  let isHovered = false;

  // Function to update the spinning speed
  function updateSpinSpeed() {
    // Apply the updated speed to the animation duration
    substackButton.style.animation = `spin ${rotationSpeed}s linear infinite`;
  }

  // Hover effect: Reset rotation speed on hover
  substackButton.addEventListener('mouseenter', () => {
    isHovered = true;
    rotationSpeed = 3; // Reset to default speed on hover
    updateSpinSpeed();
    substackButton.style.animation = "spin 3s linear infinite"; // Start spinning when hovered
  });

  // When mouse leaves: continue spinning with the updated speed
  substackButton.addEventListener('mouseleave', () => {
    isHovered = false;
    updateSpinSpeed();
    // Stop spinning when mouse leaves
    substackButton.style.animation = "none";
  });

  // Click effect: Increase spin velocity (decrease the duration)
  substackButton.addEventListener('click', () => {
    rotationSpeed -= 0.5; // Increase the spin speed by reducing the time
    if (rotationSpeed <= 0.5) rotationSpeed = 0.5; // Minimum speed limit
    updateSpinSpeed();
  });

  // Initial spin animation
  updateSpinSpeed(); // Set the default spin speed on page load

  // Update Substack button styles based on the current theme
  const themeButton = document.getElementById("themeButton");
  themeButton.addEventListener("click", () => {
    const currentTheme = themes[currentThemeIndex]; // Update according to your theme logic
    if (currentTheme.name === "modern" || currentTheme.name === "space") {
      substackButton.style.borderColor = "transparent"; // Hide border
      substackImage.src = ""; // Remove the image for modern and space
    } else {
      substackButton.style.borderColor = "#FF6A13"; // Default orange border for other themes
      substackImage.src = "https://github.com/kritiquekapital/marjork/blob/main/css/pic/Psych-Flower%20%2304.png"; // Original image
    }
  });
});
