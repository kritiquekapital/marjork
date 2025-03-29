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

// Video Links (enable YouTube API)
const liveLinks2 = [
  "https://www.youtube.com/embed/x3xYXGMRRYk?autoplay=1",  //Candy
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

let isFirstOpen = true;
let isPlaying = true;
let isPinned = false;
let isShuffling = false;
let shuffleQueue = [];
let currentPlaylist = [...liveLinks2];
let currentIndex = 0;
let player; // YouTube Player instance

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

// ✅ Vinyl Click to Open
vinylLink.addEventListener("click", (event) => {
  event.preventDefault();
  showMusicPlayer();
});

// 🎵 Shuffle Algorithm
function shufflePlaylist() {
  shuffleQueue = [...liveLinks2].sort(() => Math.random() - 0.5);
  currentIndex = 0;
  currentPlaylist = [...shuffleQueue];
}

// 🎵 Resume Sequential Order from Current Track
function resumeSequential() {
  let currentVideo = currentPlaylist[currentIndex];
  let originalIndex = liveLinks2.indexOf(currentVideo);
  if (originalIndex === -1) originalIndex = 0;
  currentPlaylist = [...liveLinks2];
  currentIndex = originalIndex;
}

// 🎵 Update Music Source
function updateMusicSource() {
  let newSrc = currentPlaylist[currentIndex];
  musicFrame.src = newSrc;
  setTimeout(initializeYouTubePlayer, 1000); // Delay to let API bind
}

// 🎵 Next Track
function nextTrack() {
  currentIndex = (currentIndex + 1) % currentPlaylist.length;
  updateMusicSource();
}

// 🎵 Initialize YouTube Player API
function initializeYouTubePlayer() {
  if (!window.YT || !YT.Player) return;
  if (player) player.destroy(); // Remove previous instance
  player = new YT.Player(musicFrame, {
    events: {
      'onStateChange': function (event) {
        if (event.data === YT.PlayerState.ENDED) {
          console.log("Video ended, moving to next track...");
          nextTrack();
        }
      }
    }
  });
}

// 🎵 Load YouTube API Script
function loadYouTubeAPI() {
  if (!window.YT) {
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  } else {
    initializeYouTubePlayer();
  }
}

// 🏁 Ensure YouTube API Loads
window.onYouTubeIframeAPIReady = initializeYouTubePlayer;
loadYouTubeAPI();
