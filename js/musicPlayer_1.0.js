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

function updateMusicSource() {
  const url = liveLinks2[currentLinkIndex2];
  musicFrame.src = url;
  miniMusicFrame.src = url;
}

function shuffleLinks() {
  if (isShuffling) {
    liveLinks2.sort(() => Math.random() - 0.5); // Randomize the order
  } else {
    // Revert to the original order if shuffle is disabled
    liveLinks2.sort((a, b) => liveLinks2.indexOf(a) - liveLinks2.indexOf(b));
  }
  updateMusicSource();
}

// Controls
document.querySelector(".playpause").addEventListener("click", () => {
  isPlaying = !isPlaying;
  const action = isPlaying ? "playVideo" : "pauseVideo";
  [musicFrame, miniMusicFrame].forEach(frame => {
    frame.contentWindow.postMessage(
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

// In the minimized-player click event:
document.querySelector(".minimized-player").addEventListener("click", () => {
  showMusicPlayer(); // Use this function instead of manual styles
  document.querySelector(".minimized-player").style.display = "none";
});

    // Click event to show the music player
    vinylLink.addEventListener("click", function (event) {
        event.preventDefault();
        showMusicPlayer();
    });

    document.addEventListener("DOMContentLoaded", function () {
      // Click outside logic
      document.addEventListener("click", function (event) {
        const isPlayer = musicPlayer.contains(event.target);
        const isVinyl = vinylLink.contains(event.target);
        const isMiniPlayer = document.querySelector(".minimized-player").contains(event.target);
        
        if (!isPlayer && !isVinyl && !isMiniPlayer) {
          hideMusicPlayer();
        }
      });
    
      // Play/Pause Button
      document.querySelector(".playpause").addEventListener("click", () => {
        isPlaying = !isPlaying;
        const action = isPlaying ? "playVideo" : "pauseVideo";
        musicFrame.contentWindow.postMessage(
          `{"event":"command","func":"${action}","args":""}`,
          "*"
        );
        miniMusicFrame.contentWindow.postMessage(
          `{"event":"command","func":"${action}","args":""}`,
          "*"
        );
      });
    });

    // Prevent the music player click from closing itself
    musicPlayer.addEventListener("click", function (event) {
        event.stopPropagation();
    });

      // Visibility functions
  function showMusicPlayer() {
    musicPlayer.classList.remove("hidden");
  }

  function hideMusicPlayer() {
    musicPlayer.classList.add("hidden");
  }
