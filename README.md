# Fidelitus Gallery — website (frontend only)

React + Vite + Tailwind + Framer Motion. No server or database needed.

## Run it
```
npm install      # first time only
npm run dev      # opens on http://localhost:5173
```

## Publish it
```
npm run build    # creates the "dist" folder
```
Upload the `dist` folder to any static host (Netlify, Vercel, GitHub Pages, cPanel…).
Single-page app: set the host to send unknown paths to `index.html`.
On Netlify, the included `public/_redirects` already does this.

## Where things are
- Paintings, artist, exhibitions → `src/data/catalog.js`
- Services → `src/data/services.js`
- Home page (SUMI style) → `src/pages/Home.jsx` and `src/components/sumi/`
- Navbar / footer for the other pages → `src/components/layout/`
- Images → `src/assets/`
- The contact form opens the visitor's email app, addressed to `CONTACT_EMAIL` in `src/data/catalog.js`.
