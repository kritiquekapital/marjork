document.addEventListener("DOMContentLoaded", function() {
  const substackButton = document.querySelector('.substack-button');
  let rotationSpeed = 10; // Default speed for rotation (in seconds)
  let isHovered = false;
  let isClicked = false;

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
    rotationSpeed = 10;
    // Apply the rotation animation
    substackButton.style.animation = `rotateSubstack ${rotationSpeed}s linear infinite`;
  });

  substackButton.addEventListener('mouseleave', function() {
    isHovered = false;
    startContinuousRotation(); // Continue rotating when hover ends
  });

  substackButton.addEventListener('click', function() {
    isClicked = true;
    // Speed up the rotation when clicked
    rotationSpeed = 5; // Faster speed
    substackButton.style.animation = `rotateSubstack ${rotationSpeed}s linear infinite`;
  });
});
