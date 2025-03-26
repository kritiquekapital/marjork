const vinylLink = document.querySelector(".vinyl-link");
const musicPlayer = document.getElementById("musicPlayer");
const musicFrame = document.getElementById("musicFrame");
const liveLinks2 = [
  "https://www.youtube.com/embed/L1Snj1Pt-Hs?autoplay=1",  //Плачу на техно
  "https://www.youtube.com/embed/_KztNIg4cvE?autoplay=1",   //Gypsy Woman
  "https://www.youtube.com/embed/_6rUeOCm7S0?autoplay=1",  //Volga
  "https://www.youtube.com/embed/__xsCTe9dTQ?autoplay=1",    //но останься
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

function updateMusicSource() {
  const url = liveLinks2[currentLinkIndex2];
  musicFrame.src = url;
  miniMusicFrame.src = url;
}

let isShuffleOn = false;
const shuffleButton = document.querySelector(".shuffle-btn");

shuffleButton.addEventListener("click", () => {
  isShuffleOn = !isShuffleOn; // Toggle shuffle state

  if (isShuffleOn) {
    shuffleButton.classList.add("active");
    console.log("Shuffle Mode: ON");
  } else {
    shuffleButton.classList.remove("active");
    console.log("Shuffle Mode: OFF");
  }
});

// Function to get the next song index based on shuffle state
function getNextSongIndex() {
  if (isShuffleOn) {
    return Math.floor(Math.random() * liveLinks2.length); // Pick a random song
  } else {
    return (currentLinkIndex2 + 1) % liveLinks2.length; // Play next song in order
  }
}

// Update next and previous buttons to respect shuffle state
document.querySelector(".next-btn").addEventListener("click", () => {
  currentLinkIndex2 = getNextSongIndex();
  updateMusicSource();
});

document.querySelector(".prev-btn").addEventListener("click", () => {
  if (isShuffleOn) {
    currentLinkIndex2 = Math.floor(Math.random() * liveLinks2.length);
  } else {
    currentLinkIndex2 = (currentLinkIndex2 - 1 + liveLinks2.length) % liveLinks2.length;
  }
  updateMusicSource();
});


vinylLink.addEventListener("click", (event) => {
  event.preventDefault();
  updateMusicSource();
  musicPlayer.style.display = "block";
  isPlaying = true;
});

// Controls
document.querySelector(".playpause").addEventListener("click", () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    musicFrame.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    miniMusicFrame.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
  } else {
    musicFrame.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    miniMusicFrame.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  }
});

document.querySelector(".prev-btn").addEventListener("click", () => {
  currentLinkIndex2 = (currentLinkIndex2 - 1 + liveLinks2.length) % liveLinks2.length;
  updateMusicSource();
});

document.querySelector(".next-btn").addEventListener("click", () => {
  currentLinkIndex2 = (currentLinkIndex2 + 1) % liveLinks2.length;
  updateMusicSource();
});

// Shuffle Button
document.querySelector(".shuffle-btn").addEventListener("click", () => {
  isShuffling = !isShuffling;
  shuffleLinks();
});

document.querySelector(".menu-btn").addEventListener("click", () => {
  musicPlayer.style.display = "none";
  document.querySelector(".minimized-player").style.display = "block";
});

// Minimized player controls
document.querySelector(".minimized-player").addEventListener("click", () => {
  musicPlayer.style.display = "block";
  document.querySelector(".minimized-player").style.display = "none";
});

document.addEventListener("click", (event) => {
  const musicPlayer = document.getElementById("musicPlayer");

  // Check if the player is visible
  if (musicPlayer.style.opacity === "1") {
    // If the click is outside the player, minimize it
    if (!musicPlayer.contains(event.target)) {
      musicPlayer.style.opacity = "0";
      musicPlayer.style.visibility = "hidden";
      musicPlayer.style.pointerEvents = "none"; // Disable interactions but keep playing
    }
  }
});

// Ensure clicking inside does not trigger hiding
document.getElementById("musicPlayer").addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent the click from bubbling to the document
});

document.addEventListener("click", (event) => {
  const musicPlayer = document.getElementById("musicPlayer");

  // Ensure the player is open before trying to hide it
  if (musicPlayer.style.visibility !== "hidden") {
    if (!musicPlayer.contains(event.target)) {
      // Hide the player but keep music running
      musicPlayer.style.opacity = "0";
      musicPlayer.style.visibility = "hidden";
      musicPlayer.style.pointerEvents = "none";
    }
  }
});

// Prevent clicks inside the player from closing it
document.getElementById("musicPlayer").addEventListener("click", (event) => {
  event.stopPropagation(); // Stops the click from bubbling to the document
});

