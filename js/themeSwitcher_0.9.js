const themes = [
  { name: "classic", displayName: "😎" },
  { name: "modern", displayName: "🌚" },
  { name: "nature", displayName: "🌞" },
  { name: "retro", displayName: "🕹️" },
  { name: "space", displayName: "🚀" }
];

let currentThemeIndex = 0;
const spaceBackground = document.getElementById("space-background");

function applyTheme() {
  const currentTheme = themes[currentThemeIndex];
  document.body.className = `theme-${currentTheme.name}`;
  themeButton.textContent = currentTheme.displayName;

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
