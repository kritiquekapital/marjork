const vinylLink = document.querySelector(".vinyl-link");
const musicPlayer = document.getElementById("musicPlayer");
const musicFrame = document.getElementById("musicFrame");
const miniMusicFrame = document.getElementById("miniMusicFrame"); // Must exist in HTML
const liveLinks2 = [/* Your YouTube links array */];

let currentLinkIndex2 = 0;
let isPlaying = true;
let isShuffling = false;

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  updateMusicSource();
  hideMusicPlayer();
});

// Core Functions ========================
function updateMusicSource() {
  const url = liveLinks2[currentLinkIndex2];
  if(musicFrame) musicFrame.src = url;
  if(miniMusicFrame) miniMusicFrame.src = url;
}

function shuffleLinks() {
  liveLinks2 = isShuffling ? 
    [...liveLinks2].sort(() => Math.random() - 0.5) : 
    [...liveLinks2].sort((a, b) => liveLinks2.indexOf(a) - liveLinks2.indexOf(b));
  updateMusicSource();
}

// Visibility Control ====================
function showMusicPlayer() {
  musicPlayer.classList.add("visible");
  musicPlayer.classList.remove("hidden");
}

function hideMusicPlayer() {
  musicPlayer.classList.remove("visible");
  musicPlayer.classList.add("hidden");
}

// Event Listeners =======================
vinylLink.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  showMusicPlayer();
  updateMusicSource();
});

document.addEventListener("click", (event) => {
  if(!musicPlayer.contains(event.target) && 
     !vinylLink.contains(event.target) &&
     !document.querySelector(".minimized-player").contains(event.target)) {
    hideMusicPlayer();
  }
});

// Player Controls =======================
document.querySelector(".playpause").addEventListener("click", () => {
  isPlaying = !isPlaying;
  const action = isPlaying ? "playVideo" : "pauseVideo";
  [musicFrame, miniMusicFrame].forEach(frame => {
    frame?.contentWindow?.postMessage(
      `{"event":"command","func":"${action}","args":""}`,
      "*"
    );
  });
});

document.querySelector(".prev-btn").addEventListener("click", () => {
  currentLinkIndex2 = (currentLinkIndex2 - 1 + liveLinks2.length) % liveLinks2.length;
  updateMusicSource();
});

document.querySelector(".next-btn").addEventListener("click", () => {
  currentLinkIndex2 = (currentLinkIndex2 + 1) % liveLinks2.length;
  updateMusicSource();
});

document.querySelector(".shuffle-btn").addEventListener("click", () => {
  isShuffling = !isShuffling;
  shuffleLinks();
});

// Mini Player Controls ==================
document.querySelector(".menu-btn").addEventListener("click", () => {
  hideMusicPlayer();
  document.querySelector(".minimized-player").style.display = "block";
});

document.querySelector(".minimized-player").addEventListener("click", () => {
  showMusicPlayer();
  document.querySelector(".minimized-player").style.display = "none";
});
