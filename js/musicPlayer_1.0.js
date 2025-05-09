import { Draggable } from './draggable.js';

// Create overlay
const overlay = document.createElement('div');
overlay.className = 'music-overlay';
document.body.appendChild(overlay);

// MUSIC PLAYER
const vinylLink = document.querySelector(".vinyl-link");
const musicPlayer = document.getElementById("musicPlayer");
const musicFrame = document.getElementById("musicFrame");

new Draggable(musicPlayer, '.ipod-screen');

const liveLinks2 = [
  { title: "Candy", url: "https://www.youtube.com/embed/x3xYXGMRRYk?autoplay=1" },
  { title: "Avatar's Love", url: "https://www.youtube.com/embed/-JH5X_-Px-4?autoplay=1" },
  { title: "Плачу на техно", url: "https://www.youtube.com/embed/L1Snj1Pt-Hs?autoplay=1" },
  { title: "Gypsy Woman", url: "https://www.youtube.com/embed/_KztNIg4cvE?autoplay=1" },
  { title: "Volga", url: "https://www.youtube.com/embed/_6rUeOCm7S0?autoplay=1" },
  { title: "но останься", url: "https://www.youtube.com/embed/__xsCTe9dTQ?autoplay=1" },
  { title: "False Sympathy", url: "https://www.youtube.com/embed/B6Y-WsgpzlQ?autoplay=1" },
  { title: "Lost", url: "https://www.youtube.com/embed/6riDJMI-Y8U?autoplay=1" },
  { title: "Renegades", url: "https://www.youtube.com/embed/PPoH0Gn50Nc?autoplay=1" },
  { title: "Let Me", url: "https://www.youtube.com/embed/taCRBFkUqdM?autoplay=1" },
  { title: "Loosen Up", url: "https://www.youtube.com/embed/y1TNuHPSBXI?autoplay=1" },
  { title: "SnSORRY", url: "https://www.youtube.com/embed/LSIOcCcEVaE?autoplay=1" },
  { title: "Sunshine", url: "https://www.youtube.com/embed/BpqOWO6ctsg?autoplay=1" },
  { title: "Fam", url: "https://www.youtube.com/embed/iYTz6lr8JY8?autoplay=1" },
  { title: "Cult", url: "https://www.youtube.com/embed/7xxgRUyzgs0?autoplay=1" },
  { title: "Mass", url: "https://www.youtube.com/embed/G4CKmzBf5Cs?autoplay=1" },
  { title: "Potage", url: "https://www.youtube.com/embed/-rZWdolJfgk?autoplay=1" },
  { title: "Absolutely", url: "https://www.youtube.com/embed/FEkOYs6aWIg?autoplay=1" },
  { title: "María", url: "https://www.youtube.com/embed/I067BonnW48?autoplay=1" },
  { title: "Like Kant", url: "https://www.youtube.com/embed/V7IUtUsfARA?autoplay=1" },
  { title: "Doomer", url: "https://www.youtube.com/embed/x4ygVwbOyJU?autoplay=1" },
  { title: "Seaside", url: "https://www.youtube.com/embed/3NrZCJh2Hgk?autoplay=1" },
  { title: "kiss me", url: "https://www.youtube.com/embed/cYpQ36acEUU?autoplay=1" },
  { title: "forfeit", url: "https://www.youtube.com/embed/wfj26-cQkx8?autoplay=1" },
  { title: "safety", url: "https://www.youtube.com/embed/SMIQbo-61P4?autoplay=1" }
];

let isFirstOpen = true;
let isPlaying = true;
let isPinned = false;
let isShuffling = false;
let currentPlaylist = [...liveLinks2];
let currentIndex = 0;

// Controls
const controlsContainer = document.querySelector(".ipod-controls");

// 📌 Pin
const pinButton = document.createElement("button");
pinButton.classList.add("ipod-btn", "pin-btn");
pinButton.innerHTML = "📌";
controlsContainer.prepend(pinButton);

// 🔀 Shuffle
const prevButton = document.querySelector(".prev-btn");
const shuffleButton = document.createElement("button");
shuffleButton.classList.add("ipod-btn", "shuffle-btn");
shuffleButton.innerHTML = "🔀";
prevButton.parentNode.insertBefore(shuffleButton, prevButton);

