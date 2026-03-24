import { track } from './analytics.js';

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "openedOutboundLinks";
  const selector = "a[href]";

  function getOpenedMap() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function setOpened(url) {
    const opened = getOpenedMap();
    opened[url] = true;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(opened));
  }

  function alreadyOpened(url) {
    return !!getOpenedMap()[url];
  }

  function isExternal(url) {
    try {
      const parsed = new URL(url, window.location.href);
      return parsed.origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  document.querySelectorAll(selector).forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const url = anchor.href;
      if (!url || !isExternal(url)) return;

      if (localStorage.getItem("disableUrlLinks") === "true") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (alreadyOpened(url)) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      track("outbound_link_click", {
        url,
        label:
          anchor.className ||
          anchor.getAttribute("aria-label") ||
          anchor.textContent?.trim() ||
          "unknown"
      });

      setOpened(url);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  });
});
