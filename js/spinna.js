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
  });

  // When mouse leaves: continue spinning with the updated speed
  substackButton.addEventListener('mouseleave', () => {
    isHovered = false;
    updateSpinSpeed();
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
