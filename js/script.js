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

  let currentLinkIndex1 = 0;
  let currentLinkIndex2 = 0;
  let manualOverride = false; // Flag to disable auto-next when manual navigation occurs

  // Function to update live stream
  function updateLiveStream() {
    let url = liveLinks1[currentLinkIndex1];
    if (url.includes("watch?v=")) {
      url = url.replace("watch?v=", "embed/") + "?autoplay=1";
    }
    console.log("Updating iframe src to:", url);
    showTVFuzz();  // Show TV fuzz overlay during transition
    liveFrame.src = url;
  }

  // TV Fuzz Overlay: displays an overlay over the video area (inside .video-popup) for 2 seconds
  function showTVFuzz() {
    const videoPopup = document.querySelector(".video-popup");
    if (!videoPopup) return;
    const fuzzOverlay = document.createElement("div");
    fuzzOverlay.classList.add("tv-fuzz-overlay");
    // Style to cover the video area only
    fuzzOverlay.style.position = "absolute";
    fuzzOverlay.style.top = "0";
    fuzzOverlay.style.left = "0";
    fuzzOverlay.style.width = "100%";
    fuzzOverlay.style.height = "100%";
    fuzzOverlay.style.background = "url('https://media.giphy.com/media/3o7aCTfyhYawdOXcFW/giphy.gif')";
    fuzzOverlay.style.backgroundSize = "cover";
    fuzzOverlay.style.opacity = "0.8";
    fuzzOverlay.style.pointerEvents = "none";
    fuzzOverlay.style.zIndex = "10";
    videoPopup.appendChild(fuzzOverlay);
    setTimeout(() => { fuzzOverlay.remove(); }, 2000);
  }

  // Inject modal HTML structure
  document.body.insertAdjacentHTML("beforeend", `
    <div id="liveModal" class="popup-player-container" style="visibility: hidden;">
      <div class="video-popup" style="position: relative;">
        <iframe id="liveFrame" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
        <div class="modal-controls">
          <button id="prevChannel">Previous</button>
          <button id="nextChannel">Next</button>
        </div>
      </div>
    </div>
    <style>\n      /* TV Fuzz Overlay base style (if needed, additional CSS can go here) */\n      .tv-fuzz-overlay { }\n    </style>\n  `);

  const liveModal = document.getElementById("liveModal");
  const liveFrame = document.getElementById("liveFrame");
  const prevButton = document.getElementById("prevChannel");
  const nextButton = document.getElementById("nextChannel");
  const propagandaLink = document.querySelector(".propaganda-link");

  // Handle click on the "LIVE" button
  if (propagandaLink) {
    propagandaLink.addEventListener("click", (event) => {
      event.preventDefault();
      updateLiveStream();
      liveModal.style.visibility = "visible";
      liveModal.style.display = "flex";
    });
  }

  // Close modal when clicking outside the video popup
  window.addEventListener("click", (event) => {
    if (event.target === liveModal) {
      liveModal.style.visibility = "hidden";
      liveModal.style.display = "none";
      liveFrame.src = "";
    }
  });

  // Manual channel switching with manual override flag
  prevButton.addEventListener("click", () => {
    manualOverride = true;
    setTimeout(() => { manualOverride = false; }, 3000);
    currentLinkIndex1 = (currentLinkIndex1 - 1 + liveLinks1.length) % liveLinks1.length;
    updateLiveStream();
  });

  nextButton.addEventListener("click", () => {
    manualOverride = true;
    setTimeout(() => { manualOverride = false; }, 3000);
    currentLinkIndex1 = (currentLinkIndex1 + 1) % liveLinks1.length;
    updateLiveStream();
  });

  // Auto-next: when the video ends, load the next video (if not manually overridden)
  liveFrame.addEventListener("load", () => {
    liveFrame.contentWindow.postMessage('{"event":"listening","id":1}', '*');
  });

  window.addEventListener("message", (event) => {
    if (typeof event.data === "string" && event.data.includes('"event":"onStateChange"')) {
      try {
        const data = JSON.parse(event.data);
        // Only auto-next if video ended (state 0) and manualOverride is false
        if (!manualOverride && data.event === "onStateChange" && data.info === 0) {
          currentLinkIndex1 = (currentLinkIndex1 + 1) % liveLinks1.length;
          updateLiveStream();
        }
      } catch (e) {
        console.error(e);
      }
    }
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
      arm.style.transform = "rotate(290deg)"; // Quick jump
      setTimeout(() => {
        arm.style.transition = "transform 5s ease-out";
        arm.style.transform = "rotate(322deg)"; // Smooth rotation
      }, 200);
    });
    vinylButton.addEventListener("mouseleave", () => {
      arm.style.transition = "transform 0.5s ease-in";
      arm.style.transform = "rotate(270deg)"; // Reset position
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

  // Fix duplicate IDs on label elements
  const badgeLabels = document.querySelectorAll("label.ytp-suggested-action-badge-title");
  badgeLabels.forEach((badge, index) => {
    badge.id = `ytp-suggested-action-badge-title-${Date.now()}-${index}`;
    console.log("Modified label element ID:", badge.id);
  });

  // Fix duplicate IDs on input elements
  const playlistCheckboxes = document.querySelectorAll("input.ytp-share-panel-include-playlist-checkbox");
  playlistCheckboxes.forEach((checkbox, index) => {
    checkbox.id = `ytp-share-panel-include-playlist-checkbox-${Date.now()}-${index}`;
    console.log("Modified input element ID:", checkbox.id);
  });
});
