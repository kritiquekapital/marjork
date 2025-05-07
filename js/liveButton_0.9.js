import { Draggable } from './draggable.js';

document.addEventListener("DOMContentLoaded", () => {
  // Hardcoded list of live links for the video player (same as before)
  const liveLinks1 = [
    "https://geo.dailymotion.com/player.html?video=x9irfr8",
    "https://www.youtube.com/embed/P0jJhwPjyok?autoplay=1&vq=hd1080", // hairpin circus
    "https://www.youtube.com/embed/dxW8kHl5Q_I?autoplay=1&vq=hd1080", // crack
    "https://www.youtube.com/embed/ze9-ARjL-ZA?autoplay=1&vq=hd1080", // overwhelming and collective harmony
    "https://www.youtube.com/embed/QgyW9qjgIf4?autoplay=1&vq=hd1080", // JRJRJRJRJRJRJRJRJRJRJRJRJR
    "https://www.youtube.com/embed/w72mLI_FaR0?autoplay=1&vq=hd1080", // USSRRRRRR                                                 
    "https://www.youtube.com/embed/TCm9788Tb5g?autoplay=1&vq=hd1080", // drive
    "https://www.youtube.com/embed/-DoaUyMGPWI?autoplay=1&vq=hd1080", // fight
    "https://www.youtube.com/embed/rnvSs3HEz2o?autoplay=1&vq=hd1080", // MNR
    "https://www.youtube.com/embed/2NWdFWp0XKE?autoplay=1&vq=hd1080", // la souf
    "https://www.youtube.com/embed/Sq0EYo_ZQVU?autoplay=1&vq=hd1080", // SocWen
    "https://www.youtube.com/embed/EGAzxO851c4?autoplay=1&vq=hd1080", // fata
    "https://www.youtube.com/embed/Kv-lO8aPOK8?autoplay=1&vq=hd1080", // tokyo
    "https://www.youtube.com/embed/lvh6NLqKRfs?autoplay=1&vq=hd1080"  // bob
  ];

  let currentLinkIndex1 = 0;

  // Function to update the live stream iframe source
  function updateLiveStream() {
    let url = liveLinks1[currentLinkIndex1];
    if (url.includes("watch?v=")) {
      url = url.replace("watch?v=", "embed/") + "?autoplay=1";
    }
    liveFrame.src = url;
  }

  // Get references to the modal elements in the main HTML
  const videoContainer = document.querySelector('.video-container');
  const liveFrame = videoContainer.querySelector('iframe');
  const prevButton = videoContainer.querySelector('#prevButton');
  const nextButton = videoContainer.querySelector('#nextButton');
  const popoutButton = videoContainer.querySelector('#popoutButton');
  const closeButton = videoContainer.querySelector('.close-button');
  const overlay = document.querySelector('.-overlay');  // Reference to the black background overlay
  
  // Initialize the Draggable instance for the video popup
  const videoPopup = videoContainer.querySelector('.video-popup');
  const draggableVideoPopup = new Draggable(videoPopup); // Only the video popup will be draggable

  // Initially, don't allow the popup to be dragged
  draggableVideoPopup.isFree = false;

  // Make the video player modal draggable once the popout button is clicked
  popoutButton.addEventListener("click", (event) => {
    event.preventDefault();
    
    // Prevent video restart (do not change the iframe source)
    if (!draggableVideoPopup.isFree) {
      draggableVideoPopup.isFree = true;  // Now the video popup can be dragged
    }
    
    // Hide the background overlay (black tint)
    if (overlay) {
      overlay.style.display = "none"; // Hide the black background tint
    }
  });

  // Handle close button click to hide the video player
  closeButton.addEventListener("click", () => {
    videoContainer.style.display = "none"; // Hide the player when closing

    // Ensure the overlay reappears when closing the player
    if (overlay) {
      overlay.style.display = "block"; // Show the black background tint
    }
  });

  // Handle click on the "LIVE" button (fix the link behavior)
  const propagandaLink = document.querySelector(".propaganda-link");
  if (propagandaLink) {
    propagandaLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default behavior (new tab opening)
      updateLiveStream(); // Update the live stream URL
      videoContainer.style.visibility = "visible"; // Show the video container (modal)
      videoContainer.style.display = "flex"; // Make it a flex container to center it
    });
  }

  // Switch to the previous channel (video)
  prevButton.addEventListener("click", () => {
    currentLinkIndex1 = (currentLinkIndex1 - 1 + liveLinks1.length) % liveLinks1.length;
    updateLiveStream(); // Update the live stream URL
  });

  // Switch to the next channel (video)
  nextButton.addEventListener("click", () => {
    currentLinkIndex1 = (currentLinkIndex1 + 1) % liveLinks1.length;
    updateLiveStream(); // Update the live stream URL
  });

  // Resize the video player
  const resizeHandle = document.querySelector('.resize-handle');
  if (resizeHandle) {
    let isResizing = false;

    resizeHandle.addEventListener('mousedown', (event) => {
      isResizing = true;
      const initialWidth = videoContainer.querySelector('.video-popup').offsetWidth;
      const initialHeight = videoContainer.querySelector('.video-popup').offsetHeight;
      const initialMouseX = event.clientX;
      const initialMouseY = event.clientY;

      function onMouseMove(e) {
        if (isResizing) {
          const newWidth = initialWidth + (e.clientX - initialMouseX);
          const newHeight = initialHeight + (e.clientY - initialMouseY);
          videoContainer.querySelector('.video-popup').style.width = `${newWidth}px`;
          videoContainer.querySelector('.video-popup').style.height = `${newHeight}px`;
        }
      }

      function onMouseUp() {
        isResizing = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }
});
