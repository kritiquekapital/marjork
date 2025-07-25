import { Draggable } from './draggable.js';

document.addEventListener("DOMContentLoaded", () => {

  // Hardcoded list of live links for the video player
  const liveLinks1 = [
    "https://www.youtube.com/watch?v=XBbkt2vYC4M",                    // i beg ur pardon
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

  function updateLiveStream() {
    let url = liveLinks1[currentLinkIndex1];
    if (url.includes("watch?v=")) {
      url = url.replace("watch?v=", "embed/") + "?autoplay=1";
    }
    liveFrame.src = url;
  }

  const videoContainer = document.querySelector('.video-container');
  const liveFrame = videoContainer.querySelector('iframe');
  const prevButton = videoContainer.querySelector('#prevButton');
  const nextButton = videoContainer.querySelector('#nextButton');
  const popoutButton = videoContainer.querySelector('.pin-button');
  const closeButton = videoContainer.querySelector('.close-button');
  const overlay = document.querySelector('.popup-player-container');
  const videoPopup = videoContainer.querySelector('.video-popup');
  const resizeHandle = document.querySelector('.resize-handle');
  const pinButton = document.querySelector('.pin-btn');  // Pin button reference

  let isPinned = false;  // Track if the video player is pinned or not
  let hasBeenDragged = false;

  if (videoPopup) {
    const VideoPopup = new Draggable(videoPopup);
    draggableVideoPopup.isFree = false; // Set initial state as non-free (non-draggable)

    document.addEventListener("themeChange", () => {
      const isSpace = document.body.classList.contains("theme-space");
      draggableVideoPopup.setZeroGravityMode(isSpace);
    });
    document.dispatchEvent(new Event("themeChange"));

    // Set initial position for the video popup (centered)
    videoPopup.style.position = "fixed";
    videoPopup.style.top = "50%";
    videoPopup.style.left = "50%";
    videoPopup.style.transform = "translate(-50%, -50%)";

    // Adjust the boundaries for draggable video player
    const minX = 600;
    const maxX = window.innerWidth - videoPopup.offsetWidth - 35;
    const minY = 335;
    const maxY = window.innerHeight - videoPopup.offsetHeight - 335;

    draggableVideoPopup.setZeroGravityMode = function(isZeroG) {
      this.isZeroGravity = isZeroG;

      if (isZeroG) {
        this.applyPhysics(); // Start movement loop if not already started
      } else {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    };

    // Adjust the draggable physics to respect these boundaries
    draggableVideoPopup.applyPhysics = function() {
      const animate = () => {
        if (!this.isZeroGravity && Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
          cancelAnimationFrame(this.animationFrame);
          return;
        }

        if (!this.isZeroGravity) {
          this.velocity.x *= this.friction;
          this.velocity.y *= this.friction;
        }

        let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
        let newTop = parseFloat(this.element.style.top) + this.velocity.y;

        // Apply boundary checks
        if (newLeft < minX || newLeft > maxX) {
          this.velocity.x *= -1; // Bounce horizontally
        }
        if (newTop < minY || newTop > maxY) {
          this.velocity.y *= -1; // Bounce vertically
        }

        this.element.style.left = `${Math.min(maxX, Math.max(minX, newLeft))}px`;
        this.element.style.top = `${Math.min(maxY, Math.max(minY, newTop))}px`;

        this.animationFrame = requestAnimationFrame(animate);
      };

      this.animationFrame = requestAnimationFrame(animate);
    };

    const propagandaLink = document.querySelector(".propaganda-link");
    if (propagandaLink) {
      propagandaLink.addEventListener("click", (event) => {
        event.preventDefault();
        updateLiveStream(); // Update the live stream URL
        videoContainer.style.visibility = "visible"; // Show video container
        videoContainer.style.display = "flex"; // Center the container
      });
    }

    // Switch to the previous channel
    prevButton.addEventListener("click", () => {
      currentLinkIndex1 = (currentLinkIndex1 - 1 + liveLinks1.length) % liveLinks1.length;
      updateLiveStream(); // Update the live stream URL
    });

    // Switch to the next channel
    nextButton.addEventListener("click", () => {
      currentLinkIndex1 = (currentLinkIndex1 + 1) % liveLinks1.length;
      updateLiveStream(); // Update the live stream URL
    });

    // Resizing functionality for the video popup (only on top-right corner and keeping 16:9 ratio)
    let isResizing = false;
    resizeHandle.addEventListener('mousedown', (event) => {
      isResizing = true;
      const initialWidth = videoPopup.offsetWidth;
      const initialHeight = videoPopup.offsetHeight;
      const initialMouseX = event.clientX;
      const initialMouseY = event.clientY;

      function onMouseMove(e) {
        if (isResizing) {
          const newWidth = initialWidth + (e.clientX - initialMouseX);
          const newHeight = newWidth * 9 / 16; // Maintain 16:9 aspect ratio
          videoPopup.style.width = `${newWidth}px`;
          videoPopup.style.height = `${newHeight}px`;
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

    // Pin Button Logic
    pinButton.addEventListener("click", () => {
      isPinned = !isPinned;  // Toggle pin state

      if (isPinned) {
        // Prevent closing when pinned
        overlay.style.visibility = "hidden";  // Hide overlay if pinned
      } else {
        overlay.style.visibility = "visible";  // Show overlay if not pinned
        overlay.style.opacity = "1";  // Fade in the overlay when unpinned
      }
    });

    // Allow dragging the video area too, but still make it clickable
    videoPopup.addEventListener('mousedown', (event) => {
      if (event.target !== liveFrame) { 
        // Only initiate dragging if not on the video itself
        draggableVideoPopup.startDrag(event);
      } else {
        // If clicked on the video, ensure it is clickable (like play/pause)
        // Handle any video-specific logic you want to add here.
      }

      // Fade the background when dragging starts
      if (!hasBeenDragged) {
        if (overlay) {
          overlay.style.opacity = "0";  // Fade out the background
        }
        hasBeenDragged = true;  // Set flag to prevent it from fading out again
      }
    });

    // End dragging and restore overlay visibility when drag ends
    videoPopup.addEventListener('mouseup', () => {
      if (overlay) {
        overlay.style.opacity = "1";  // Fade back in the background
      }
    });
  }
});
