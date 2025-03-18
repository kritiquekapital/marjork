document.addEventListener("DOMContentLoaded", () => {
  // Hardcoded lists of live links for buttons
  const liveLinks1 = [
    "https://www.youtube.com/embed/P0jJhwPjyok?autoplay=1",           // hairpin circus
    "https://www.youtube.com/embed/dxW8kHl5Q_I?autoplay=1",           // crack
    "https://www.youtube.com/embed/ze9-ARjL-ZA?autoplay=1",           // overwhelming and collective harmony
    "https://www.youtube.com/embed/QgyW9qjgIf4?autoplay=1",           // JRJRJRJRJRJRJRJRJRJRJRJRJR
    "https://www.youtube.com/embed/TCm9788Tb5g?autoplay=1",           // drive
    "https://www.youtube.com/embed/-DoaUyMGPWI?autoplay=1",           // fight
    "https://www.youtube.com/embed/2NWdFWp0XKE?autoplay=1",           // la souf
    "https://www.youtube.com/embed/md9-jG4RzXs?autoplay=1",           // Prix
    "https://www.youtube.com/embed/Sq0EYo_ZQVU?autoplay=1",           // SocWen
    "https://www.youtube.com/embed/EGAzxO851c4?autoplay=1",           // fata
    "https://www.youtube.com/embed/Kv-lO8aPOK8?autoplay=1",           // tokyo
    "https://www.youtube.com/embed/lvh6NLqKRfs?autoplay=1"            // bob
  ];

  const liveLinks2 = [
    "https://www.youtube.com/watch?v=6riDJMI-Y8U",
    "https://www.youtube.com/watch?v=y1TNuHPSBXI",
    "https://www.youtube.com/watch?v=taCRBFkUqdM",
    "https://www.youtube.com/watch?v=PPoH0Gn50Nc",
    "https://www.youtube.com/watch?v=FNKPYhXmzoE",
    "https://www.youtube.com/watch?v=7xxgRUyzgs0",
    "https://www.youtube.com/watch?v=G4CKmzBf5Cs",
    "https://www.youtube.com/watch?v=_mjDnMy2sL8",
    "https://www.youtube.com/watch?v=UtcxL4XXUGk",
    "https://www.youtube.com/watch?v=BpqOWO6ctsg&ab_channel=emanuelpereyra",
    "https://www.youtube.com/watch?v=V7IUtUsfARA",
  ];

  // List of links for the news button
  const newsLinks = [
    "https://www.salon.com/2001/10/16/susans/",
    "https://www.diagonalthoughts.com/?p=1728",
    "https://mirror.xyz/sartoshi.eth/QukjtL1076-1SEoNJuqyc-x4Ut2v8_TocKkszo-S_nU"
  ];

  let currentLinkIndex1 = 0;
  let currentLinkIndex2 = 0;
  let currentNewsLinkIndex = 0;

  // List of images
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

  // Function to update live stream
  function updateLiveStream() {
    let url = liveLinks1[currentLinkIndex1];
    if (url.includes("watch?v=")) {
      url = url.replace("watch?v=", "embed/") + "?autoplay=1";
    }
    liveFrame.src = url;
  }

  // Inject modal HTML structure
  document.body.insertAdjacentHTML("beforeend", `
    <div id="liveModal" class="popup-player-container" style="visibility: hidden;">
      <div class="video-popup">
        <iframe id="liveFrame" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
        <div class="modal-controls">
          <button id="prevChannel">Previous</button>
          <button id="nextChannel">Next</button>
        </div>
      </div>
    </div>
  `);

  const liveModal = document.getElementById("liveModal");
  const liveFrame = document.getElementById("liveFrame");
  const prevButton = document.getElementById("prevChannel");
  const nextButton = document.getElementById("nextChannel");
  const propagandaLink = document.querySelector(".propaganda-link");
  const newsButton = document.querySelector(".news-button");

  // Handle click on the "LIVE" button
  if (propagandaLink) {
    propagandaLink.addEventListener("click", (event) => {
      event.preventDefault();
      updateLiveStream();
      liveModal.style.visibility = "visible";
      liveModal.style.display = "flex";
    });
  }

  // Handle click on the "NEWS" button
  if (newsButton) {
    newsButton.addEventListener("click", (event) => {
      event.preventDefault();
      const link = newsLinks[currentNewsLinkIndex];
      const newTab = window.open(link, "_blank");

      // Scroll to the specific section if it's the first link
      if (currentNewsLinkIndex === 0 && link.includes("#")) {
        const sectionId = link.split("#")[1];
        newTab.onload = () => {
          const section = newTab.document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        };
      }

      // Cycle to the next link
      currentNewsLinkIndex = (currentNewsLinkIndex + 1) % newsLinks.length;
    });
  }

  // Close modal
  window.addEventListener("click", (event) => {
    if (event.target === liveModal) {
      liveModal.style.visibility = "hidden";
      liveModal.style.display = "none";
      liveFrame.src = "";
    }
  });

  // Switch channels manually
  prevButton.addEventListener("click", () => {
    currentLinkIndex1 = (currentLinkIndex1 - 1 + liveLinks1.length) % liveLinks1.length;
    updateLiveStream();
  });

  nextButton.addEventListener("click", () => {
    currentLinkIndex1 = (currentLinkIndex1 + 1) % liveLinks1.length;
    updateLiveStream();
  });

  const photoButton = document.querySelector(".photo");
  const imageFolderURL = "https://raw.githubusercontent.com/kritiquekapital/marjork/main/suprises/roll_03/";

  // Prevent scrollbars from appearing
  document.body.style.overflow = "hidden";

function createFloatingImage(imageURL) {

function createFloatingImage(imageURL) {
  // Create the image element
  const img = document.createElement("img");
  img.src = imageURL;
  img.crossOrigin = "anonymous"; // Handle CORS for external images
  img.style.position = "fixed";
  img.style.width = "150px"; // Twice as big (from 75px to 150px)
  img.style.height = "auto"; // Maintain aspect ratio
  img.style.opacity = "1";
  img.style.pointerEvents = "none";
  img.style.transition = "transform 8s linear"; // Disable opacity transition for debugging
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

  img.style.transform = `translate(${startX}px, ${startY}px)`;

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

    img.style.transform = `translate(${endX}px, ${endY}px)`;
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
  
  // Handle click on the "VINYL" button
  const vinylLink = document.querySelector(".vinyl-link");
  if (vinylLink) {
    vinylLink.addEventListener("click", (event) => {
      event.preventDefault();
      const newTab = window.open(liveLinks2[currentLinkIndex2], "_blank");
      if (newTab) newTab.blur();
      currentLinkIndex2 = (currentLinkIndex2 + 1) % liveLinks2.length;
    });
  }

  // Vinyl button arm animation
  const vinylButton = document.querySelector(".vinyl");
  const arm = document.querySelector(".vinyl .arm");
  if (vinylButton && arm) {
    vinylButton.addEventListener("mouseover", () => {
      arm.style.transition = "transform 0.2s";
      arm.style.transform = "rotate(290deg)";

      setTimeout(() => {
        arm.style.transition = "transform 5s ease-out";
        arm.style.transform = "rotate(322deg)";
      }, 200);
    });

    vinylButton.addEventListener("mouseleave", () => {
      arm.style.transition = "transform 0.5s ease-in";
      arm.style.transform = "rotate(270deg)";
    });
  }

  // Kiss button random message animation
  const kissButton = document.querySelector(".kiss-button");
  if (kissButton) {
    const messages = [
      "i love you!",
      "я тебя люблю!",
      "☀️ solnyshko ☀️"
    ];

    kissButton.addEventListener("click", () => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const loveMessage = document.createElement("div");

      loveMessage.textContent = randomMessage;
      loveMessage.style.position = "absolute";
      loveMessage.style.color = "#FF1493";
      loveMessage.style.fontSize = "1.5rem";
      loveMessage.style.fontWeight = "bold";
      loveMessage.style.top = "50%";
      loveMessage.style.left = "50%";
      loveMessage.style.transform = "translate(-50%, -50%)";
      loveMessage.style.opacity = "1";
      loveMessage.style.transition = "opacity 1.5s ease, transform 1.5s ease";

      setTimeout(() => {
        const randomX = Math.random() * 200 - 100;
        const randomY = Math.random() * 200 - 100;
        loveMessage.style.transform = `translate(calc(-50% + ${randomX}px), calc(-50% + ${randomY}px))`;
        loveMessage.style.opacity = "0";
      }, 100);

      kissButton.appendChild(loveMessage);

      setTimeout(() => {
        kissButton.removeChild(loveMessage);
      }, 1600);
    });
  }
});