// Show/hide
function showMusicPlayer() {
  if (isFirstOpen) {
    updateMusicSource();
    isFirstOpen = false;
    updateButtonStates();
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

document.addEventListener("click", (event) => {
  if (!musicPlayer.contains(event.target) && !vinylLink.contains(event.target)) {
    hideMusicPlayer();
  }
});

vinylLink.addEventListener("click", (event) => {
  event.preventDefault();
  showMusicPlayer();
});

pinButton.addEventListener("click", () => {
  isPinned = !isPinned;
  updateButtonStates();
});

shuffleButton.addEventListener("click", () => {
  isShuffling = !isShuffling;
  isShuffling ? shufflePlaylist() : resetPlaylist();
  updateButtonStates();
});

function updateButtonStates() {
  pinButton.style.opacity = isPinned ? "1" : "0.5";
  shuffleButton.style.opacity = isShuffling ? "1" : "0.5";
}

function shufflePlaylist() {
  currentPlaylist = [...liveLinks2].sort(() => Math.random() - 0.5);
  currentIndex = 0;
}

function resetPlaylist() {
  currentPlaylist = [...liveLinks2];
  currentIndex = 0;
}

function updateMusicSource() {
  musicFrame.src = currentPlaylist[currentIndex].url;
}

function togglePlayState() {
  isPlaying = !isPlaying;
  musicFrame.contentWindow.postMessage({
    event: "command",
    func: isPlaying ? "playVideo" : "pauseVideo",
    args: ""
  }, "*");
}

function nextTrack() {
  currentIndex = (currentIndex + 1) % currentPlaylist.length;
  updateMusicSource();
  if (!isPlaying) togglePlayState();
}

function prevTrack() {
  currentIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
  updateMusicSource();
  if (!isPlaying) togglePlayState();
}

document.querySelector(".next-btn").addEventListener("click", nextTrack);
prevButton.addEventListener("click", prevTrack);
document.querySelector(".playpause").addEventListener("click", togglePlayState);

// Dropdown menu
const menuButton = document.createElement("button");
menuButton.classList.add("ipod-btn", "menu-btn");
menuButton.innerHTML = "📜";
controlsContainer.appendChild(menuButton);

const dropdownMenu = document.createElement("ul");
dropdownMenu.classList.add("dropdown-menu");
dropdownMenu.style.display = "none";
dropdownMenu.style.maxHeight = "50px";
dropdownMenu.style.overflowY = "auto";
menuButton.appendChild(dropdownMenu);

liveLinks2.forEach((track, index) => {
  const listItem = document.createElement("li");
  listItem.textContent = track.title;
  listItem.style.padding = "5px";
  listItem.style.cursor = "pointer";
  listItem.addEventListener("click", () => {
    currentIndex = index;
    updateMusicSource();
    dropdownMenu.style.display = "none";
  });
  dropdownMenu.appendChild(listItem);
});

menuButton.addEventListener("click", (event) => {
  event.stopPropagation();
  dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
});

window.addEventListener("message", (event) => {
  if (event.data?.event === "onStateChange" && event.data.info === 0) {
    nextTrack();
  }
});

// VIDEO PLAYER (rebuilt, like music player)
const videoPlayer = document.getElementById("videoPlayer");
const videoFrame = document.getElementById("videoFrame");
const videoPrev = document.getElementById("videoPrev");
const videoNext = document.getElementById("videoNext");
const videoPin = document.getElementById("videoPin");
const propagandaLink = document.querySelector(".propaganda-link");

const videoLinks = [
  { title: "Hairpin Circus", url: "https://www.youtube.com/embed/P0jJhwPjyok?autoplay=1" },
  { title: "Crack", url: "https://www.youtube.com/embed/dxW8kHl5Q_I?autoplay=1" },
  { title: "Harmony", url: "https://www.youtube.com/embed/ze9-ARjL-ZA?autoplay=1" },
  { title: "JRJR", url: "https://www.youtube.com/embed/QgyW9qjgIf4?autoplay=1" },
  { title: "USSR", url: "https://www.youtube.com/embed/w72mLI_FaR0?autoplay=1" },
  { title: "Drive", url: "https://www.youtube.com/embed/TCm9788Tb5g?autoplay=1" },
  { title: "Fight", url: "https://www.youtube.com/embed/-DoaUyMGPWI?autoplay=1" },
  { title: "MNR", url: "https://www.youtube.com/embed/rnvSs3HEz2o?autoplay=1" }
];

let videoIndex = 0;
let videoPinned = false;
const videoDraggable = new Draggable(videoPlayer);

function updateVideoSource() {
  videoFrame.src = videoLinks[videoIndex].url;
}

function showVideoPlayer() {
  updateVideoSource();
  videoPlayer.style.display = "block";

  // Bring to front
  videoPlayer.style.zIndex = "999";
  videoPlayer.style.opacity = "1";
}

// Click outside to hide video player (unless pinned)
document.addEventListener("click", (e) => {
  const clickedInside = videoPlayer.contains(e.target) || e.target.closest(".propaganda-link");
  if (!clickedInside && !videoPinned) {
    videoPlayer.style.display = "none";
  }
});


videoNext.addEventListener("click", () => {
  videoIndex = (videoIndex + 1) % videoLinks.length;
  updateVideoSource();
});

videoPrev.addEventListener("click", () => {
  videoIndex = (videoIndex - 1 + videoLinks.length) % videoLinks.length;
  updateVideoSource();
});

videoPin.addEventListener("click", () => {
  videoPinned = !videoPinned;
  videoPin.style.opacity = videoPinned ? "1" : "0.5";
});

if (propagandaLink) {
  propagandaLink.addEventListener("click", (e) => {
    e.preventDefault();
    showVideoPlayer();
  });
}
