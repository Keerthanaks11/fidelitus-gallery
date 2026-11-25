# Fidelitus Gallery — SUMI-style update

## How to use
1. Replace your `client/src`, `client/public`, `client/index.html` and `client/tailwind.config.js` with the ones in this zip.
2. Keep your own `client/.env` and `client/node_modules` (not included).
3. Run `npm run dev` as usual. **No new packages to install.**

## What changed
- **Videos removed** — `hero.mp4` and `art.mp4` are deleted, and no code uses them any more.
- **Images compressed** — 44.7 MB → 6.9 MB (photos resized to max 2000 px). `background.png` is now `background.jpg`.
- **New hero** (`components/home/Hero.jsx`) — large headline plus a WebGL "living canvas" (`components/fx/InkGL.js`)
  with an ink/flame dissolve between paintings, a mouse ripple and a scroll bend. Click or swipe it for the next painting.
- **Smooth scrolling** (`components/fx/SmoothScroll.jsx`) — Lenis-style, desktop only.
- **Page transitions** (`components/layout/Layout.jsx`) — a dark curtain covers the old page and opens on the new one.
- **Opening loader** (`components/fx/Preloader.jsx`) — logo plus a 000→100 counter, shown once per visit.
- **Custom cursor** (`components/fx/Cursor.jsx`) — ring that grows over links and shows a word over `data-cursor="Word"` elements.
- **Scroll reveals** (`components/fx/AutoReveal.jsx`) — every section heading rises in. Add `data-reveal` to anything else you want to animate.
- **Fonts** — Cormorant Garamond (display), Roboto (text, like SUMI), Montserrat (section headings) from Google Fonts.

## Fixes
- `Home.jsx` rendered `<ServiceIcon />` and `<ServiceScene />` on their own — this was the stray palette drawing. Removed.
- `Home.jsx` imported `pagebackground.jsx` in lowercase. This works on Windows but **breaks on Linux hosting**. Fixed.
- Navbar, footer and loader now use the local logo `src/assets/Fidelitus_art_gallery_logo.png`.
- The footer has a solid dark base, so it looks right on white pages too.

## To edit
- Hero headline, slides and painting titles: top of `components/home/Hero.jsx` (two slides say "Original Work" — rename them).
- Smooth-scroll feel: `EASE` in `components/fx/SmoothScroll.jsx`.
- Show the loader on every load: remove the `sessionStorage` lines in `components/fx/Preloader.jsx`.

## SUMI-style home page (second update)
The home page (`src/pages/Home.jsx`) is now a SUMI-style page built from `src/components/sumi/`:
- `SumiHeader.jsx` — transparent minimal header with a white logo; hides on scroll down. "Menu" opens a full-screen menu.
- `SumiHero.jsx` — full-screen paintings in muted colour with drifting charcoal smoke and a burning dissolve; centred "FIDELITUS GALLERY".
- `Concept.jsx` (01), `CollectionSlider.jsx` (02, drag slider), `ServiceList.jsx` (03, list with floating photo),
  `Films.jsx` (04, one player plus a list), `GiveBack.jsx` (05 Story · 06 Visit), `SumiFooter.jsx`.
- Images are black-and-white and turn colour on hover. Images are uncovered as you scroll and drift slowly.
- The blue navbar and the normal footer are still used on all other pages (`Layout.jsx` picks them by page).
- The old home sections are still in `src/components/home/` if you want any of them back.
- Placeholders to fill: "Original Work" titles (CollectionSlider, Hero), film titles and channel link (Films).

## Frontend only (third update)
- The server/database is no longer needed. Paintings, artist and exhibitions now come from `src/data/catalog.js`.
- The contact form opens the visitor's email app, already filled in. A static site has no server to store messages.
- Removed: the admin pages and login (they needed the database), axios, and the `/api` proxy in `vite.config.js`.
- Prices show in ₹. `null` shows "Price on request".
- Gallery filters are now Painting · Drawing · Mural (`src/utils/constants.js`).
