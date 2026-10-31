// YT Ad Skipper: skips video ads and toggles the CSS that hides page ads.
(() => {
  let enabled = true;
  let inAd = false;
  let saved = null; // the user's mute/speed settings from before the ad

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

    // If the "ad blockers are not allowed" pop-up paused the video, resume it.
    const nag = document.querySelector("ytd-enforcement-message-view-model");
    if (nag) {
      nag.closest("tp-yt-paper-dialog")?.remove();
      document.querySelector("tp-yt-iron-overlay-backdrop")?.remove();
      if (video && video.paused) video.play().catch(() => {});
    }
  }

  function countSkip() {
    chrome.storage.local.get({ skipped: 0 }, (s) =>
      chrome.storage.local.set({ skipped: s.skipped + 1 })
    );
  }

  // React fast to page changes, with a timer as a backup.
  const start = () => {
    new MutationObserver(tick).observe(document.documentElement, {
      childList: true, subtree: true, attributes: true, attributeFilter: ["class"],
    });
    setInterval(tick, 300);
  };
  if (document.documentElement) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
