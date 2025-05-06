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
});
