document.addEventListener("DOMContentLoaded", () => {
  const cog = document.getElementById("settingsCog");
  const dropdown = document.getElementById("settingsDropdown");
  const volumeSlider = document.getElementById("siteVolume");
  const themeButtons = document.querySelectorAll(".settings-theme-option");

  if (!cog || !dropdown) return;

  const STORAGE_KEYS = {
    volume: "siteWideVolume"
  };

  function openDropdown() {
    dropdown.classList.add("open");
    dropdown.setAttribute("aria-hidden", "false");
    cog.setAttribute("aria-expanded", "true");
  }

  function closeDropdown() {
    dropdown.classList.remove("open");
    dropdown.setAttribute("aria-hidden", "true");
    cog.setAttribute("aria-expanded", "false");
  }

  function toggleDropdown() {
    const isOpen = dropdown.classList.contains("open");
    if (isOpen) closeDropdown();
    else openDropdown();
  }

  cog.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", () => {
    closeDropdown();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdown();
  });

  function applyVolume(value) {
    const volume = Math.max(0, Math.min(1, parseFloat(value) || 0));

    // native media
    document.querySelectorAll("audio, video").forEach((media) => {
      media.volume = volume;
      media.dataset.siteWideManaged = "true";
    });

    // custom event for any module that wants to listen
    document.dispatchEvent(
      new CustomEvent("siteVolumeChange", {
        detail: { volume }
      })
    );

    localStorage.setItem(STORAGE_KEYS.volume, String(volume));
  }

  const savedVolume = localStorage.getItem(STORAGE_KEYS.volume);
  const initialVolume = savedVolume !== null ? savedVolume : "0.4";

  if (volumeSlider) {
    volumeSlider.value = initialVolume;
    applyVolume(initialVolume);

    volumeSlider.addEventListener("input", () => {
      applyVolume(volumeSlider.value);
    });
  }

  function detectCurrentTheme() {
    const bodyClasses = Array.from(document.body.classList);
    const themeClass = bodyClasses.find(cls => cls.startsWith("theme-"));
    return themeClass ? themeClass.replace("theme-", "") : null;
  }

  function refreshActiveThemeButtons() {
    const currentTheme = detectCurrentTheme();
    themeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === currentTheme);
    });
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const themeName = btn.dataset.theme;
      if (!themeName) return;

      document.dispatchEvent(
        new CustomEvent("setTheme", {
          detail: { themeName }
        })
      );

      refreshActiveThemeButtons();
    });
  });

  document.addEventListener("themeChange", refreshActiveThemeButtons);

  refreshActiveThemeButtons();
});
