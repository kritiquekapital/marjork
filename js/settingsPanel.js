document.addEventListener("DOMContentLoaded", () => {
  const cog = document.getElementById("settingsCog");
  const dropdown = document.getElementById("settingsDropdown");
  const volumeOrb = document.getElementById("siteVolumeOrb");

  if (!cog || !dropdown || !volumeOrb) return;

  const THEME_META = [
    {
      name: "retro",
      emoji: "🕹️",
      fill: "linear-gradient(180deg, #27e1ff 0%, #00ffa6 45%, #ffe600 100%)"
    },
    {
      name: "lofi",
      emoji: "🎧",
      fill: "#7b68ee"
    },
    {
      name: "art",
      emoji: "🎨",
      fill: "#ff5fa2"
    },
    {
      name: "space",
      emoji: "🚀",
      fill: "radial-gradient(circle at 50% 65%, rgba(255, 232, 120, 0.98) 0%, rgba(255, 214, 10, 0.96) 38%, rgba(255, 184, 0, 0.92) 62%, rgba(255, 184, 0, 0.35) 100%)"
    },
    {
      name: "modern",
      emoji: "🌚",
      fill: "#7f8cff"
    },
    {
      name: "nature",
      emoji: "🌞",
      fill: "#50c878"
    },
    {
      name: "classic",
      emoji: "😎",
      fill: "#ffb347"
    },
    {
      name: "logistics",
      emoji: "📦",
      fill: "#f0c64a"
    }
  ];

  const STORAGE_KEYS = {
    volume: "siteWideVolume",
    disabledThemes: "disabledThemes",
    disableUrlLinks: "disableUrlLinks"
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

  function ensureLinkToggle() {
    let toggle = dropdown.querySelector(".settings-link-toggle");
    if (toggle) return toggle;

    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "settings-link-toggle";
    toggle.setAttribute("aria-label", "Toggle URL-style links");
    toggle.textContent = "🔗";

    dropdown.appendChild(toggle);
    return toggle;
  }

  function ensureThemeButtons() {
    const buttonsByTheme = new Map(
      Array.from(dropdown.querySelectorAll(".settings-theme-option")).map((btn) => [
        btn.dataset.theme,
        btn
      ])
    );

    THEME_META.forEach((theme) => {
      if (!buttonsByTheme.has(theme.name)) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "settings-theme-option";
        btn.dataset.theme = theme.name;
        btn.setAttribute("aria-label", `${theme.name} theme`);
        btn.textContent = theme.emoji;
        dropdown.appendChild(btn);
        buttonsByTheme.set(theme.name, btn);
      }
    });

    return THEME_META.map((theme) => buttonsByTheme.get(theme.name)).filter(Boolean);
  }

  ensureVolumeLabel();
  const linkToggle = ensureLinkToggle();
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
    const isSpace = currentTheme === "space";

    volumeOrb.style.setProperty("--orb-base", isSpace ? themeMeta.fill : "rgba(255, 255, 255, 0.08)");
    volumeOrb.style.setProperty("--orb-fill", isSpace ? "#ffffff" : themeMeta.fill);

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
    const ratio = 1 - relativeY / rect.height;
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

  function getDisableUrlLinks() {
    return localStorage.getItem(STORAGE_KEYS.disableUrlLinks) === "true";
  }

  function setDisableUrlLinks(value) {
    localStorage.setItem(STORAGE_KEYS.disableUrlLinks, String(Boolean(value)));
    document.body.classList.toggle("url-links-disabled", Boolean(value));
    document.dispatchEvent(
      new CustomEvent("urlLinksSettingChanged", {
        detail: { disabled: Boolean(value) }
      })
    );
  }

  function isPhone() {
    return window.innerWidth <= 768;
  }

  function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  }

  function getDeviceBlockedThemes() {
    const PHONE_ALLOWED_THEMES = ["retro", "art", "modern", "classic", "space", "nature"];
    const TABLET_ALLOWED_THEMES = ["retro", "art", "modern", "classic", "space", "nature"];

    if (isPhone()) {
      return THEME_META
        .map((theme) => theme.name)
        .filter((name) => !PHONE_ALLOWED_THEMES.includes(name));
    }

    if (isTablet()) {
      return THEME_META
        .map((theme) => theme.name)
        .filter((name) => !TABLET_ALLOWED_THEMES.includes(name));
    }

    return [];
  }

  function bindThemeButton(btn) {
    if (!btn || btn.dataset.settingsBound === "true") return;

    btn.dataset.settingsBound = "true";
    btn.addEventListener("click", () => {
      const themeName = btn.dataset.theme;
      if (!themeName) return;

      const deviceBlockedThemes = getDeviceBlockedThemes();
      if (deviceBlockedThemes.includes(themeName)) return;

      let disabledThemes = getDisabledThemes();

      if (disabledThemes.includes(themeName)) {
        disabledThemes = disabledThemes.filter((name) => name !== themeName);
      } else {
        const toggleableButtons = themeButtons.filter(
          (button) => !deviceBlockedThemes.includes(button.dataset.theme)
        );
        const enabledCount =
          toggleableButtons.length -
          disabledThemes.filter((name) => !deviceBlockedThemes.includes(name)).length;

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
  }

  function refreshLinkToggle() {
    const disabled = getDisableUrlLinks();

    linkToggle.classList.toggle("active-toggle", disabled);
    linkToggle.setAttribute("aria-pressed", String(disabled));
    linkToggle.title = disabled ? "URL links disabled" : "URL links enabled";
    linkToggle.textContent = disabled ? "⛓️" : "🔗";

    document.body.classList.toggle("url-links-disabled", disabled);
  }

  function refreshThemeButtons() {
    const disabledThemes = getDisabledThemes();
    const deviceBlockedThemes = getDeviceBlockedThemes();

    themeButtons.forEach((btn) => {
      const themeName = btn.dataset.theme;
      const isDeviceBlocked = deviceBlockedThemes.includes(themeName);
      const isDisabled = !isDeviceBlocked && disabledThemes.includes(themeName);

      btn.classList.toggle("disabled-theme", isDisabled);
      btn.classList.toggle("desktop-only-theme", isDeviceBlocked);
      btn.setAttribute("aria-pressed", String(!isDisabled && !isDeviceBlocked));
      btn.setAttribute("aria-disabled", String(isDeviceBlocked));

      if (isDeviceBlocked) {
        btn.title = `${themeName} desktop only`;
      } else {
        btn.title = `${themeName}${isDisabled ? " disabled" : " enabled"}`;
      }

      btn.style.display = "flex";
      btn.style.visibility = "visible";
    });

    syncVolumeOrbTheme();
    refreshLinkToggle();
  }

  linkToggle.addEventListener("click", () => {
    setDisableUrlLinks(!getDisableUrlLinks());
    refreshLinkToggle();
  });

  themeButtons.forEach(bindThemeButton);

  window.addEventListener("resize", refreshThemeButtons);

  refreshThemeButtons();
  document.addEventListener("themeChange", refreshThemeButtons);
});
