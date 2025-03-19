const imageList = [
  "roll_03_01.jpg",
  "roll_03_(02).jpg",
  "roll_03_(03).jpg",
  "roll_03_(04).jpg",
  "roll_03_(05).jpg",
  "roll_03_(06).jpg",
  "roll_03_(07).jpg",
  "roll_03_(08).jpg",
  "roll_03_(09).jpg",
  "roll_03_(10).jpg",
  "roll_03_(11).jpg",
  "roll_03_(12).jpg",
  "roll_03_(13).jpg",
  "roll_03_(14).jpg",
  "roll_03_(15).jpg",
  "roll_03_(16).jpg",
  "roll_03_(17).jpg",
  "roll_03_(18).jpg",
  "roll_03_(19).jpg",
  "roll_03_(20).jpg",
  "roll_03_(21).jpg",
  "roll_03_(22).jpg",
  "roll_03_(23).jpg",
  "roll_03_(24).jpg",
  "roll_03_(25).jpg",
  "roll_03_(26).jpg",
  "roll_03_(27).jpg",
  "roll_03_(28).jpg",
  "roll_03_(29).jpg",
  "roll_03_(30).jpg",
  "roll_03_(31).jpg",
  "roll_03_(32).jpg",
  "roll_03_(33).jpg"
];

let currentIndex = 0;

  const photoButton = document.querySelector(".photo");
  const imageFolderURL = "https://raw.githubusercontent.com/kritiquekapital/marjork/main/suprises/roll_03/";

  // Prevent scrollbars from appearing
  document.body.style.overflow = "hidden";

  function createFloatingImage(imageURL) {
    // Create the image element
    const img = document.createElement("img");
    img.src = imageURL;
    img.crossOrigin = "anonymous"; // Handle CORS for external images
    img.style.position = "fixed";
    img.style.width = "150px"; // Initial size
    img.style.height = "auto"; // Maintain aspect ratio
    img.style.opacity = "1"; // Start fully visible
    img.style.pointerEvents = "none";
    img.style.transition = "left 8s linear, top 8s linear, opacity 8s ease-out, transform 8s ease-out"; // Smooth transitions
    img.style.zIndex = "1000";
    img.style.border = "2px solid black"; // Add a black border
    img.style.boxSizing = "border-box"; // Ensure the border is included in the element's dimensions

    // Ensure the image is within the viewport and never starts offscreen
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate the maximum allowed starting positions to ensure the image stays within the viewport
    const maxX = viewportWidth - 150; // Ensure the image doesn't go offscreen horizontally
    const maxY = viewportHeight - 150; // Ensure the image doesn't go offscreen vertically

    // Randomly position the image within the entire viewport
    const startX = Math.random() * maxX; // Random X position within the viewport
    const startY = Math.random() * maxY; // Random Y position within the viewport

    // Apply the position directly to the image
    img.style.left = `${startX}px`;
    img.style.top = `${startY}px`;

    console.log("Creating floating image:", imageURL, "at position:", startX, startY);

    // Append the image to the DOM
    document.body.appendChild(img);

    // Debugging: Confirm the image is in the DOM
    console.log("Image appended to DOM:", document.body.contains(img));

    // Function to move the image
    function moveImage() {
      // Calculate the maximum allowed ending positions to ensure the image stays within the viewport
      const endX = Math.random() * maxX; // Random X position within the viewport
      const endY = Math.random() * maxY; // Random Y position within the viewport

      // Apply the new position directly to the image
      img.style.left = `${endX}px`;
      img.style.top = `${endY}px`;

      // Gradually expand the image
      img.style.transform = "scale(2)"; // Double the size

      // Gradually fade out the image
      img.style.opacity = "0";

      console.log("Moving image to:", endX, endY);
    }

    // Wait for the image to load before moving it
    img.onload = () => {
      console.log("Image loaded successfully:", imageURL);
      console.log("Image dimensions:", img.naturalWidth, "x", img.naturalHeight);
      moveImage(); // Start moving the image after it's fully loaded
    };

    img.onerror = () => {
      console.error("Failed to load image:", imageURL);
    };

    // Remove image after 8 seconds
    setTimeout(() => {
      console.log("Removing image:", imageURL);
      img.remove();
    }, 8000);
  }

  photoButton.addEventListener("click", (event) => {
    event.preventDefault();

    // Construct the image URL
    const imageURL = imageFolderURL + imageList[currentIndex];
    console.log("Loading image:", imageURL);

    // Test with a local image (for debugging)
    // const imageURL = "path/to/local/image.jpg";

    // Create and display the floating image
    createFloatingImage(imageURL);

    // Cycle to the next image
    currentIndex = (currentIndex + 1) % imageList.length;
  });
