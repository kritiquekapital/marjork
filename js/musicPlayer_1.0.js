// Update vinylButton_0.9.js
const vinylLink = document.querySelector(".vinyl-link");
const musicPlayer = document.getElementById("musicPlayer");
const musicFrame = document.getElementById("musicFrame");
const liveLinks2 = [
  "https://www.youtube.com/embed/6riDJMI-Y8U?autoplay=1",
  // Add other vinyl links
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
