// musicPlayer_1.0.js

// 1. Create overlay first
const overlay = document.createElement('div');
overlay.className = 'music-overlay';
document.body.appendChild(overlay);

// 2. Declare other elements
const vinylLink = document.querySelector(".vinyl-link");
const musicPlayer = document.getElementById("musicPlayer");
const musicFrame = document.getElementById("musicFrame");
const liveLinks2 = [
  "https://www.youtube.com/embed/L1Snj1Pt-Hs?autoplay=1",  //Плачу на техно
  "https://www.youtube.com/embed/_KztNIg4cvE?autoplay=1",  //Gypsy Woman
  "https://www.youtube.com/embed/_6rUeOCm7S0?autoplay=1",  //Volga
  "https://www.youtube.com/embed/__xsCTe9dTQ?autoplay=1",  //но останься
  "https://www.youtube.com/embed/B6Y-WsgpzlQ?autoplay=1",  //False Sympathy
  "https://www.youtube.com/embed/6riDJMI-Y8U?autoplay=1",  //Lost
  "https://www.youtube.com/embed/PPoH0Gn50Nc?autoplay=1",  //Renegades
  "https://www.youtube.com/embed/taCRBFkUqdM?autoplay=1",  //Let Me
  "https://www.youtube.com/embed/y1TNuHPSBXI?autoplay=1",  //Loosen Up
  "https://www.youtube.com/embed/LSIOcCcEVaE?autoplay=1",  //SnSORRY
  "https://www.youtube.com/embed/BpqOWO6ctsg?autoplay=1",  //Sunshine
  "https://www.youtube.com/embed/iYTz6lr8JY8?autoplay=1",  //Fam
  "https://www.youtube.com/embed/7xxgRUyzgs0?autoplay=1",  //Cult
  "https://www.youtube.com/embed/G4CKmzBf5Cs?autoplay=1",  //Mass
  "https://www.youtube.com/embed/-rZWdolJfgk?autoplay=1",  //Potage
  "https://www.youtube.com/embed/FEkOYs6aWIg?autoplay=1",  //Absolutely
  "https://www.youtube.com/embed/I067BonnW48?autoplay=1",  //María
  "https://www.youtube.com/embed/V7IUtUsfARA?autoplay=1",  //Like Kant
  "https://www.youtube.com/embed/x4ygVwbOyJU?autoplay=1",  //Doomer
  "https://www.youtube.com/embed/3NrZCJh2Hgk?autoplay=1",  //Seaside
  "https://www.youtube.com/embed/cYpQ36acEUU?autoplay=1",  //miss u
  "https://www.youtube.com/embed/wfj26-cQkx8?autoplay=1",  //forfeit
  "https://www.youtube.com/embed/SMIQbo-61P4?autoplay=1",  //saftey
];

// 3. State variables
let isFirstOpen = true;
let currentLinkIndex2 = 0;
let isPlaying = true;
let isShuffling = false;

// 4. Initialize
document.addEventListener("DOMContentLoaded", () => {
  hideMusicPlayer();
  overlay.style.display = 'none';
});

// Then initialize dragging
const draggable = new Draggable(musicPlayer, {
    handle: '.drag-handle',
    containment: true // Optional: keep within window bounds
});

// 5. Player visibility functions
function showMusicPlayer() {
  if(isFirstOpen) {
    updateMusicSource();
    isFirstOpen = false;
  }
  musicPlayer.style.display = "block";
  overlay.style.display = "block";
}

function hideMusicPlayer() {
  musicPlayer.style.display = "none";
  overlay.style.display = "none";
}

// 6. Event listeners
vinylLink.addEventListener("click", (event) => {
  event.preventDefault();
  if(musicPlayer.style.display === "block") return;
  showMusicPlayer();
});

overlay.addEventListener("click", hideMusicPlayer);

// Video Control
function updateMusicSource() {
  const url = liveLinks2[currentLinkIndex2];
  if(!musicFrame.src.includes(url)) {
    musicFrame.src = `${url}`;
  }
}

function togglePlayState() {
  isPlaying = !isPlaying;
  musicFrame.contentWindow.postMessage({
    event: "command",
    func: isPlaying ? "playVideo" : "pauseVideo",
    args: ""
  }, "*");
}

// Event Listeners
vinylLink.addEventListener("click", (event) => {
  event.preventDefault();
  if(musicPlayer.style.display === "block") return;
  showMusicPlayer();
});

overlay.addEventListener("click", hideMusicPlayer);

document.querySelector(".playpause").addEventListener("click", togglePlayState);

document.querySelector(".prev-btn").addEventListener("click", () => {
  currentLinkIndex2 = (currentLinkIndex2 - 1 + liveLinks2.length) % liveLinks2.length;
  updateMusicSource();
  if(!isPlaying) togglePlayState();
});

document.querySelector(".next-btn").addEventListener("click", () => {
  currentLinkIndex2 = (currentLinkIndex2 + 1) % liveLinks2.length;
  updateMusicSource();
  if(!isPlaying) togglePlayState();
});
