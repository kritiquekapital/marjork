import { Draggable } from './draggable.js';

// Create overlay
const overlay = document.createElement('div');
overlay.className = 'music-overlay';
document.body.appendChild(overlay);

// Elements
const vinylLink = document.querySelector(".vinyl-link");
const musicPlayer = document.getElementById("musicPlayer");
const musicFrame = document.getElementById("musicFrame");

// Draggable (entire player)
new Draggable(musicPlayer, '.ipod-screen');

// Video Links
const liveLinks2 = [
  { title: "Candy", url: "https://www.youtube.com/embed/x3xYXGMRRYk?autoplay=1" },
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
  { title: "miss u", url: "https://www.youtube.com/embed/cYpQ36acEUU?autoplay=1" },
  { title: "forfeit", url: "https://www.youtube.com/embed/wfj26-cQkx8?autoplay=1" },
  { title: "safety", url: "https://www.youtube.com/embed/SMIQbo-61P4?autoplay=1" }
];

let isFirstOpen = true;
let isPlaying = true;
let isPinned = false;
let isShuffling = false;
let currentPlaylist = [...liveLinks2];  // Default order
let currentIndex = 0;

// 🎵 Buttons
const controlsContainer = document.querySelector(".ipod-controls");

// 📌 Pin Button
const pinButton = document.createElement("button");
pinButton.classList.add("ipod-btn", "pin-btn");
pinButton.innerHTML = "📌";
controlsContainer.prepend(pinButton);

// 🔀 Shuffle Button
const prevButton = document.querySelector(".prev-btn");
const shuffleButton = document.createElement("button");
shuffleButton.classList.add("ipod-btn", "shuffle-btn");
shuffleButton.innerHTML = "🔀";
prevButton.parentNode.insertBefore(shuffleButton, prevButton);

// 📌 Show Player
function showMusicPlayer() {
  if (isFirstOpen) {
    updateMusicSource();
    isFirstOpen = false;
    updateButtonStates();
  }
  musicPlayer.style.display = "block";
  overlay.style.display = "block";
}

// ❌ Hide Player (only if not pinned)
function hideMusicPlayer() {
  if (!isPinned) {
    musicPlayer.style.display = "none";
    overlay.style.display = "none";
  }
}

// 🖱 Click Outside to Hide (Unless Pinned)
document.addEventListener("click", (event) => {
  if (!musicPlayer.contains(event.target) && !vinylLink.contains(event.target)) {
    hideMusicPlayer();
  }
});

// ✅ Vinyl Click to Open
vinylLink.addEventListener("click", (event) => {
  event.preventDefault();
  showMusicPlayer();
});

// 📌 Pin Button Click
pinButton.addEventListener("click", () => {
  isPinned = !isPinned;
  updateButtonStates();
});

// 🔀 Shuffle Button Click
shuffleButton.addEventListener("click", () => {
  isShuffling = !isShuffling;
  if (isShuffling) {
    shufflePlaylist();
  } else {
    resetPlaylist();
  }
  updateButtonStates();
});

// 🎵 Update Button Opacity
function updateButtonStates() {
  pinButton.style.opacity = isPinned ? "1" : "0.5";
  shuffleButton.style.opacity = isShuffling ? "1" : "0.5";
}

// 🎵 Shuffle Algorithm (Plays All Before Repeating)
function shufflePlaylist() {
  currentPlaylist = [...liveLinks2].sort(() => Math.random() - 0.5);
  currentIndex = 0;
}

// 🎵 Reset to Normal Order
function resetPlaylist() {
  currentPlaylist = [...liveLinks2];
  currentIndex = 0;
}

// 🎵 Update Music Source
function updateMusicSource() {
  musicFrame.src = currentPlaylist[currentIndex].url;  // Ensure only the URL is assigned
}

// 🎵 Play/Pause Toggle
function togglePlayState() {
  isPlaying = !isPlaying;
  musicFrame.contentWindow.postMessage({
    event: "command",
    func: isPlaying ? "playVideo" : "pauseVideo",
    args: ""
  }, "*");
}

// 🎵 Next Track
function nextTrack() {
  currentIndex = (currentIndex + 1) % currentPlaylist.length;
  updateMusicSource();
  if (!isPlaying) togglePlayState();
}

// 🎵 Previous Track
function prevTrack() {
  currentIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
  updateMusicSource();
  if (!isPlaying) togglePlayState();
}

// 🎵 Button Listeners
document.querySelector(".next-btn").addEventListener("click", nextTrack);
prevButton.addEventListener("click", prevTrack);
document.querySelector(".playpause").addEventListener("click", togglePlayState);

// 🎵 Menu Button (Right Side, Dropdown)
const menuButton = document.createElement("button");
menuButton.classList.add("ipod-btn", "menu-btn");
menuButton.innerHTML = "📜";
controlsContainer.appendChild(menuButton);

// 🎵 Dropdown Menu
const dropdownMenu = document.createElement("ul");
dropdownMenu.classList.add("dropdown-menu");
dropdownMenu.style.display = "none";
dropdownMenu.style.maxHeight = "150px";
dropdownMenu.style.overflowY = "auto";
document.body.appendChild(dropdownMenu);

// Populate Dropdown
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

// Toggle Dropdown Menu
menuButton.addEventListener("click", (event) => {
  event.stopPropagation();
  const rect = menuButton.getBoundingClientRect();
  dropdownMenu.style.top = `${rect.bottom + window.scrollY}px`;  // Position based on button's bottom
  dropdownMenu.style.left = `${rect.left + window.scrollX}px`;  // Align left of button
  dropdownMenu.classList.toggle("show");  // Toggle visibility
});

// 🎵 Play Next Video When Current One Ends
window.addEventListener("message", (event) => {
  if (event.data?.event === "onStateChange" && event.data.info === 0) {
    nextTrack();
  }
});
