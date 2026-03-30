import { track } from './analytics.js';

document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "disableUrlLinks";
  const SESSION_KEY = "openedLinkButtonsThisSession";

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

  document.addEventListener(
    "click",
    function (event) {
      const button = event.target.closest(HARD_BLOCK_SELECTOR);
      if (!button) return;

      const url = button.getAttribute("href");

      if (urlLinksDisabled()) {
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
        return;
      }
    },
    true
  );

  document.addEventListener("urlLinksSettingChanged", () => {
    syncDisabledVisualState();
    syncSessionOpenedVisualState();
  });

  syncDisabledVisualState();
  syncSessionOpenedVisualState();
});
