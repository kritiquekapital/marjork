import { track } from './analytics.js';

document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "disableUrlLinks";
  const selector = ".substack-button, .twitter, .duolingo, .dropkickd-button, .letterboxd, .spotify";

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

  const buttons = document.querySelectorAll(selector);

  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const url = button.getAttribute("href");
      if (!url) return;

      // block if disabled in settings
      if (urlLinksDisabled()) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // tracking
      track("outbound_link_click", {
        href: url,
        label:
          button.className ||
          button.getAttribute("aria-label") ||
          button.textContent?.trim() ||
          "unknown"
      });

      // fix IG / FB in-app browser behavior
      if (isInAppBrowser()) {
        event.preventDefault();
        window.location.href = url;
        return;
      }

      // otherwise: DO NOTHING
      // let <a href target="_blank"> behave naturally
    });
  });

  document.addEventListener("urlLinksSettingChanged", syncDisabledVisualState);
  syncDisabledVisualState();
});
