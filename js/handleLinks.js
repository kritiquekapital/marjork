import { track } from './analytics.js';

document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "disableUrlLinks";

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
    ".wip"
  ].join(", ");

  const SOFT_BLOCK_SELECTOR = ".spotify";

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

  document.addEventListener(
    "click",
    function (event) {
      const softBlocked = event.target.closest(SOFT_BLOCK_SELECTOR);
      const hardBlocked = event.target.closest(HARD_BLOCK_SELECTOR);

      if (!softBlocked && !hardBlocked) return;

      if (!urlLinksDisabled()) {
        if (softBlocked) {
          const url = softBlocked.getAttribute("href");
          if (!url) return;

          track("outbound_link_click", {
            href: url,
            label:
              softBlocked.className ||
              softBlocked.getAttribute("aria-label") ||
              softBlocked.textContent?.trim() ||
              "unknown"
          });

          if (isInAppBrowser()) {
            event.preventDefault();
            window.location.href = url;
          }
        }

        return;
      }

      if (softBlocked) {
        event.preventDefault();
        return;
      }

      if (hardBlocked) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  document.addEventListener("urlLinksSettingChanged", syncDisabledVisualState);
  syncDisabledVisualState();
});
