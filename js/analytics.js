export function track(eventName, data = undefined) {
  try {
    if (window.umami && typeof window.umami.track === "function") {
      if (data && Object.keys(data).length) {
        window.umami.track(eventName, data);
      } else {
        window.umami.track(eventName);
      }
    }
  } catch (err) {
    console.warn("Umami track failed:", eventName, err);
  }
}
