# yt-ad-skipper
vibe-coded browser extension that skips YouTube ads

> ⚠️ **For Google Chrome on desktop only** (Windows, Mac, Linux).
> It does not work in the YouTube phone/TV apps or in Chrome on Android/iPhone.

## Install (2 minutes)

1. Unzip `yt-adblock.zip` somewhere permanent (e.g. Documents/yt-adblock). Don't delete the folder afterwards, because Chrome loads the extension from it.
2. Open Chrome and go to `chrome://extensions`
3. Turn on **Developer mode** (top-right switch).
4. Click **Load unpacked** and choose the unzipped `yt-adblock` folder (the one containing `manifest.json`).
5. Pin it (puzzle-piece icon → pin) and refresh any open YouTube tabs.

Click the icon to turn it on/off and see how many ads were skipped.

## How it works
| File | Job |
|---|---|
| `manifest.json` | Tells Chrome what the extension is and what it may access (Manifest V3). |
| `rules.json` | Network rules: Chrome blocks requests to ad servers before they load. |
| `content.js` | Runs inside YouTube: when the player has the `ad-showing` class it mutes, fast-forwards and clicks "Skip", then restores your volume and speed. |
| `hide.css` | Hides banner, feed, sidebar and overlay ads, plus the anti-adblock pop-up. |
| `background.js` | Turns the network rules on/off when you flip the switch. |
| `popup.html/js` | The small on/off panel. |

## If ads come back
YouTube changes its page often. Right-click the ad → Inspect, find its element name
(e.g. `ytd-something-ad-renderer`) and add it to `hide.css`, then click the reload icon in `chrome://extensions`.
