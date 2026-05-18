// ─── Host guard ──────────────────────────────────────────────────────────────

const ALLOWED_HOSTS = new Set([
  "ideo.cam",
  "www.ideo.cam",
]);

const IS_ALLOWED = ALLOWED_HOSTS.has(window.location.hostname);

function allowed() {
  return IS_ALLOWED;
}

// ─── Core track() ────────────────────────────────────────────────────────────

export function track(eventName, data) {
  if (!allowed()) return;
  if (typeof window.umami?.track !== "function") return;
  try {
    if (data && Object.keys(data).length > 0) {
      window.umami.track(eventName, data);
    } else {
      window.umami.track(eventName);
    }
  } catch (err) {
    console.warn("Umami track failed:", eventName, err);
  }
}

// ─── identifySession() ───────────────────────────────────────────────────────

export function identifySession() {
  if (!allowed()) return;

  function attempt() {
    if (typeof window.umami?.identify !== "function") {
      setTimeout(attempt, 500);
      return;
    }

    const nav = navigator;
    const conn =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    window.umami.identify({
      platform:    nav.platform   || "unknown",
      dpr:         window.devicePixelRatio ?? 1,
      touch:       navigator.maxTouchPoints > 0,
      cores:       nav.hardwareConcurrency  ?? null,
      ram:         nav.deviceMemory         ?? null,
      connection:  conn?.effectiveType      ?? null,
      ua:          nav.userAgent,
      screen:      `${screen.width}x${screen.height}`,
      viewport:    `${window.innerWidth}x${window.innerHeight}`,
    });
  }

  attempt();
}

// ─── trackPageLoad() ─────────────────────────────────────────────────────────

export function trackPageLoad() {
  if (!allowed()) return;
  track("page_load", {
    referrer: document.referrer || "direct",
  });
}

// ─── bindScrollDepth() ───────────────────────────────────────────────────────

export function bindScrollDepth(el, eventName, data = {}) {
  if (!allowed()) return;

  const THRESHOLDS = [25, 50, 75, 100];
  const fired = new Set();

  function onScroll() {
    let pct;

    if (el === window || el === document.documentElement) {
      const scrolled  = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      pct = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 100;
    } else {
      const scrolled  = el.scrollTop;
      const maxScroll = el.scrollHeight - el.clientHeight;
      pct = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 100;
    }

    for (const threshold of THRESHOLDS) {
      if (!fired.has(threshold) && pct >= threshold) {
        fired.add(threshold);
        track(eventName, { ...data, depth: threshold });
      }
    }

    if (fired.size === THRESHOLDS.length) {
      el.removeEventListener("scroll", onScroll);
    }
  }

  el.addEventListener("scroll", onScroll, { passive: true });
}

// ─── trackTimeOnSite() ───────────────────────────────────────────────────────

export function trackTimeOnSite() {
  if (!allowed()) return;

  const HEARTBEAT_INTERVAL_MS = 30_000;

  let totalVisibleMs  = 0;
  let segmentStart    = document.visibilityState === "visible" ? Date.now() : null;
  let heartbeatTimer  = null;
  let exitFired       = false;

  // ── Helpers ──────────────────────────────────────────────────────────────

  function visibleSeconds() {
    const activeMs = segmentStart ? Date.now() - segmentStart : 0;
    return Math.round((totalVisibleMs + activeMs) / 1000);
  }

  function startHeartbeat() {
    if (heartbeatTimer !== null) return;
    heartbeatTimer = setInterval(() => {
      const seconds = visibleSeconds();
      track("session_heartbeat", { seconds });
    }, HEARTBEAT_INTERVAL_MS);
  }

  function stopHeartbeat() {
    if (heartbeatTimer === null) return;
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }

  function onBecomeVisible() {
    segmentStart = Date.now();
    startHeartbeat();
  }

  function onBecomeHidden() {
    if (segmentStart !== null) {
      totalVisibleMs += Date.now() - segmentStart;
      segmentStart = null;
    }
    stopHeartbeat();
  }

  function fireExit() {
    if (exitFired) return;
    exitFired = true;
    if (segmentStart !== null) {
      totalVisibleMs += Date.now() - segmentStart;
      segmentStart = null;
    }
    track("page_exit", { seconds: Math.round(totalVisibleMs / 1000) });
  }

  // ── Wire up ──────────────────────────────────────────────────────────────

  if (document.visibilityState === "visible") {
    startHeartbeat();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      fireExit();
      onBecomeHidden();
    } else {
      exitFired = false; 
      onBecomeVisible();
    }
  });

  window.addEventListener("beforeunload", fireExit);
}
