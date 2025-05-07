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

  const videoContainer = document.querySelector('.video-container');
  const liveFrame = videoContainer.querySelector('iframe');
  const prevButton = videoContainer.querySelector('#prevButton');
  const nextButton = videoContainer.querySelector('#nextButton');
  const popoutButton = videoContainer.querySelector('#popoutButton');
  const closeButton = videoContainer.querySelector('.close-button');
  const overlay = document.querySelector('.-overlay');
  const videoPopup = videoContainer.querySelector('.video-popup');

  if (videoPopup) {
    const draggableVideoPopup = new Draggable(videoPopup);
    draggableVideoPopup.isFree = false;

    // Set initial position for the video popup (centered)
    videoPopup.style.position = "fixed";
    videoPopup.style.top = "50%";
    videoPopup.style.left = "50%";
    videoPopup.style.transform = "translate(-50%, -50%)";

    // Adjust the boundaries by 250px for left and right, and 100px for top/bottom
    const minX = -250; // 250px offset from the left edge of the screen
    const maxX = window.innerWidth - videoPopup.offsetWidth + 250; // 250px offset from the right edge
    const minY = 100; // 100px offset from the top edge
    const maxY = window.innerHeight - videoPopup.offsetHeight - 100; // 100px offset from the bottom edge

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

    // Popout button logic to make the video popup draggable
    popoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (!draggableVideoPopup.isFree) {
        draggableVideoPopup.isFree = true;
        videoPopup.style.position = "fixed";
        videoPopup.style.top = "50%";
        videoPopup.style.left = "50%";
        videoPopup.style.transform = "translate(-50%, -50%)";
      }
      if (overlay) {
        overlay.style.display = "none";
      }
    });

    closeButton.addEventListener("click", () => {
      videoContainer.style.display = "none";
      if (overlay) {
        overlay.style.display = "block";
      }
    });

    const propagandaLink = document.querySelector(".propaganda-link");
    if (propagandaLink) {
      propagandaLink.addEventListener("click", (event) => {
        event.preventDefault();
        updateLiveStream();
        videoContainer.style.visibility = "visible";
        videoContainer.style.display = "flex";
      });
    }

    prevButton.addEventListener("click", () => {
      currentLinkIndex1 = (currentLinkIndex1 - 1 + liveLinks1.length) % liveLinks1.length;
      updateLiveStream();
    });

    nextButton.addEventListener("click", () => {
      currentLinkIndex1 = (currentLinkIndex1 + 1) % liveLinks1.length;
      updateLiveStream();
    });

    const resizeHandle = document.querySelector('.resize-handle');
    if (resizeHandle) {
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
            const newHeight = initialHeight + (e.clientY - initialMouseY);
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
    }

    // Allow dragging the video area too, but still make it clickable
    videoPopup.addEventListener('mousedown', (event) => {
      if (event.target !== liveFrame) { 
        // Only initiate dragging if not on the video itself
        draggableVideoPopup.startDrag(event);
      } else {
        // If clicked on the video, ensure it is clickable (like play/pause)
        // Handle any video-specific logic you want to add here.
      }
    });
  }
});
