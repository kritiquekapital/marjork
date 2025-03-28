const vinylLink = document.querySelector(".vinyl-link");
const musicPlayer = document.getElementById("musicPlayer");
const musicFrame = document.getElementById("musicFrame");
const liveLinks2 = [
  "https://www.youtube.com/embed/L1Snj1Pt-Hs",
  "https://www.youtube.com/embed/_KztNIg4cvE",
  // ... rest of URLs (without autoplay parameter)
];

let currentLinkIndex2 = 0;
let isPlaying = false;
let isShuffling = false;
let originalOrder = [...liveLinks2];

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  musicFrame.src = `${liveLinks2[currentLinkIndex2]}?autoplay=0`;
  hideMusicPlayer();
});

function updateMusicSource(autoplay = true) {
  const baseUrl = liveLinks2[currentLinkIndex2];
  const url = `${baseUrl}?autoplay=${autoplay ? 1 : 0}`;
  
  if(musicFrame.src !== baseUrl) {
    musicFrame.src = url;
  }
  
  // Force play if needed
  if(autoplay && musicFrame.contentWindow) {
    musicFrame.contentWindow.postMessage({
      event: "command",
      func: "playVideo",
      args: ""
    }, "*");
  }
}

// Modified show function
function showMusicPlayer() {
  musicPlayer.classList.add("visible");
  musicPlayer.classList.remove("hidden");
  updateMusicSource(true); // Force autoplay on open
  isPlaying = true;
}

// Player Controls =======================
document.querySelector(".playpause").addEventListener("click", () => {
  isPlaying = !isPlaying;
  musicFrame.contentWindow.postMessage({
    event: "command",
    func: isPlaying ? "playVideo" : "pauseVideo",
    args: ""
  }, "*");
});

// Modified navigation controls
document.querySelector(".prev-btn").addEventListener("click", () => {
  currentLinkIndex2 = (currentLinkIndex2 - 1 + liveLinks2.length) % liveLinks2.length;
  updateMusicSource(isPlaying); // Maintain play state
});

document.querySelector(".next-btn").addEventListener("click", () => {
  currentLinkIndex2 = (currentLinkIndex2 + 1) % liveLinks2.length;
  updateMusicSource(isPlaying); // Maintain play state
});

// Shuffle with autoplay maintenance
function shuffleLinks() {
  if(isShuffling) {
    for(let i = liveLinks2.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [liveLinks2[i], liveLinks2[j]] = [liveLinks2[j], liveLinks2[i]];
    }
  } else {
    liveLinks2.splice(0, liveLinks2.length, ...originalOrder);
  }
  currentLinkIndex2 = 0;
  updateMusicSource(isPlaying); // Maintain play state
}
