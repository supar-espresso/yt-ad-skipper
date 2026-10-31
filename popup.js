const toggle = document.getElementById("toggle");
const count = document.getElementById("count");

chrome.storage.local.get({ enabled: true, skipped: 0 }, (s) => {
  toggle.checked = s.enabled;
  count.textContent = s.skipped;
});

toggle.addEventListener("change", () => chrome.storage.local.set({ enabled: toggle.checked }));
