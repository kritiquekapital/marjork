import { track } from './analytics.js';

document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "disableUrlLinks";
  const SESSION_KEY = "openedLinkButtonsThisSession";
  const STATSFM_CLICK_DELAY = 500;

  const HARD_BLOCK_SELECTOR = [
    ".substack-button",
    ".twitter",
    ".duolingo",
    ".dropkickd-button",
    ".letterboxd",
    ".statsfm",
    ".backlog-button",
    ".propaganda-link",
    ".vinyl-link",
    "#games-like-button",
    ".secret-button",
    "#themeButton",
    ".wip",
    ".spotify"
  ].join(", ");

  let statsUnlocked = false;
  let statsClickable = false;
  let statsClickableTimer = null;

  function urlLinksDisabled() {
    return localStorage.getItem(STORAGE_KEY) === "true";
  }

  function syncDisabledVisualState() {
    document.body.classList.toggle("url-links-disabled", urlLinksDisabled());
  }

  function isInAppBrowser() {
    const ua = navigator.userAgent || "";
    return /Instagram|FBAN|FBAV/i.test(ua);
  }

  function getSessionOpenedMap() {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function setSessionOpenedMap(map) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(map));
  }

  function getButtonSessionKey(button) {
    if (button.id) return `id:${button.id}`;

    const classes = Array.from(button.classList).filter(Boolean);
    if (classes.length) return `class:${classes.join(".")}`;

    return `href:${button.getAttribute("href") || "unknown"}`;
  }

  function hasOpenedThisSession(button) {
    const map = getSessionOpenedMap();
    return map[getButtonSessionKey(button)] === true;
  }

  function markOpenedThisSession(button) {
    const map = getSessionOpenedMap();
    map[getButtonSessionKey(button)] = true;
    setSessionOpenedMap(map);
  }

  function syncSessionOpenedVisualState() {
    document.querySelectorAll(HARD_BLOCK_SELECTOR).forEach((button) => {
      button.classList.toggle("opened-this-session", hasOpenedThisSession(button));
    });
  }

  function getLabel(button) {
    return (
      button.className ||
      button.getAttribute("aria-label") ||
      button.textContent?.trim() ||
      "unknown"
    );
  }

  function getSpotifyButton() {
    return document.querySelector(".spotify");
  }

  function getStatsfmButton() {
    return document.querySelector(".statsfm");
  }

  function isSpotifyFree() {
    const spotifyButton = getSpotifyButton();
    return !!spotifyButton && spotifyButton.classList.contains("free");
  }

  function clearStatsfmClickableTimer() {
    if (!statsClickableTimer) return;
    clearTimeout(statsClickableTimer);
    statsClickableTimer = null;
  }

  function applyStatsfmState() {
    const statsfmButton = getStatsfmButton();
    if (!statsfmButton) return;

    statsfmButton.classList.toggle("is-unlocked", statsUnlocked);
    statsfmButton.classList.toggle("is-clickable", statsClickable);

    statsfmButton.setAttribute(
      "aria-disabled",
      statsClickable ? "false" : "true"
    );

    if (statsClickable) {
      statsfmButton.removeAttribute("tabindex");
    } else {
      statsfmButton.tabIndex = -1;
    }
  }

  function disableStatsfmClickability() {
    clearStatsfmClickableTimer();
    statsClickable = false;
    applyStatsfmState();
  }

  function enableStatsfmClickabilityWithDelay() {
    clearStatsfmClickableTimer();

    if (!statsUnlocked || !isSpotifyFree()) {
      statsClickable = false;
      applyStatsfmState();
      return;
    }

    statsClickable = false;
    applyStatsfmState();

    statsClickableTimer = setTimeout(() => {
      if (!statsUnlocked || !isSpotifyFree()) {
        statsClickable = false;
        applyStatsfmState();
        return;
      }

      statsClickable = true;
      applyStatsfmState();
    }, STATSFM_CLICK_DELAY);
  }

  function unlockStatsfmVisual() {
    statsUnlocked = true;
    applyStatsfmState();

    if (isSpotifyFree()) {
      enableStatsfmClickabilityWithDelay();
    }
  }

  function lockStatsfmVisual() {
    statsUnlocked = false;
    disableStatsfmClickability();
    applyStatsfmState();
  }

  function syncStatsfmWithSpotifyState() {
    if (!statsUnlocked) {
      disableStatsfmClickability();
      return;
    }

    if (isSpotifyFree()) {
      enableStatsfmClickabilityWithDelay();
    } else {
      disableStatsfmClickability();
    }
  }

  const spotifyButton = getSpotifyButton();
  if (spotifyButton) {
    const spotifyObserver = new MutationObserver(() => {
      syncStatsfmWithSpotifyState();
    });

    spotifyObserver.observe(spotifyButton, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  document.addEventListener("statsfm:unlock", unlockStatsfmVisual);
  document.addEventListener("statsfm:lock", lockStatsfmVisual);

  document.addEventListener(
    "click",
    function (event) {
      const button = event.target.closest(HARD_BLOCK_SELECTOR);
      if (!button) return;

      const isStatsfmButton = button.classList.contains("statsfm");
      const url = button.getAttribute("href");

      if (urlLinksDisabled()) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return;
      }

      if (isStatsfmButton && !statsClickable) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return;
      }

      if (!url) return;

      if (hasOpenedThisSession(button)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return;
      }

      track("outbound_link_click", {
        href: url,
        label: getLabel(button)
      });

      markOpenedThisSession(button);
      syncSessionOpenedVisualState();

      if (isInAppBrowser()) {
        event.preventDefault();
        window.location.href = url;
      }
    },
    true
  );

  document.addEventListener("urlLinksSettingChanged", () => {
    syncDisabledVisualState();
    syncSessionOpenedVisualState();
    applyStatsfmState();
  });

  syncDisabledVisualState();
  syncSessionOpenedVisualState();
  disableStatsfmClickability();
  applyStatsfmState();
});
