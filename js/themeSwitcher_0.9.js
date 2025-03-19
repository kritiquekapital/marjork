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

  if (currentTheme.name === "space") {
    if (!spaceBackground.querySelector("iframe")) {
      spaceBackground.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/xRPjKQtRXR8?autoplay=1&mute=1&controls=0&loop=1&playlist=xRPjKQtRXR8"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
      `;
    }
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