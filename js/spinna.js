document.addEventListener('DOMContentLoaded', () => {
  const substackButton = document.querySelector('.substack-button');
  const substackImage = substackButton.querySelector('img');
  
  let rotationSpeed = 3; // Default speed (in seconds for a full rotation)

  // Function to update the spinning speed
  function updateSpinSpeed() {
    substackButton.style.animation = `spin ${rotationSpeed}s linear infinite`;
  }

  // Hover effect: Reset rotation speed on hover
  substackButton.addEventListener('mouseenter', () => {
    rotationSpeed = 3; // Reset to default speed on hover
    updateSpinSpeed();
    substackButton.style.animation = "spin 3s linear infinite"; // Start spinning when hovered
  });

  // When mouse leaves: continue spinning with the updated speed
  substackButton.addEventListener('mouseleave', () => {
    updateSpinSpeed();
    substackButton.style.animation = "spin 3s linear infinite"; // Continue spinning on mouse leave
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
      substackButton.style.borderColor = "transparent"; // Hide border for modern and space themes
      substackImage.src = ""; // Remove the image for modern and space
    } else {
      substackButton.style.borderColor = "#FF6A13"; // Default orange border for other themes
      substackImage.src = "https://github.com/kritiquekapital/marjork/blob/main/css/pic/Psych-Flower%20%2304.png"; // Original image for default themes
    }
  });
});
