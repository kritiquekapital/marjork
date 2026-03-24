import { track } from './analytics.js';

document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "disableUrlLinks";
  const selector = ".substack-button, .twitter, .duolingo, .dropkickd-button, .letterboxd, .spotify";

  function urlLinksDisabled() {
    return localStorage.getItem(STORAGE_KEY) === "true";
  }

  function openLinkInNewTabIfNotOpened(url) {
    if (!url) return;

    if (!sessionStorage.getItem(url)) {
      window.open(url, "_blank");
      sessionStorage.setItem(url, "opened");
    }
  }

  function syncDisabledVisualState() {
    document.body.classList.toggle("url-links-disabled", urlLinksDisabled());
  }

  const buttons = document.querySelectorAll(selector);

  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      if (urlLinksDisabled()) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      event.preventDefault();

      const url = button.getAttribute("href");

      track("outbound_link_click", {
        href: url,
        label:
          button.className ||
          button.getAttribute("aria-label") ||
          button.textContent?.trim() ||
          "unknown"
      });

      openLinkInNewTabIfNotOpened(url);
    });
  });

  document.querySelectorAll("a[href]").forEach(link => {
    link.addEventListener("click", () => {
      track("outbound_link_click", {
        url: link.href
      });
    });
  });

  document.addEventListener("urlLinksSettingChanged", syncDisabledVisualState);
  syncDisabledVisualState();
});
