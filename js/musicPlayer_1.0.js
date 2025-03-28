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
