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

  let spotifyPointerNavigated = false;

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

  function getLabel(element) {
    return (
      element.className ||
      element.getAttribute("aria-label") ||
      element.textContent?.trim() ||
      "unknown"
    );
  }

  document.addEventListener(
    "pointerdown",
    function (event) {
      const softBlocked = event.target.closest(SOFT_BLOCK_SELECTOR);
      if (!softBlocked) return;

      if (urlLinksDisabled()) return;

      const url = softBlocked.getAttribute("href");
      if (!url) return;

      track("outbound_link_click", {
        href: url,
        label: getLabel(softBlocked)
      });

      spotifyPointerNavigated = true;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (isInAppBrowser()) {
        window.location.href = url;
        return;
      }

      const target = softBlocked.getAttribute("target");
      if (target === "_blank") {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = url;
      }
    },
    true
  );

  document.addEventListener(
    "click",
    function (event) {
      const softBlocked = event.target.closest(SOFT_BLOCK_SELECTOR);
      const hardBlocked = event.target.closest(HARD_BLOCK_SELECTOR);

      if (!softBlocked && !hardBlocked) return;

      if (!urlLinksDisabled()) {
        if (softBlocked) {
          if (spotifyPointerNavigated) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            spotifyPointerNavigated = false;
            return;
          }

          const url = softBlocked.getAttribute("href");
          if (!url) return;

          track("outbound_link_click", {
            href: url,
            label: getLabel(softBlocked)
          });
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
