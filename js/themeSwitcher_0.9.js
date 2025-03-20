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
