document.addEventListener("DOMContentLoaded", () => {
  // Hardcoded list of live links for the Propaganda Button
  const liveLinks1 = [
    "https://www.youtube.com/embed/P0jJhwPjyok?autoplay=1", // hairpin circus
    "https://www.youtube.com/embed/dxW8kHl5Q_I?autoplay=1", // crack
    "https://www.youtube.com/embed/ze9-ARjL-ZA?autoplay=1", // overwhelming and collective harmony
    "https://www.youtube.com/embed/QgyW9qjgIf4?autoplay=1", // JRJRJRJRJRJRJRJRJRJRJRJRJR
    "https://www.youtube.com/embed/TCm9788Tb5g?autoplay=1", // drive
    "https://www.youtube.com/embed/-DoaUyMGPWI?autoplay=1", // fight
    "https://www.youtube.com/embed/2NWdFWp0XKE?autoplay=1", // la souf
    "https://www.youtube.com/embed/md9-jG4RzXs?autoplay=1", // Prix
    "https://www.youtube.com/embed/Sq0EYo_ZQVU?autoplay=1", // SocWen
    "https://www.youtube.com/embed/EGAzxO851c4?autoplay=1", // fata
    "https://www.youtube.com/embed/Kv-lO8aPOK8?autoplay=1", // tokyo
    "https://www.youtube.com/embed/lvh6NLqKRfs?autoplay=1"  // bob
  ];

  let currentLinkIndex1 = 0;

  // Function to update the live stream
  function updateLiveStream() {
    let url = liveLinks1[currentLinkIndex1];
    if (url.includes("watch?v=")) {
      url = url.replace("watch?v=", "embed/") + "?autoplay=1";
    }
    liveFrame.src = url;
  }

  // Inject the modal HTML structure into the DOM
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

  // Get references to the modal and its elements
  const liveModal = document.getElementById("liveModal");
  const liveFrame = document.getElementById("liveFrame");
  const prevButton = document.getElementById("prevChannel");
  const nextButton = document.getElementById("nextChannel");
  const propagandaLink = document.querySelector(".propaganda-link");

  // Handle click on the "LIVE" button
  if (propagandaLink) {
    propagandaLink.addEventListener("click", (event) => {
      event.preventDefault();
      updateLiveStream(); // Update the live stream URL
      liveModal.style.visibility = "visible"; // Show the modal
      liveModal.style.display = "flex";
    });
  }

  // Close the modal when clicking outside of it
  window.addEventListener("click", (event) => {
    if (event.target === liveModal) {
      liveModal.style.visibility = "hidden"; // Hide the modal
      liveModal.style.display = "none";
      liveFrame.src = ""; // Stop the video
    }
  });

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
});
