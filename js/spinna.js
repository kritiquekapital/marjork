document.addEventListener('DOMContentLoaded', () => {
  const substackButton = document.querySelector('.substack-button');
  const substackImage = substackButton.querySelector('img');
  let currentThemeIndex = 0;  // Set the starting theme index

  // Function to apply the theme
  function applyTheme() {
    const currentTheme = themes[currentThemeIndex];
    document.body.classList.remove(
      'theme-classic',
      'theme-modern',
      'theme-retro',
      'theme-nature',
      'theme-space',
      'theme-logistics'
    );
    document.body.classList.add(`theme-${currentTheme.name}`);
    themeButton.textContent = currentTheme.displayName;

    // Handle the Substack button's image and border based on the theme
    if (currentTheme.name === "modern" || currentTheme.name === "space") {
      substackButton.style.borderColor = "transparent"; // Hide the border for modern and space
      substackImage.src = ""; // Remove the image for modern and space themes
    } else {
      substackButton.style.borderColor = "#FF6A13"; // Default orange border for other themes
      substackImage.src = "https://github.com/kritiquekapital/marjork/blob/main/css/pic/Psych-Flower%20%2304.png"; // Default image
    }

    // Ensure the correct background image and video display based on the theme
    if (currentTheme.name === "nature") {
      natureVideo.style.display = "block";
      natureAudio.play().catch(e => console.warn("Nature audio autoplay failed:", e));
    } else {
      natureVideo.style.display = "none";
      natureAudio.pause();
    }

    if (currentTheme.name === "space") {
      spaceBackground.style.display = "block";
    } else {
      spaceBackground.style.display = "none";
    }
  }

  // Apply the initial theme on page load
  applyTheme();

  // Theme switcher button click event listener
  themeButton.addEventListener("click", () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;  // Cycle through themes
    applyTheme();
  });
});
