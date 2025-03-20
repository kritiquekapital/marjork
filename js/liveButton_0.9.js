document.addEventListener("DOMContentLoaded", () => {
  // Create propaganda link element if not exists
  let propagandaLink = document.querySelector(".propaganda-link");
  if (!propagandaLink) {
    propagandaLink = document.createElement('a');
    propagandaLink.className = 'propaganda-link';
    propagandaLink.href = '#';
    document.body.appendChild(propagandaLink);
  }

  // Create modal structure
  document.body.insertAdjacentHTML("beforeend", `
    <div id="liveModal" class="popup-player-container" style="display: none;">
      <div class="video-popup">
        <iframe id="liveFrame" 
                width="100%" 
                height="100%"
                frameborder="0" 
                allow="autoplay; fullscreen"
                sandbox="allow-scripts allow-same-origin">
        </iframe>
        <div class="modal-controls">
          <button id="prevChannel">Previous</button>
          <button id="nextChannel">Next</button>
        </div>
      </div>
    </div>
  `);

  // Define elements after creation
  const liveModal = document.getElementById("liveModal");
  const liveFrame = document.getElementById("liveFrame");
  const prevButton = document.getElementById("prevChannel");
  const nextButton = document.getElementById("nextChannel");

  // Stream configuration
  const liveLinks = [
    "https://www.youtube.com/embed/P0jJhwPjyok?autoplay=1",
    "https://www.youtube.com/embed/dxW8kHl5Q_I?autoplay=1",
    "https://www.youtube.com/embed/ze9-ARjL-ZA?autoplay=1",
    "https://www.youtube.com/embed/QgyW9qjgIf4?autoplay=1",
    "https://www.youtube.com/embed/TCm9788Tb5g?autoplay=1",
    "https://www.youtube.com/embed/-DoaUyMGPWI?autoplay=1",
    "https://www.youtube.com/embed/2NWdFWp0XKE?autoplay=1",
    "https://www.youtube.com/embed/md9-jG4RzXs?autoplay=1",
    "https://www.youtube.com/embed/Sq0EYo_ZQVU?autoplay=1",
    "https://www.youtube.com/embed/EGAzxO851c4?autoplay=1",
    "https://www.youtube.com/embed/Kv-lO8aPOK8?autoplay=1",
    "https://www.youtube.com/embed/lvh6NLqKRfs?autoplay=1"
  ];

  let currentLinkIndex = 0;

  // Stream management functions
  function updateLiveStream() {
    try {
      let url = liveLinks[currentLinkIndex];
      if (url.includes("watch?v=")) {
        url = url.replace("watch?v=", "embed/") + "?autoplay=1";
      }
      liveFrame.src = url;
    } catch (error) {
      console.error('Stream error:', error);
    }
  }

  function handleNavigation(direction) {
    currentLinkIndex = (currentLinkIndex + direction + liveLinks.length) % liveLinks.length;
    updateLiveStream();
  }

  // Event handlers
  propagandaLink.addEventListener("click", (e) => {
    e.preventDefault();
    liveModal.style.display = "flex";
    updateLiveStream();
  });

  liveModal.addEventListener("click", (e) => {
    if (e.target === liveModal) {
      liveModal.style.display = "none";
      liveFrame.src = "";
    }
  });

  prevButton.addEventListener("click", () => handleNavigation(-1));
  nextButton.addEventListener("click", () => handleNavigation(1));

  // Keyboard controls
  document.addEventListener("keydown", (e) => {
    if (liveModal.style.display === "flex") {
      switch(e.key) {
        case 'ArrowLeft': handleNavigation(-1); break;
        case 'ArrowRight': handleNavigation(1); break;
        case 'Escape':
          liveModal.style.display = "none";
          liveFrame.src = "";
          break;
      }
    }
  });
});
