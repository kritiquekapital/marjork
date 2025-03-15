document.addEventListener("DOMContentLoaded", () => {
  const liveModal = document.getElementById("liveModal");
  const liveFrame = document.getElementById("liveFrame");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  
  if (!liveModal || !liveFrame) {
    console.error("Live modal or iframe not found!");
    return;
  }

  const liveLinks1 = [
    "https://www.youtube.com/embed/P0jJhwPjyok?autoplay=1",
    "https://www.youtube.com/embed/2NWdFWp0XKE?autoplay=1&mute=1",
    "https://www.youtube.com/embed/dxW8kHl5Q_I?autoplay=1",
    "https://www.youtube.com/embed/-DoaUyMGPWI?autoplay=1",
    "https://www.youtube.com/embed/EGAzxO851c4?autoplay=1",
    "https://www.youtube.com/embed/T2IaJwkqgPk?autoplay=1",
    "https://www.youtube.com/embed/Kv-lO8aPOK8?autoplay=1",
    "https://www.youtube.com/embed/lvh6NLqKRfs?autoplay=1"
  ];

  let currentLinkIndex1 = 0;

  function updateLiveStream() {
    let url = liveLinks1[currentLinkIndex1];
    if (url.includes("watch?v=")) {
      url = url.replace("watch?v=", "embed/") + "?autoplay=1";
    }
    console.log("Updating iframe src to:", url);
    liveFrame.src = url;
  }

  // Modal open functionality
  const propagandaLink = document.querySelector(".propaganda-link");
  if (propagandaLink) {
    propagandaLink.addEventListener("click", (event) => {
      event.preventDefault();
      updateLiveStream();
      liveModal.style.visibility = "visible";
      liveModal.style.display = "flex";
    });
  }

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === liveModal) {
      liveModal.style.visibility = "hidden";
      liveModal.style.display = "none";
      liveFrame.src = "";
    }
  });

  // Previous and Next buttons for cycling through streams
  prevButton.addEventListener("click", () => {
    currentLinkIndex1 = (currentLinkIndex1 - 1 + liveLinks1.length) % liveLinks1.length;
    updateLiveStream();
  });

  nextButton.addEventListener("click", () => {
    currentLinkIndex1 = (currentLinkIndex1 + 1) % liveLinks1.length;
    updateLiveStream();
  });

  // Vinyl Button interactions
  const vinylLink = document.querySelector(".vinyl-link");
  if (vinylLink) {
    vinylLink.addEventListener("click", (event) => {
      event.preventDefault();
      const newTab = window.open(liveLinks2[currentLinkIndex2], "_blank");
      if (newTab) newTab.blur();
      currentLinkIndex2 = (currentLinkIndex2 + 1) % liveLinks2.length;
    });
  }

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

  // Kiss Button functionality
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
      loveMessage.classList.add("kiss-message");
      kissButton.appendChild(loveMessage);
      setTimeout(() => kissButton.removeChild(loveMessage), 1600);
    });
  }

  const badgeLabels = document.querySelectorAll("label.ytp-suggested-action-badge-title");
  badgeLabels.forEach((badge, index) => {
    badge.id = `ytp-suggested-action-badge-title-${Date.now()}-${index}`;
  });

  const playlistCheckboxes = document.querySelectorAll("input.ytp-share-panel-include-playlist-checkbox");
  playlistCheckboxes.forEach((checkbox, index) => {
    checkbox.id = `ytp-share-panel-include-playlist-checkbox-${Date.now()}-${index}`;
  });
});
