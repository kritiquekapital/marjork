import { track } from './analytics.js';

document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "disableUrlLinks";
  const selector = ".substack-button, .twitter, .duolingo, .dropkickd-button, .letterboxd, .spotify";

  function urlLinksDisabled() {
    return localStorage.getItem(STORAGE_KEY) === "true";
  }

  function alreadyOpened(url) {
    return sessionStorage.getItem(`opened:${url}`) === "true";
  }

  function markOpened(url) {
    sessionStorage.setItem(`opened:${url}`, "true");
  }

  function isInAppBrowser() {
    const ua = navigator.userAgent || "";
    return /Instagram|FBAN|FBAV/i.test(ua);
  }

  function openUrl(url) {
    if (!url) return;

    if (isInAppBrowser()) {
      // less glitchy in IG/FB browser than window.open
      window.location.href = url;
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  function syncDisabledVisualState() {
    document.body.classList.toggle("url-links-disabled", urlLinksDisabled());
  }

  document.querySelectorAll(selector).forEach((button) => {
    button.addEventListener("click", function (event) {
      const url = button.getAttribute("href");
      if (!url) return;

      if (urlLinksDisabled()) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (alreadyOpened(url)) {
        event.preventDefault();
        return;
      }

      track("outbound_link_click", {
        href: url,
        label:
          button.className ||
          button.getAttribute("aria-label") ||
          button.textContent?.trim() ||
          "unknown"
      });

      markOpened(url);
      event.preventDefault();
      openUrl(url);
    });
  });

  document.addEventListener("urlLinksSettingChanged", syncDisabledVisualState);
  syncDisabledVisualState();
});
