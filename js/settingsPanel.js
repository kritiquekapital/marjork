document.addEventListener("DOMContentLoaded", () => {
  const cog = document.getElementById("settingsCog");
  const dropdown = document.getElementById("settingsDropdown");
  const volumeSlider = document.getElementById("siteVolume");
  const volumeOrb = document.getElementById("siteVolumeOrb");
  const themeButtons = document.querySelectorAll(".settings-theme-option");

  if (!cog || !dropdown) return;

  const STORAGE_KEYS = {
    volume: "siteWideVolume",
    disabledThemes: "disabledThemes"
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
    if (dropdown.classList.contains("open")) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  cog.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", closeDropdown);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdown();
  });

  function updateVolumeOrb(volume) {
    const percent = Math.round(Math.max(0, Math.min(1, volume)) * 100);
    if (volumeOrb) {
      volumeOrb.style.setProperty("--volume-fill", `${percent}%`);
      volumeOrb.setAttribute("aria-valuenow", String(percent));
    }
  }

  function applyVolume(value) {
    const volume = Math.max(0, Math.min(1, parseFloat(value) || 0));

    document.querySelectorAll("audio, video").forEach((media) => {
      try {
        media.volume = volume;
      } catch (err) {
        console.warn("Could not apply volume to media element:", err);
      }
    });

    updateVolumeOrb(volume);

    document.dispatchEvent(
      new CustomEvent("siteVolumeChange", {
        detail: { volume }
      })
    );

    localStorage.setItem(STORAGE_KEYS.volume, String(volume));
  }

  const savedVolume = parseFloat(localStorage.getItem(STORAGE_KEYS.volume));
  const initialVolume = Number.isFinite(savedVolume) ? savedVolume : 0.4;

  if (volumeSlider) {
    volumeSlider.value = String(initialVolume);
    updateVolumeOrb(initialVolume);
    applyVolume(initialVolume);

    volumeSlider.addEventListener("input", () => {
      applyVolume(volumeSlider.value);
    });
  }

  function getDisabledThemes() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.disabledThemes) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function setDisabledThemes(disabledThemes) {
    localStorage.setItem(STORAGE_KEYS.disabledThemes, JSON.stringify(disabledThemes));
  }

  function refreshThemeButtons() {
    const disabledThemes = getDisabledThemes();

    themeButtons.forEach((btn) => {
      const themeName = btn.dataset.theme;
      const isDisabled = disabledThemes.includes(themeName);

      btn.classList.toggle("disabled-theme", isDisabled);
      btn.setAttribute("aria-pressed", String(!isDisabled));
      btn.title = `${themeName}${isDisabled ? " disabled" : " enabled"}`;
    });
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const themeName = btn.dataset.theme;
      if (!themeName) return;

      let disabledThemes = getDisabledThemes();

      if (disabledThemes.includes(themeName)) {
        disabledThemes = disabledThemes.filter((name) => name !== themeName);
      } else {
        const enabledCount = themeButtons.length - disabledThemes.length;
        if (enabledCount <= 1) return;
        disabledThemes = [...disabledThemes, themeName];
      }

      setDisabledThemes(disabledThemes);
      refreshThemeButtons();

      document.dispatchEvent(
        new CustomEvent("themeRotationSettingsChanged", {
          detail: { disabledThemes }
        })
      );
    });
  });

  refreshThemeButtons();
  document.addEventListener("themeChange", refreshThemeButtons);
});
