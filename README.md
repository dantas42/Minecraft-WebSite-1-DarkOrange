# Minecraft-WebSite DarkOrange

Website template for Minecraft servers, built with plain HTML, CSS and JavaScript — no frameworks, no build step, no dependencies.

## Two versions side by side

| Version | Location | Status |
| --- | --- | --- |
| **v1 — original** | repository root: `index.html`, `css/`, `js/`, `img/` | untouched, exactly as it was in 2022 |
| **v2 — modernized** | [`v2/`](v2/index.html) | current version |

The original files were **not modified or moved**, so the old demo links keep working and both versions can be compared side by side. The v2 footer links back to the original.

Online demo (v1, GitHub Pages): https://tiagox42.github.io/Minecraft-WebSite-1-DarkOrange/
New version: open `v2/index.html` (or `/v2/`) on the same host.

## What changed in v2

### Fixed bugs

- **Server status was permanently stuck on `...`.** The old page loaded `mcapi.us`, whose API is offline, so `MinecraftAPI` never resolved (and the error handler pointed at a `.server-status` class that did not exist). v2 calls `api.mcsrvstat.us/3/<host>` with `fetch`, an 8s abort timeout, an offline state and a refresh every 60s. The status dot is colored from the real result instead of a `setTimeout(2000)` guess.
- **Copy IP** now has a clipboard fallback for non-secure contexts and shows a confirmation toast. It is a real `<button>` (keyboard accessible) instead of a `div` with `onclick`.
- **Broken links removed:** `href="discord.com"` was a relative URL (404), the six shop "BUY" buttons all redirected to GitHub, and news pagination pointed to `#`. The shop now reads a single configurable store URL and, while it is empty, renders honest "Coming soon" buttons instead of a redirect.
- **Dead remote assets removed.** Every imgur banner in v1 returns the 503-byte "image not found" placeholder; wallpapersafari and teahub hosts no longer resolve and the Fandom item icons return 403. v2 ships local WebP images and hand-made pixel-art SVG icons instead of hotlinks.
- **Placeholder content replaced:** the tutorial videos were unrelated music videos, the staff list repeated the same nickname four times, and the pages were full of Lorem ipsum. v2 has real template copy, four staff slots (one filled, three open), and no fake video embeds.
- **No more `try { ... } catch (e) {}`** around the whole page setup, and no duplicated `openContent1..4` functions.

### Modernized

- One responsive stylesheet (`v2/css/style.css`) with CSS custom properties: flex/grid instead of floats, `clamp()` typography, real breakpoints, no `margin-left: 40vh` magic numbers. Checked at 390px and 1440px with no horizontal overflow.
- Semantic HTML5: single `h1` per page, `<main>`, `<nav>`, skip link, `aria-current="page"`, real headings, focus-visible outlines, `prefers-reduced-motion` support.
- Accordions use native `<details>/<summary>` — no JavaScript needed, works with keyboard and screen readers.
- Performance: image payload went from **2.06 MB to 151 KB** (-93%). Social icons were 4096×4096 PNGs; they are now 96×96 WebP. Logo and character art are WebP. The total site is **311 KB**.
- `defer` scripts, no inline event handlers, external links use `rel="noopener noreferrer"`, the Discord widget is lazy-loaded and sandboxed.
- Meta tags per page: description, Open Graph, `theme-color`, correct favicon links.
- All outbound destinations live in one config file (`v2/js/config.js`): server host/port, Discord, Instagram, YouTube, store URL, refresh interval.

## Run locally

Any static file server works, for example:

```bash
bunx serve .
# or
python -m http.server 8080
```

Then open `http://localhost:8080/v2/`. There is no build step, no `package.json` and nothing to install.

## Customize v2

1. `v2/js/config.js` — server IP/port, social links, store URL, status refresh rate.
2. `v2/index.html` — hero text, feature cards, testimonials.
3. `v2/news.html` — news articles (sample copy included).
4. `v2/information.html` — rules, PvP, economy, housing, Discord widget.
5. `v2/shop.html` — ranks, prices and perks.
6. `v2/help.html` — FAQ and staff list.
7. Colors, fonts and spacing — CSS variables at the top of `v2/css/style.css`.

## Still needing real data (on purpose)

This is a template, not a finished store. These values are placeholders for the owner to fill in:

- `links.store` in `v2/js/config.js` is empty, so shop buttons show "Coming soon". Point it to your Tebex/Buycraft page to enable checkout.
- `links.discord` points to `https://discord.com/` — replace it with your server invite.
- News articles, prices and FAQ answers are sample content written to fit the theme.
- The staff list has three open positions; edit `v2/help.html`.
- The Discord widget server id in `v2/information.html` was kept from v1 — update it to your own server id.

## Structure

```text
v2/
├── index.html
├── news.html
├── information.html
├── shop.html
├── help.html
├── css/style.css
├── js/config.js
├── js/core.js
├── img/            # WebP art + pixel-art SVG icons
├── font/           # Vampire Wars display font
└── favicon*
```

## Deploy

The repository is a static site, so GitHub Pages can serve it as is: the root is v1 and `/v2/` is the new version. To make v2 the main site, publish the contents of `v2/` at the root (or configure Pages to use that folder).

## Credit

**It is not allowed to sell or repost the files elsewhere.** If you use the website on your server, please credit this repository.
