const liveLinks1 = [
  "https://www.youtube.com/embed/H999s0P1Er0?autoplay=1",
  // Add other live stream links
];

let currentLinkIndex1 = 0;

function updateLiveStream() {
  let url = liveLinks1[currentLinkIndex1];
  if (url.includes("watch?v=")) {
    url = url.replace("watch?v=", "embed/") + "?autoplay=1";
  }
  liveFrame.src = url;
}

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

if (propagandaLink) {
  propagandaLink.addEventListener("click", (event) => {
    event.preventDefault();
    updateLiveStream();
    liveModal.style.visibility = "visible";
    liveModal.style.display = "flex";
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
