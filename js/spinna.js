document.addEventListener('DOMContentLoaded', () => {
  const substackButton = document.querySelector('.substack-button');
  let rotationSpeed = 3; // Default speed (in seconds for a full rotation)

  // Function to update the spinning speed
  function updateSpinSpeed() {
    // Apply the updated speed to the animation duration
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
});
