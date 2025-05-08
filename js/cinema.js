import { Draggable } from './draggable.js';

document.addEventListener("DOMContentLoaded", () => {
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

  function updateLiveStream() {
    let url = liveLinks1[currentLinkIndex1];
    if (url.includes("watch?v=")) {
      url = url.replace("watch?v=", "embed/") + "?autoplay=1";
    }
    liveFrame.src = url;
  }

  const videoPopup = document.querySelector('.video-popup');
  const pinButton = videoPopup.querySelector('.pin-btn');
  const closeButton = videoPopup.querySelector('.close-button');
  const overlay = document.querySelector('.popup-player-container');
  const resizeHandle = document.querySelector('.resize-handle');
  const liveFrame = videoPopup.querySelector('iframe');
  const prevButton = videoPopup.querySelector('#prevButton');
  const nextButton = videoPopup.querySelector('#nextButton');

  let isPinned = false;

  // Set the initial visibility of the video popup and container
  videoPopup.style.display = "none"; // Make sure video-popup is hidden by default
  videoContainer.style.display = "none"; // Ensure the container is hidden on load

  if (videoPopup) {
    const draggableVideoPopup = new Draggable(videoPopup);
    draggableVideoPopup.isFree = false;

    // Position the video popup in the center
    videoPopup.style.position = "fixed";
    videoPopup.style.top = "50%";
    videoPopup.style.left = "50%";
    videoPopup.style.transform = "translate(-50%, -50%)";

    // Adjust boundaries for dragging
    const minX = 600;
    const maxX = window.innerWidth - videoPopup.offsetWidth - 35;
    const minY = 335;
    const maxY = window.innerHeight - videoPopup.offsetHeight - 335;

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

        if (newLeft < minX || newLeft > maxX) {
          this.velocity.x *= -1;
        }
        if (newTop < minY || newTop > maxY) {
          this.velocity.y *= -1;
        }

        this.element.style.left = `${Math.min(maxX, Math.max(minX, newLeft))}px`;
        this.element.style.top = `${Math.min(maxY, Math.max(minY, newTop))}px`;

        this.animationFrame = requestAnimationFrame(animate);
      };

      this.animationFrame = requestAnimationFrame(animate);
    };

    pinButton.addEventListener("click", () => {
      isPinned = !isPinned;

      if (isPinned) {
        overlay.style.visibility = "hidden"; // Hide overlay when pinned
      } else {
        overlay.style.visibility = "visible"; // Show overlay when unpinned
        overlay.style.opacity = "1"; // Fade back in the overlay
      }
    });

    closeButton.addEventListener("click", () => {
      videoPopup.style.display = "none"; // Hide the video popup
      overlay.style.visibility = "visible"; // Show the overlay
      overlay.style.opacity = "1"; // Fade in the overlay
    });

    prevButton.addEventListener("click", () => {
      currentLinkIndex1 = (currentLinkIndex1 - 1 + liveLinks1.length) % liveLinks1.length;
      updateLiveStream(); // Update the live stream URL
    });

    nextButton.addEventListener("click", () => {
      currentLinkIndex1 = (currentLinkIndex1 + 1) % liveLinks1.length;
      updateLiveStream(); // Update the live stream URL
    });

    // Resize handle logic
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

    // Allow dragging the video area but keep video itself clickable
    videoPopup.addEventListener('mousedown', (event) => {
      if (event.target !== liveFrame) { 
        // Only initiate dragging if not on the video itself
        draggableVideoPopup.startDrag(event);
      }
    });
  }

  // Handle propaganda button click to prevent opening in new tab
  const propagandaLink = document.querySelector(".propaganda-link");
  if (propagandaLink) {
    propagandaLink.addEventListener("click", (event) => {
      event.preventDefault();  // Prevent the default action (opening a new tab)
      updateLiveStream();      // Update the live stream URL
      videoContainer.style.visibility = "visible";  // Show the video container
      videoContainer.style.display = "flex";        // Center the popup container
      videoPopup.style.display = "block";           // Ensure the video popup itself becomes visible
    });
  }
});
