document.addEventListener("DOMContentLoaded", () => {
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

  function updateLiveStream() {
    if (!liveFrame) return;

    let url = liveLinks1[currentLinkIndex1];

    // Ensure proper embed URL format
    if (url.includes("watch?v=")) {
      url = url.replace("watch?v=", "embed/") + "?autoplay=1";
    }

    console.log("Updating iframe src to:", url); // Debugging
    liveFrame.src = url;
  }

  if (propagandaLink) {
    propagandaLink.addEventListener("click", (event) => {
      event.preventDefault();
      updateLiveStream();
      liveModal.style.visibility = "visible";
      liveModal.style.display = "flex";
    });
  }

  window.addEventListener("click", (event) => {
    if (event.target === liveModal) {
      liveModal.style.visibility = "hidden";
      liveModal.style.display = "none";
      liveFrame.src = ""; // Stop playback
    }
  });

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      currentLinkIndex1 = (currentLinkIndex1 - 1 + liveLinks1.length) % liveLinks1.length;
      console.log("Previous clicked, new index:", currentLinkIndex1); // Debugging
      updateLiveStream();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      currentLinkIndex1 = (currentLinkIndex1 + 1) % liveLinks1.length;
      console.log("Next clicked, new index:", currentLinkIndex1); // Debugging
      updateLiveStream();
    });
  }
});
