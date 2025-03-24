// Update vinylButton_0.9.js
const vinylLink = document.querySelector(".vinyl-link");
const musicPlayer = document.getElementById("musicPlayer");
const musicFrame = document.getElementById("musicFrame");
const liveLinks2 = [
  "https://www.youtube.com/embed/L1Snj1Pt-Hs?autoplay=1",  //Плачу на техно
  "https://www.youtube.com/embed/KztNIg4cvE?autoplay=1",   //Gypsy Woman
  "https://www.youtube.com/embed/_6rUeOCm7S0?autoplay=1",  //Volga
  "https://www.youtube.com/embed/xsCTe9dTQ?autoplay=1",    //но останься
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
  "https://www.youtube.com/embed/rZWdolJfgk?autoplay=1",   //Potage
  "https://www.youtube.com/embed/cYpQ36acEUU?autoplay=1",  //Absolutely
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

document.querySelector(".menu-btn").addEventListener("click", () => {
  musicPlayer.style.display = "none";
  document.querySelector(".minimized-player").style.display = "block";
});

// Minimized player controls
document.querySelector(".minimized-player").addEventListener("click", () => {
  musicPlayer.style.display = "block";
  document.querySelector(".minimized-player").style.display = "none";
});
