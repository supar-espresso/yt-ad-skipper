# yt-ad-skipper
vibe-coded browser extension that skips YouTube ads

> ⚠️ **For Google Chrome on desktop only** (Windows, Mac, Linux).
> It does not work in the YouTube phone/TV apps or in Chrome on Android/iPhone.

## Install (2 minutes)

1. At the top of this page click the green **Code** button → **Download ZIP**.
2. Unzip it somewhere permanent (e.g. Documents). You'll get a folder called `yt-ad-skipper-main`. Don't delete it afterwards, because Chrome loads the extension from it.
3. Open Chrome and go to `chrome://extensions`
4. Turn on **Developer mode** (top-right switch).
5. Click **Load unpacked** and choose the `yt-ad-skipper-main` folder (the one containing `manifest.json`).
6. Pin it (puzzle-piece icon → pin) and refresh any open YouTube tabs.

Click the icon to turn it on/off and see how many ads were skipped.

## How it works
| File | Job |
|---|---|
| `manifest.json` | Tells Chrome what the extension is and what it may access (Manifest V3). |
| `rules.json` | Network rules: Chrome blocks ad requests made by YouTube pages before they load. Other websites are not affected. |
| `content.js` | Runs inside YouTube: when the player has the `ad-showing` class it mutes, fast-forwards and clicks "Skip", then restores your volume and speed. |
| `hide.css` | Hides banner, feed, sidebar and overlay ads, plus the anti-adblock pop-up. |
| `background.js` | Counts skipped ads and turns the network rules on/off when you flip the switch. |
| `popup.html/js` | The small on/off panel. |

## If ads come back
YouTube changes its page often. Right-click the ad → Inspect, find its element name
(e.g. `ytd-something-ad-renderer`) and add it to `hide.css`, then click the reload icon in `chrome://extensions`.

## Updating
Download the ZIP again, replace the old folder's contents with the new ones, then click the reload icon on the extension in `chrome://extensions`.

## License
[MIT](LICENSE): free to use, change and share.
