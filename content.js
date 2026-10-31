// YT Ad Skipper: skips video ads and toggles the CSS that hides page ads.
(() => {
  let enabled = true;
  let inAd = false;
  let saved = null; // the user's mute/speed settings from before the ad
  let nagSeen = false; // resume once per anti-adblock pop-up, never force-play

  const SKIP_BUTTONS = [
    ".ytp-skip-ad-button",
    ".ytp-ad-skip-button",
    ".ytp-ad-skip-button-modern",
    ".videoAdUiSkipButton",
  ].join(",");

  chrome.storage.local.get({ enabled: true }, (s) => setEnabled(s.enabled));
  chrome.storage.onChanged.addListener((c) => {
    if ("enabled" in c) setEnabled(c.enabled.newValue);
  });

  function setEnabled(on) {
    enabled = on;
    document.documentElement.classList.toggle("ytab-on", on);
  }

  function tick() {
    if (!enabled) return;
    const player = document.querySelector("#movie_player");
    if (!player) return;
    const video = player.querySelector("video");
    const adShowing = player.classList.contains("ad-showing");

    if (adShowing && video) {
      if (!inAd) {
        inAd = true;
        saved = { muted: video.muted, rate: video.playbackRate };
        countSkip();
      }
      video.muted = true;
      video.playbackRate = 16;
      if (isFinite(video.duration) && video.duration > 0) {
        video.currentTime = video.duration - 0.1;
      }
      document.querySelectorAll(SKIP_BUTTONS).forEach((b) => b.click());
    } else if (inAd) {
      inAd = false;
      if (video && saved) {
        video.muted = saved.muted;
        video.playbackRate = saved.rate === 16 ? 1 : saved.rate;
      }
      saved = null;
    }

    // If the "ad blockers are not allowed" pop-up paused the video, resume it once.
    const nag = document.querySelector("ytd-enforcement-message-view-model");
    if (nag && !nagSeen) {
      nagSeen = true;
      nag.closest("tp-yt-paper-dialog")?.remove();
      document.querySelector("tp-yt-iron-overlay-backdrop")?.remove();
      if (video && video.paused) video.play().catch(() => {});
    } else if (!nag) {
      nagSeen = false;
    }
  }

  function countSkip() {
    // The background script does the counting so tabs can't overwrite each other.
    try {
      chrome.runtime.sendMessage({ type: "adSkipped" }).catch(() => {});
    } catch {} // extension was reloaded; this old copy of the script can't talk to it
  }

  // Run at most once per frame however often YouTube changes the page,
  // with a timer as a backup (frames pause in background tabs).
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      tick();
    });
  };

  const start = () => {
    new MutationObserver(schedule).observe(document.documentElement, {
      childList: true, subtree: true, attributes: true, attributeFilter: ["class"],
    });
    setInterval(tick, 300);
  };
  if (document.documentElement) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
