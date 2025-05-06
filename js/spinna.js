document.addEventListener("DOMContentLoaded", function() {
  const substackButton = document.querySelector('.substack-button');
  let rotationSpeed = 10; // Default speed for rotation (in seconds)
  let isHovered = false;
  let isClicked = false;
  let rotationProgress = 0; // Track the progress of the rotation

  // Function to handle continuous rotation after hover is removed
  function startContinuousRotation() {
    if (!isHovered && !isClicked) {
      // Keep rotating smoothly until the button completes the rotation
      substackButton.style.animation = `rotateSubstack ${rotationSpeed}s linear infinite`;
    }
  }

  // Add event listeners to control hover and click actions
  substackButton.addEventListener('mouseenter', function() {
    isHovered = true;
    // Reset rotation speed to default on hover
    rotationSpeed = 10; // Default speed for hover
    // Apply the rotation animation
    substackButton.style.animation = `rotateSubstack ${rotationSpeed}s linear infinite`;
  });

  substackButton.addEventListener('mouseleave', function() {
    isHovered = false;
    // Continue rotating after hover ends until it completes the rotation
    startContinuousRotation();
  });

  substackButton.addEventListener('click', function() {
    // Increase speed progressively on click by reducing the rotation duration
    rotationSpeed -= 1; // Reduce the duration by 1 second on each click
    if (rotationSpeed <= 2) rotationSpeed = 2; // Limit the minimum speed to 2 seconds
    substackButton.style.animation = `rotateSubstack ${rotationSpeed}s linear infinite`;

    // Temporarily increase rotation speed on click and then reset
    isClicked = true;
    setTimeout(() => {
      isClicked = false;
    }, 100); // Reset the click state after a short delay (to avoid rapid triggering)
  });
});
