const themes = [
  { name: "classic", displayName: "😎" },
  { name: "modern", displayName: "🌚" },
  { name: "nature", displayName: "🌞" },
  { name: "retro", displayName: "🕹️" },
  { name: "space", displayName: "🚀" }
];

let currentThemeIndex = 0;
const spaceBackground = document.createElement("iframe");
spaceBackground.classList.add("space-background-stream");
spaceBackground.setAttribute("frameborder", "0");
spaceBackground.setAttribute("allow", "autoplay; encrypted-media");
spaceBackground.setAttribute("allowfullscreen", "");
spaceBackground.setAttribute("src", "https://www.youtube.com/embed/H999s0P1Er0?autoplay=1&mute=1&controls=0&loop=1");
document.body.prepend(spaceBackground);

function getCurrentTheme() {
  return themes[currentThemeIndex].name;  // Returns the name of the current theme
}

// Initialize the draggable element
const draggableElement = document.querySelector('.theme-space');
const draggable = new Draggable(draggableElement, getCurrentTheme);  // Pass getCurrentTheme function

// Initialize theme switching button
const themeButton = document.getElementById("themeButton");
themeButton.addEventListener("click", () => {
  themeButton.style.animation = "spin 0.5s ease-in-out";
  setTimeout(() => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme();
    themeButton.style.animation = "";
  }, 500);
});

function applyTheme() {
  const currentTheme = themes[currentThemeIndex];
  document.body.className = `theme-${currentTheme.name}`;
  themeButton.textContent = currentTheme.displayName;
  if (currentTheme.name === "space") {
    spaceBackground.style.display = "block";
  } else {
    spaceBackground.style.display = "none";
  }
}

applyTheme();
let inactivityTimer;

function hideSpaceThemeUI() {
  if (document.body.classList.contains("theme-space")) {
    document.querySelector(".grid-container").style.opacity = "0";
    document.querySelector(".grid-container").style.pointerEvents = "none";
  }
}

function showSpaceThemeUI() {
  if (document.body.classList.contains("theme-space")) {
    document.querySelector(".grid-container").style.opacity = "1";
    document.querySelector(".grid-container").style.pointerEvents = "auto";
  }
}

// Reset the inactivity timer
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  showSpaceThemeUI(); // Ensure UI is visible when active
  inactivityTimer = setTimeout(hideSpaceThemeUI, 7000); // 10 seconds timeout
}

// Listen for pointer movements to detect activity
document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("keydown", resetInactivityTimer);
document.addEventListener("click", resetInactivityTimer);
document.addEventListener("touchstart", resetInactivityTimer);

// Initialize the timer when the page loads
resetInactivityTimer();

const themeButton = document.getElementById("themeButton");
themeButton.addEventListener("click", () => {
  themeButton.style.animation = "spin 0.5s ease-in-out";
  setTimeout(() => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme();
    themeButton.style.animation = "";
  }, 500);
});

applyTheme();
