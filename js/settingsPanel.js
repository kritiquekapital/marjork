document.addEventListener("DOMContentLoaded", () => {
  const cog = document.getElementById("settingsCog");
  const dropdown = document.getElementById("settingsDropdown");
  const volumeOrb = document.getElementById("siteVolumeOrb");

  if (!cog || !dropdown || !volumeOrb) return;

  const THEME_META = [
    { name: "retro", emoji: "🕹️", color: "#27e1ff" },
    { name: "lofi", emoji: "🎧", color: "#7b68ee" },
    { name: "art", emoji: "🎨", color: "#ff5fa2" },
    { name: "space", emoji: "🚀", color: "#4b3cff" },
    { name: "modern", emoji: "🌚", color: "#7f8cff" },
    { name: "nature", emoji: "🌞", color: "#50c878" },
    { name: "classic", emoji: "😎", color: "#ffb347" },
    { name: "logistics", emoji: "📦", color: "#f0c64a" }
  ];

  const STORAGE_KEYS = {
    volume: "siteWideVolume",
    disabledThemes: "disabledThemes"
  };

  function ensureVolumeLabel() {
    let label = volumeOrb.querySelector(".settings-volume-label");
    if (!label) {
      label = document.createElement("span");
      label.className = "settings-volume-label";
      label.textContent = "🔊";
      volumeOrb.appendChild(label);
    }
  }

  function ensureThemeButtons() {
    const existing = Array.from(dropdown.querySelectorAll(".settings-theme-option"));
    if (existing.length) return existing;

    return THEME_META.map((theme) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "settings-theme-option";
      btn.dataset.theme = theme.name;
      btn.setAttribute("aria-label", `${theme.name} theme`);
      btn.textContent = theme.emoji;
      dropdown.appendChild(btn);
      return btn;
    });
  }

  ensureVolumeLabel();
  let themeButtons = ensureThemeButtons();

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

  function clampVolume(value) {
    return Math.max(0, Math.min(1, Number(value) || 0));
  }

  function getCurrentThemeName() {
    const cls = Array.from(document.body.classList).find((c) => c.startsWith("theme-"));
    return cls ? cls.replace("theme-", "") : "retro";
  }

  function syncVolumeOrbTheme() {
    const currentTheme = getCurrentThemeName();
    const themeMeta = THEME_META.find((t) => t.name === currentTheme) || THEME_META[0];
    const isInverse = currentTheme === "space";

    volumeOrb.style.setProperty(
      "--orb-base",
      isInverse ? themeMeta.color : "rgba(255, 255, 255, 0.10)"
    );

    volumeOrb.style.setProperty(
      "--orb-fill",
      isInverse ? "rgba(255, 255, 255, 0.94)" : themeMeta.color
    );

    const label = volumeOrb.querySelector(".settings-volume-label");
    if (label) {
      label.textContent = "🔊";
      label.style.color = "rgba(255, 255, 255, 0.96)";
    }
  }

  function updateVolumeOrb(volume) {
    const clamped = clampVolume(volume);
    const percent = Math.round(clamped * 100);

    volumeOrb.style.setProperty("--volume-fill", `${percent}%`);
    volumeOrb.setAttribute("aria-valuenow", String(percent));
    volumeOrb.title = `Volume ${percent}%`;
  }

  function applyVolume(value) {
    const volume = clampVolume(value);

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
    return volume;
  }

  let currentVolume = applyVolume(
    Number.isFinite(parseFloat(localStorage.getItem(STORAGE_KEYS.volume)))
      ? parseFloat(localStorage.getItem(STORAGE_KEYS.volume))
      : 0.4
  );

  function setVolumeFromPointer(clientY) {
    const rect = volumeOrb.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const ratio = 1 - (relativeY / rect.height);
    currentVolume = applyVolume(ratio);
  }

  let isDragging = false;

  volumeOrb.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    isDragging = true;
    volumeOrb.classList.add("dragging");
    volumeOrb.setPointerCapture?.(e.pointerId);
    setVolumeFromPointer(e.clientY);
  });

  volumeOrb.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    setVolumeFromPointer(e.clientY);
  });

  volumeOrb.addEventListener("click", (e) => {
    setVolumeFromPointer(e.clientY);
  });

  function stopDragging(e) {
    if (!isDragging) return;
    isDragging = false;
    volumeOrb.classList.remove("dragging");

    if (e?.pointerId !== undefined) {
      try {
        volumeOrb.releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  }

  volumeOrb.addEventListener("pointerup", stopDragging);
  volumeOrb.addEventListener("pointercancel", stopDragging);
  volumeOrb.addEventListener("lostpointercapture", () => {
    isDragging = false;
    volumeOrb.classList.remove("dragging");
  });

  volumeOrb.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const step = e.deltaY < 0 ? 0.05 : -0.05;
      currentVolume = applyVolume(currentVolume + step);
    },
    { passive: false }
  );

  volumeOrb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      currentVolume = applyVolume(currentVolume + 0.05);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      currentVolume = applyVolume(currentVolume - 0.05);
    }
  });

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
      btn.style.display = "flex";
      btn.style.visibility = "visible";
    });

    syncVolumeOrbTheme();
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
