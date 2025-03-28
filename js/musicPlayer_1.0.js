import { Draggable } from './draggable.js';

// Overlay
const overlay = document.createElement('div');
overlay.className = 'music-overlay';
document.body.appendChild(overlay);

// Elements
const vinylLink = document.querySelector(".vinyl-link");
const musicPlayer = document.getElementById("musicPlayer");
const musicFrame = document.getElementById("musicFrame");

// Make entire module draggable
new Draggable(musicPlayer, '.ipod-screen'); 

// Video Links
const liveLinks2 = [
  "https://www.youtube.com/embed/L1Snj1Pt-Hs?autoplay=1",
  "https://www.youtube.com/embed/_KztNIg4cvE?autoplay=1",
  "https://www.youtube.com/embed/_6rUeOCm7S0?autoplay=1",
];

let isFirstOpen = true;
let currentLinkIndex2 = 0;
let isPlaying = true;
let isPinned = false; // Default: Player can hide

// Create pin button
const pinButton = document.createElement("button");
pinButton.classList.add("ipod-btn", "pin-btn");
pinButton.innerHTML = "📌";
document.querySelector(".ipod-controls").prepend(pinButton);

function updatePinState() {
  isPinned = !isPinned;
  pinButton.style.opacity = isPinned ? "1" : "0.5";
}

// Player Visibility
function showMusicPlayer() {
  if (isFirstOpen) {
    updateMusicSource();
    isFirstOpen = false;
  }
  musicPlayer.style.display = "block";
  overlay.style.display = "block";
}

function hideMusicPlayer() {
  if (!isPinned) {
    musicPlayer.style.display = "none";
    overlay.style.display = "none";
  }
}

// Click outside to hide (only if not pinned)
overlay.addEventListener("click", () => {
  hideMusicPlayer();
});

// Event Listeners
vinylLink.addEventListener("click", (event) => {
  event.preventDefault();
  showMusicPlayer();
});

pinButton.addEventListener("click", updatePinState);

// Music Controls
function updateMusicSource() {
  musicFrame.src = liveLinks2[currentLinkIndex2];
}

function togglePlayState() {
  isPlaying = !isPlaying;
  musicFrame.contentWindow.postMessage({
    event: "command",
    func: isPlaying ? "playVideo" : "pauseVideo",
    args: ""
  }, "*");
}

document.querySelector(".playpause").addEventListener("click", togglePlayState);
document.querySelector(".prev-btn").addEventListener("click", () => {
  currentLinkIndex2 = (currentLinkIndex2 - 1 + liveLinks2.length) % liveLinks2.length;
  updateMusicSource();
  if (!isPlaying) togglePlayState();
});

document.querySelector(".next-btn").addEventListener("click", () => {
  currentLinkIndex2 = (currentLinkIndex2 + 1) % liveLinks2.length;
  updateMusicSource();
  if (!isPlaying) togglePlayState();
});
