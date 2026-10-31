// Sets defaults, counts skipped ads and turns network blocking on/off with the popup switch.
chrome.runtime.onInstalled.addListener(async () => {
  const { enabled } = await chrome.storage.local.get("enabled");
  if (enabled === undefined) await chrome.storage.local.set({ enabled: true, skipped: 0 });
  applyRules((await chrome.storage.local.get("enabled")).enabled);
});

chrome.storage.onChanged.addListener((changes) => {
  if ("enabled" in changes) applyRules(changes.enabled.newValue);
});

function applyRules(on) {
  chrome.declarativeNetRequest.updateEnabledRulesets(
    on ? { enableRulesetIds: ["ad_rules"] } : { disableRulesetIds: ["ad_rules"] }
  );
}

// Count one ad at a time so reports arriving together don't overwrite each other.
let counting = Promise.resolve();
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type !== "adSkipped") return;
  counting = counting.then(async () => {
    const { skipped = 0 } = await chrome.storage.local.get("skipped");
    await chrome.storage.local.set({ skipped: skipped + 1 });
  });
});
