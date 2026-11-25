import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import img1 from "../../assets/01.jpeg";
import img2 from "../../assets/02.jpeg";
import img3 from "../../assets/03.jpeg";
import img4 from "../../assets/04.jpeg";
import img5 from "../../assets/05.jpeg";
import img6 from "../../assets/06.jpg";
import img7 from "../../assets/07.jpeg";
import img8 from "../../assets/08.jpeg";

/* =====================================================================
   CURVED GALLERY — "Key Differentiators" layout
   See-through: the fixed page background (PageBackground) shows behind.
   Left: dark glass panel with heading + button.
   Right: flip cards (photo on the front, details on the back).
   One card flips by itself every few seconds; hovering flips any card.
   All motion switches off for visitors who prefer reduced motion.
   ===================================================================== */

// Edit labels, text and links here
const ITEMS = [
  { label: "Beginner Artworks", text: "Easy first pieces to start your collection.", img: img1, to: "/gallery" },
  { label: "Shop for Home", text: "Handpainted art to lift every room.", img: img2, to: "/gallery" },
  { label: "Gift Artworks", text: "Thoughtful, one-of-a-kind gifts.", img: img3, to: "/gallery" },
  { label: "Speak with Art Planner", text: "Get personal guidance from our experts.", img: img4, to: "/contact" },
  { label: "All Handpainted Artworks", text: "Browse the complete handpainted range.", img: img5, to: "/gallery" },
  { label: "Paintings Under 10K", text: "Beautiful originals at friendly prices.", img: img6, to: "/gallery" },
  { label: "As Seen on Shark Tank", text: "The pieces everyone is talking about.", img: img7, to: "/gallery" },
  { label: "Ready to Ship", text: "In stock and on its way to you fast.", img: img8, to: "/gallery" },
];

// ---- Easy settings ----
const FLIP_TIME = 2200;          // ms between automatic flips
const PANEL_BUTTON = { text: "Speak with Art Planner", to: "/contact" };
const CARD_LINK_TEXT = "Explore";

// ---- Colours (black & white) ----
const BLACK = "#0a0a0a";
const INK = "#111111";
const WHITE = "#ffffff";

const pad = (v) => String(v).padStart(2, "0");

const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12 H20 M13 5 L20 12 L13 19" />
  </svg>
);

const CSS = `
.kd-root {
  position: relative; z-index: 0; isolation: isolate; overflow: hidden;
  background: transparent; color: #fff;
  padding: 40px 0;
  font-family: Montserrat, system-ui, sans-serif;
}
.kd-layout { position: relative; display: grid; overflow: hidden; background: transparent; }
@media (min-width: 768px) { .kd-root { padding: 64px 0; } }
@media (min-width: 1024px) { .kd-layout { grid-template-columns: 40% 60%; } }

/* Left panel */
.kd-panel {
  position: relative; display: flex; align-items: center;
  min-height: 340px; padding: 52px 28px;
  background: rgba(0,0,0,.35);
  border-right: 1px solid rgba(255,255,255,.14);
  -webkit-backdrop-filter: blur(14px) saturate(130%); backdrop-filter: blur(14px) saturate(130%);
}
@media (min-width: 640px) { .kd-panel { padding: 52px 42px; } }
@media (min-width: 1024px) { .kd-panel { min-height: 580px; padding-right: 110px; } }
.kd-panel-body { position: relative; max-width: 25rem; }
.kd-panel h2 { margin: 0; font-size: 30px; font-weight: 800; line-height: 1.2; color: #fff; }
@media (min-width: 768px) { .kd-panel h2 { font-size: 37px; } }
.kd-panel-bar { display: block; width: 66px; height: 5px; margin-top: 16px; border-radius: 999px; background: ${WHITE}; }
.kd-panel p { margin: 20px 0 0; font-size: 15px; line-height: 1.8; color: rgba(255,255,255,.85); }
.kd-panel-btn {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 26px;
  padding: 10px 21px; border: 2px solid ${WHITE}; border-radius: 2px; background: ${WHITE}; color: ${INK};
  font-size: 14px; font-weight: 600; text-decoration: none;
  transition: background-color .3s ease, color .3s ease;
}
.kd-panel-btn:hover { background: transparent; color: ${WHITE}; }

/* Right: cards area (overlaps the panel on large screens) */
.kd-cards-wrap { position: relative; padding: 44px 22px; }
@media (min-width: 640px) { .kd-cards-wrap { padding: 44px 34px; } }
@media (min-width: 1024px) { .kd-cards-wrap { margin-left: -66px; padding: 64px 40px 64px 0; } }

.kd-grid { display: grid; gap: 20px; }
@media (min-width: 640px) { .kd-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1280px) { .kd-grid { grid-template-columns: repeat(4, 1fr); } }

/* Flip card */
.kd-card { display: block; height: 16.5rem; perspective: 1200px; text-decoration: none; color: inherit; }
.kd-inner {
  position: relative; height: 100%;
  transform-style: preserve-3d;
  transition: transform .7s cubic-bezier(.22,1,.36,1);
}
.kd-card:hover .kd-inner,
.kd-card:focus-visible .kd-inner,
.kd-inner.kd-flipped { transform: rotateY(180deg); }
.kd-card:focus-visible { outline: none; }
.kd-card:focus-visible .kd-back { outline: 3px solid ${WHITE}; outline-offset: 3px; }

.kd-face {
  position: absolute; inset: 0; overflow: hidden;
  -webkit-backface-visibility: hidden; backface-visibility: hidden;
}

/* Front — full photo with glass panels */
.kd-front { background: ${BLACK}; box-shadow: 0 16px 36px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.1); }
.kd-photo { position: absolute; inset: 0; overflow: hidden; background: #222; }
.kd-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.kd-photo-shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.6) 0%, rgba(0,0,0,.15) 45%, rgba(0,0,0,0) 70%); }

.kd-glass {
  background: rgba(255,255,255,.14);
  border: 1px solid rgba(255,255,255,.32);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);
  box-shadow: 0 8px 24px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.25);
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .kd-glass { background: rgba(20,20,20,.6); }
}

.kd-badge {
  position: absolute; left: 14px; top: 14px;
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 999px;
  color: ${WHITE}; font-size: 12px; font-weight: 800;
}
.kd-front-body {
  position: absolute; left: 12px; right: 12px; bottom: 12px;
  padding: 14px 16px; border-radius: 6px; color: ${WHITE};
}
.kd-front-body h3 { margin: 0; font-size: 16px; font-weight: 700; line-height: 1.35; color: ${WHITE}; }
.kd-small-bar { display: block; width: 32px; height: 3px; margin-top: 10px; border-radius: 999px; background: ${WHITE}; }

/* Back */
.kd-back {
  transform: rotateY(180deg);
  display: flex; flex-direction: column; justify-content: center;
  padding: 22px; color: #fff;
  background-size: cover; background-position: center;
  box-shadow: 0 14px 30px rgba(0,0,0,.3);
}
.kd-back-shade {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,.94) 0%, rgba(12,12,12,.9) 55%, rgba(30,30,30,.86) 100%);
}
.kd-back-num {
  position: absolute; right: -4px; bottom: -14px;
  font-size: 88px; font-weight: 800; line-height: 1; color: rgba(255,255,255,.1);
}
.kd-back > *:not(.kd-back-shade):not(.kd-back-num) { position: relative; }
.kd-back h3 { margin: 12px 0 0; font-size: 16px; font-weight: 700; line-height: 1.35; }
.kd-back p { margin: 10px 0 0; font-size: 13px; line-height: 1.6; color: rgba(255,255,255,.9); }
.kd-back-link {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 14px;
  font-size: 13px; font-weight: 600; color: #fff;
}
.kd-back-link svg { transition: transform .3s ease; }
.kd-card:hover .kd-back-link svg { transform: translateX(4px); }

.kd-panel-btn:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  .kd-inner { transition: none; }
}
`;

export default function CurvedGallery() {
  const n = ITEMS.length;
  const [flipIndex, setFlipIndex] = useState(0);
  const [flipPaused, setFlipPaused] = useState(false);

  // Flip one card at a time automatically
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || flipPaused) return;
    const id = setInterval(() => setFlipIndex((a) => (a + 1) % n), FLIP_TIME);
    return () => clearInterval(id);
  }, [flipPaused, n]);

  return (
    <section className="kd-root">
      <style>{CSS}</style>

      <div className="kd-layout">
        {/* Left: photo with blue overlay */}
        <div className="kd-panel">
          <div className="kd-panel-body">
            <h2>Authentic Indian Art, Paintings &amp; Handcrafted Home Decor</h2>
            <span className="kd-panel-bar" aria-hidden="true" />
            <p>Handpainted originals, thoughtful gifts and pieces ready for every room.</p>
            <Link to={PANEL_BUTTON.to} className="kd-panel-btn">
              {PANEL_BUTTON.text}
            </Link>
          </div>
        </div>

        {/* Right: flip cards */}
        <div className="kd-cards-wrap">
          <div
            className="kd-grid"
            onMouseEnter={() => setFlipPaused(true)}
            onMouseLeave={() => setFlipPaused(false)}
          >
            {ITEMS.map((item, i) => {
              const flipped = !flipPaused && flipIndex === i;
              return (
                <Link key={item.label} to={item.to} className="kd-card" aria-label={`${item.label}: ${item.text}`}>
                  <div className={`kd-inner ${flipped ? "kd-flipped" : ""}`}>
                    {/* Front */}
                    <div className="kd-face kd-front">
                      <div className="kd-photo">
                        <img src={item.img} alt="" loading="lazy" decoding="async" draggable={false} />
                        <div className="kd-photo-shade" aria-hidden="true" />
                      </div>
                      <span className="kd-badge kd-glass" aria-hidden="true">{pad(i + 1)}</span>
                      <div className="kd-front-body kd-glass">
                        <h3>{item.label}</h3>
                        <span className="kd-small-bar" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Back */}
                    <div className="kd-face kd-back" style={{ backgroundImage: `url(${item.img})` }} aria-hidden="true">
                      <div className="kd-back-shade" />
                      <span className="kd-back-num">{pad(i + 1)}</span>
                      <span className="kd-small-bar" style={{ marginTop: 0 }} />
                      <h3>{item.label}</h3>
                      <p>{item.text}</p>
                      <span className="kd-back-link">
                        {CARD_LINK_TEXT} <Arrow />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// import img1 from "../../assets/01.jpeg";
// import img2 from "../../assets/02.jpeg";
// import img3 from "../../assets/03.jpeg";
// import img4 from "../../assets/04.jpeg";
// import img5 from "../../assets/05.jpeg";
// import img6 from "../../assets/06.jpg";
// import img7 from "../../assets/07.jpeg";
// import img8 from "../../assets/08.jpeg";

// /* =====================================================================
//    CURVED GALLERY — "Key Differentiators" layout
//    Left: blue panel with heading + button.
//    Right: flip cards (photo on the front, details on the back).
//    One card flips by itself every few seconds; hovering flips any card.
//    All motion switches off for visitors who prefer reduced motion.
//    ===================================================================== */

// // Edit labels, text and links here
// const ITEMS = [
//   { label: "Beginner Artworks", text: "Easy first pieces to start your collection.", img: img1, to: "/gallery" },
//   { label: "Shop for Home", text: "Handpainted art to lift every room.", img: img2, to: "/gallery" },
//   { label: "Gift Artworks", text: "Thoughtful, one-of-a-kind gifts.", img: img3, to: "/gallery" },
//   { label: "Speak with Art Planner", text: "Get personal guidance from our experts.", img: img4, to: "/contact" },
//   { label: "All Handpainted Artworks", text: "Browse the complete handpainted range.", img: img5, to: "/gallery" },
//   { label: "Paintings Under 10K", text: "Beautiful originals at friendly prices.", img: img6, to: "/gallery" },
//   { label: "As Seen on Shark Tank", text: "The pieces everyone is talking about.", img: img7, to: "/gallery" },
//   { label: "Ready to Ship", text: "In stock and on its way to you fast.", img: img8, to: "/gallery" },
// ];

// // ---- Easy settings ----
// const FLIP_TIME = 2200;          // ms between automatic flips
// const PANEL_IMAGE = img5;        // photo behind the blue left panel
// const PANEL_BUTTON = { text: "Speak with Art Planner", to: "/contact" };
// const CARD_LINK_TEXT = "Explore";

// // ---- Colours (black & white) ----
// const BLACK = "#0a0a0a";
// const INK = "#111111";
// const WHITE = "#ffffff";

// const pad = (v) => String(v).padStart(2, "0");

// const Arrow = () => (
//   <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M4 12 H20 M13 5 L20 12 L13 19" />
//   </svg>
// );

// const CSS = `
// .kd-root {
//   position: relative; z-index: 0; isolation: isolate; overflow: hidden;
//   background: #ffffff; color: #333;
//   padding: 40px 0;
//   font-family: Montserrat, system-ui, sans-serif;
// }
// /* Black background with pink glowing edges + grid lines (same as Services) */
// .kd-glow {
//   position: absolute; inset: 0; z-index: 2; pointer-events: none;
//   box-shadow: inset 0 0 120px rgba(255,46,99,.28), inset 0 0 40px rgba(255,46,99,.2);
// }
// .kd-grid-lines {
//   position: absolute; right: 0; bottom: 0; width: 60%; height: 70%; pointer-events: none;
//   background-image:
//     linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
//     linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
//   background-size: 44px 44px;
//   -webkit-mask-image: radial-gradient(ellipse at bottom right, #000 20%, transparent 70%);
//   mask-image: radial-gradient(ellipse at bottom right, #000 20%, transparent 70%);
// }

// .kd-layout { position: relative; display: grid; overflow: hidden; background: #000; }
// @media (min-width: 768px) { .kd-root { padding: 64px 0; } }
// @media (min-width: 1024px) { .kd-layout { grid-template-columns: 40% 60%; } }

// /* Left panel */
// .kd-panel {
//   position: relative; display: flex; align-items: center;
//   min-height: 340px; padding: 52px 28px;
//   background-color: ${BLACK}; background-size: cover; background-position: center;
// }
// @media (min-width: 640px) { .kd-panel { padding: 52px 42px; } }
// @media (min-width: 1024px) { .kd-panel { min-height: 580px; padding-right: 110px; } }
// .kd-panel-shade {
//   position: absolute; inset: 0;
//   background: linear-gradient(135deg, rgba(0,0,0,.9) 0%, rgba(10,10,10,.82) 50%, rgba(25,25,25,.75) 100%);
// }
// .kd-panel-body { position: relative; max-width: 25rem; }
// .kd-panel h2 { margin: 0; font-size: 30px; font-weight: 800; line-height: 1.2; color: #fff; }
// @media (min-width: 768px) { .kd-panel h2 { font-size: 37px; } }
// .kd-panel-bar { display: block; width: 66px; height: 5px; margin-top: 16px; border-radius: 999px; background: ${WHITE}; }
// .kd-panel p { margin: 20px 0 0; font-size: 15px; line-height: 1.8; color: rgba(255,255,255,.85); }
// .kd-panel-btn {
//   display: inline-flex; align-items: center; gap: 8px; margin-top: 26px;
//   padding: 10px 21px; border: 2px solid ${WHITE}; border-radius: 2px; background: ${WHITE}; color: ${INK};
//   font-size: 14px; font-weight: 600; text-decoration: none;
//   transition: background-color .3s ease, color .3s ease;
// }
// .kd-panel-btn:hover { background: transparent; color: ${WHITE}; }

// /* Right: cards area (overlaps the panel on large screens) */
// .kd-cards-wrap { position: relative; padding: 44px 22px; }
// @media (min-width: 640px) { .kd-cards-wrap { padding: 44px 34px; } }
// @media (min-width: 1024px) { .kd-cards-wrap { margin-left: -66px; padding: 64px 40px 64px 0; } }

// .kd-grid { display: grid; gap: 20px; }
// @media (min-width: 640px) { .kd-grid { grid-template-columns: repeat(2, 1fr); } }
// @media (min-width: 1280px) { .kd-grid { grid-template-columns: repeat(4, 1fr); } }

// /* Flip card */
// .kd-card { display: block; height: 16.5rem; perspective: 1200px; text-decoration: none; color: inherit; }
// .kd-inner {
//   position: relative; height: 100%;
//   transform-style: preserve-3d;
//   transition: transform .7s cubic-bezier(.22,1,.36,1);
// }
// .kd-card:hover .kd-inner,
// .kd-card:focus-visible .kd-inner,
// .kd-inner.kd-flipped { transform: rotateY(180deg); }
// .kd-card:focus-visible { outline: none; }
// .kd-card:focus-visible .kd-back { outline: 3px solid ${WHITE}; outline-offset: 3px; }

// .kd-face {
//   position: absolute; inset: 0; overflow: hidden;
//   -webkit-backface-visibility: hidden; backface-visibility: hidden;
// }

// /* Front — full photo with glass panels */
// .kd-front { background: ${BLACK}; box-shadow: 0 12px 30px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06); }
// .kd-photo { position: absolute; inset: 0; overflow: hidden; background: #222; }
// .kd-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
// .kd-photo-shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.6) 0%, rgba(0,0,0,.15) 45%, rgba(0,0,0,0) 70%); }

// .kd-glass {
//   background: rgba(255,255,255,.14);
//   border: 1px solid rgba(255,255,255,.32);
//   -webkit-backdrop-filter: blur(14px) saturate(140%);
//   backdrop-filter: blur(14px) saturate(140%);
//   box-shadow: 0 8px 24px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.25);
// }
// @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
//   .kd-glass { background: rgba(20,20,20,.6); }
// }

// .kd-badge {
//   position: absolute; left: 14px; top: 14px;
//   display: flex; align-items: center; justify-content: center;
//   width: 40px; height: 40px; border-radius: 999px;
//   color: ${WHITE}; font-size: 12px; font-weight: 800;
// }
// .kd-front-body {
//   position: absolute; left: 12px; right: 12px; bottom: 12px;
//   padding: 14px 16px; border-radius: 6px; color: ${WHITE};
// }
// .kd-front-body h3 { margin: 0; font-size: 16px; font-weight: 700; line-height: 1.35; color: ${WHITE}; }
// .kd-small-bar { display: block; width: 32px; height: 3px; margin-top: 10px; border-radius: 999px; background: ${WHITE}; }

// /* Back */
// .kd-back {
//   transform: rotateY(180deg);
//   display: flex; flex-direction: column; justify-content: center;
//   padding: 22px; color: #fff;
//   background-size: cover; background-position: center;
//   box-shadow: 0 14px 30px rgba(0,0,0,.3);
// }
// .kd-back-shade {
//   position: absolute; inset: 0;
//   background: linear-gradient(135deg, rgba(0,0,0,.94) 0%, rgba(12,12,12,.9) 55%, rgba(30,30,30,.86) 100%);
// }
// .kd-back-num {
//   position: absolute; right: -4px; bottom: -14px;
//   font-size: 88px; font-weight: 800; line-height: 1; color: rgba(255,255,255,.1);
// }
// .kd-back > *:not(.kd-back-shade):not(.kd-back-num) { position: relative; }
// .kd-back h3 { margin: 12px 0 0; font-size: 16px; font-weight: 700; line-height: 1.35; }
// .kd-back p { margin: 10px 0 0; font-size: 13px; line-height: 1.6; color: rgba(255,255,255,.9); }
// .kd-back-link {
//   display: inline-flex; align-items: center; gap: 6px; margin-top: 14px;
//   font-size: 13px; font-weight: 600; color: #fff;
// }
// .kd-back-link svg { transition: transform .3s ease; }
// .kd-card:hover .kd-back-link svg { transform: translateX(4px); }

// .kd-panel-btn:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

// @media (prefers-reduced-motion: reduce) {
//   .kd-inner { transition: none; }
// }
// `;

// export default function CurvedGallery() {
//   const n = ITEMS.length;
//   const [flipIndex, setFlipIndex] = useState(0);
//   const [flipPaused, setFlipPaused] = useState(false);

//   // Flip one card at a time automatically
//   useEffect(() => {
//     const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     if (reduce || flipPaused) return;
//     const id = setInterval(() => setFlipIndex((a) => (a + 1) % n), FLIP_TIME);
//     return () => clearInterval(id);
//   }, [flipPaused, n]);

//   return (
//     <section className="kd-root">
//       <style>{CSS}</style>

//       <div className="kd-layout">
//         <div className="kd-grid-lines" aria-hidden="true" />
//         <div className="kd-glow" aria-hidden="true" />
//         {/* Left: photo with blue overlay */}
//         <div className="kd-panel" style={{ backgroundImage: `url(${PANEL_IMAGE})` }}>
//           <div className="kd-panel-shade" aria-hidden="true" />
//           <div className="kd-panel-body">
//             <h2>Authentic Indian Art, Paintings &amp; Handcrafted Home Decor</h2>
//             <span className="kd-panel-bar" aria-hidden="true" />
//             <p>Handpainted originals, thoughtful gifts and pieces ready for every room.</p>
//             <Link to={PANEL_BUTTON.to} className="kd-panel-btn">
//               {PANEL_BUTTON.text}
//             </Link>
//           </div>
//         </div>

//         {/* Right: flip cards */}
//         <div className="kd-cards-wrap">
//           <div
//             className="kd-grid"
//             onMouseEnter={() => setFlipPaused(true)}
//             onMouseLeave={() => setFlipPaused(false)}
//           >
//             {ITEMS.map((item, i) => {
//               const flipped = !flipPaused && flipIndex === i;
//               return (
//                 <Link key={item.label} to={item.to} className="kd-card" aria-label={`${item.label}: ${item.text}`}>
//                   <div className={`kd-inner ${flipped ? "kd-flipped" : ""}`}>
//                     {/* Front */}
//                     <div className="kd-face kd-front">
//                       <div className="kd-photo">
//                         <img src={item.img} alt="" loading="lazy" decoding="async" draggable={false} />
//                         <div className="kd-photo-shade" aria-hidden="true" />
//                       </div>
//                       <span className="kd-badge kd-glass" aria-hidden="true">{pad(i + 1)}</span>
//                       <div className="kd-front-body kd-glass">
//                         <h3>{item.label}</h3>
//                         <span className="kd-small-bar" aria-hidden="true" />
//                       </div>
//                     </div>

//                     {/* Back */}
//                     <div className="kd-face kd-back" style={{ backgroundImage: `url(${item.img})` }} aria-hidden="true">
//                       <div className="kd-back-shade" />
//                       <span className="kd-back-num">{pad(i + 1)}</span>
//                       <span className="kd-small-bar" style={{ marginTop: 0 }} />
//                       <h3>{item.label}</h3>
//                       <p>{item.text}</p>
//                       <span className="kd-back-link">
//                         {CARD_LINK_TEXT} <Arrow />
//                       </span>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
// import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";

// import img1 from "../../assets/01.jpeg";
// import img2 from "../../assets/02.jpeg";
// import img3 from "../../assets/03.jpeg";
// import img4 from "../../assets/04.jpeg";
// import img5 from "../../assets/05.jpeg";
// import img6 from "../../assets/06.jpg";
// import img7 from "../../assets/07.jpeg";
// import img8 from "../../assets/08.jpeg";

// // Edit labels, text and links here
// const ITEMS = [
//   { label: "Beginner Artworks", text: "Easy first pieces to start your collection.", img: img1, to: "/gallery" },
//   { label: "Shop for Home", text: "Handpainted art to lift every room.", img: img2, to: "/gallery" },
//   { label: "Gift Artworks", text: "Thoughtful, one-of-a-kind gifts.", img: img3, to: "/gallery" },
//   { label: "Speak with Art Planner", text: "Get personal guidance from our experts.", img: img4, to: "/contact" },
//   { label: "All Handpainted Artworks", text: "Browse the complete handpainted range.", img: img5, to: "/gallery" },
//   { label: "Paintings Under 10K", text: "Beautiful originals at friendly prices.", img: img6, to: "/gallery" },
//   { label: "As Seen on Shark Tank", text: "The pieces everyone is talking about.", img: img7, to: "/gallery" },
//   { label: "Ready to Ship", text: "In stock and on its way to you fast.", img: img8, to: "/gallery" },
// ];

// // ---- Easy settings ----
// const SPEED = 0.35;           // auto-scroll speed (cards per second). Negative = other direction
// const CARD_RATIO = 1.3;       // card height compared to width
// const GAP = 0.06;             // space between cards (part of card width)
// const SIDE_SHRINK = 0.1;      // how much each step away from centre shrinks the card
// const PAUSE_ON_HOVER = true;  // smoothly stops when the mouse is over it

// const CSS = `
// .cg-card {
//   position:absolute; top:50%; left:50%;
//   border-radius:20px; overflow:hidden; background:#eee;
//   box-shadow:0 12px 28px rgba(0,0,0,.14);
//   text-decoration:none; color:#fff; display:block;
// }
// .cg-card img {
//   position:absolute; inset:0; width:100%; height:100%;
//   object-fit:cover; pointer-events:none; user-select:none;
// }
// .cg-shade {
//   position:absolute; inset:0;
//   background:linear-gradient(to top, rgba(0,0,0,.72) 0%, rgba(0,0,0,0) 48%);
// }
// .cg-info { position:absolute; left:18px; right:18px; bottom:16px; }
// .cg-info h3 { margin:0; font-size:19px; font-weight:600; line-height:1.25; }
// .cg-info p {
//   margin:6px 0 0; font-size:13px; line-height:1.4; height:36px;
//   overflow:hidden; opacity:0; transition:opacity .3s ease;
// }
// .cg-card:hover .cg-info p { opacity:.9; }
// .cg-card:focus-visible { outline:2px solid #111; outline-offset:3px; }
// `;

// export default function CurvedGallery() {
//   const n = ITEMS.length;
//   const stageRef = useRef(null);
//   const cardRefs = useRef([]);
//   const [w, setW] = useState(1200);

//   const st = useRef({ pos: 0, vel: SPEED, hover: false, dragging: false, lastX: 0, lastT: 0, moved: 0 });

//   // sizes based on container width (whole numbers = crisp edges)
//   const cardW = Math.round(Math.max(180, Math.min(300, w * 0.24)));
//   const cardH = Math.round(cardW * CARD_RATIO);
//   const stepPx = cardW * (1 + GAP);
//   const layout = useRef({});
//   layout.current = { stepPx };

//   // keep responsive
//   useEffect(() => {
//     const el = stageRef.current;
//     if (!el) return;
//     const update = () => setW(el.clientWidth);
//     update();
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   // animation loop
//   useEffect(() => {
//     const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     let raf;
//     let last = performance.now();

//     const tick = (now) => {
//       const dt = Math.min(0.05, (now - last) / 1000);
//       last = now;
//       const s = st.current;
//       const { stepPx } = layout.current;

//       if (!s.dragging) {
//         const target = reduce || (PAUSE_ON_HOVER && s.hover) ? 0 : SPEED;
//         s.vel += (target - s.vel) * Math.min(1, dt * 2.5);
//         s.pos += s.vel * dt;
//       }

//       for (let i = 0; i < n; i++) {
//         const el = cardRefs.current[i];
//         if (!el) continue;

//         // shortest circular distance from the centre, in cards
//         let d = (((i - s.pos) % n) + n) % n;
//         if (d > n / 2) d -= n;
//         const abs = Math.abs(d);

//         if (abs > 2.6) {
//           el.style.visibility = "hidden";
//           continue;
//         }

//         // flat zone near the centre keeps the main card at exactly 100% (sharpest)
//         const t = Math.max(0, abs - 0.25);
//         const scale = Math.max(0.7, 1 - t * SIDE_SHRINK);
//         const x = Math.round(d * stepPx);
//         const fade = Math.min(1, Math.max(0, 2.6 - abs) / 0.6);

//         el.style.visibility = "visible";
//         el.style.opacity = fade < 1 ? fade : "";
//         el.style.transform = `translateX(${x}px) scale(${scale.toFixed(3)})`; // sideways only
//         el.style.zIndex = String(100 - Math.round(abs * 10));
//         el.tabIndex = abs < 0.6 ? 0 : -1;
//       }
//       raf = requestAnimationFrame(tick);
//     };
//     raf = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(raf);
//   }, [n]);

//   // drag / swipe (sideways only) and sideways trackpad scroll
//   useEffect(() => {
//     const stage = stageRef.current;
//     if (!stage) return;
//     const s = st.current;

//     let sx = 0, sy = 0, armed = false;

//     const onMove = (e) => {
//       if (!armed && !s.dragging) return;
//       if (!s.dragging) {
//         const dx = e.clientX - sx;
//         const dy = e.clientY - sy;
//         if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { // vertical → let the page scroll
//           armed = false;
//           return;
//         }
//         if (Math.abs(dx) > 8) {                                // horizontal → start dragging
//           s.dragging = true;
//           s.lastX = e.clientX;
//           s.lastT = performance.now();
//         }
//         return;
//       }
//       const now = performance.now();
//       const dx = e.clientX - s.lastX;
//       const dt = Math.max(1, now - s.lastT) / 1000;
//       const dCards = -dx / layout.current.stepPx;
//       s.pos += dCards;
//       s.vel = dCards / dt;
//       s.moved += Math.abs(dx);
//       s.lastX = e.clientX;
//       s.lastT = now;
//     };

//     const onUp = () => {
//       armed = false;
//       s.dragging = false;
//       window.removeEventListener("pointermove", onMove);
//       window.removeEventListener("pointerup", onUp);
//       window.removeEventListener("pointercancel", onUp);
//     };

//     const onDown = (e) => {
//       if (e.button !== 0) return;
//       armed = true;
//       s.moved = 0;
//       sx = e.clientX;
//       sy = e.clientY;
//       window.addEventListener("pointermove", onMove);
//       window.addEventListener("pointerup", onUp);
//       window.addEventListener("pointercancel", onUp);
//     };

//     const onWheel = (e) => {
//       if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // normal page scroll untouched
//       e.preventDefault();
//       s.pos += e.deltaX / layout.current.stepPx;
//     };

//     stage.addEventListener("pointerdown", onDown);
//     stage.addEventListener("wheel", onWheel, { passive: false });
//     return () => {
//       onUp();
//       stage.removeEventListener("pointerdown", onDown);
//       stage.removeEventListener("wheel", onWheel);
//     };
//   }, []);

//   return (
//     <section
//       style={{
//         position: "relative",
//         zIndex: 0,
//         isolation: "isolate", // keeps card z-index values inside this section, so they stay under the navbar
//         background: "#fff",
//         color: "#111",
//         padding: "80px 0 72px",
//         overflow: "hidden",
//       }}
//     >
//       <style>{CSS}</style>

//       <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto", padding: "0 20px" }}>
//         <h2
//           style={{
//             fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
//             fontWeight: 400,
//             fontSize: "clamp(28px, 4vw, 46px)",
//             lineHeight: 1.2,
//             margin: "0 0 16px",
//           }}
//         >
//           Authentic Indian Art, Paintings &amp; Handcrafted Home Decor
//         </h2>
//         <p style={{ margin: 0, fontSize: 15, color: "rgba(0,0,0,.55)" }}>
//           Handpainted originals, thoughtful gifts and pieces ready for every room.
//         </p>
//       </div>

//       <div
//         ref={stageRef}
//         onPointerEnter={(e) => e.pointerType === "mouse" && (st.current.hover = true)}
//         onPointerLeave={() => (st.current.hover = false)}
//         style={{
//           position: "relative",
//           height: cardH + 60,
//           marginTop: 40,
//           cursor: "grab",
//           touchAction: "pan-y",
//           userSelect: "none",
//         }}
//       >
//         {ITEMS.map((item, i) => (
//           <Link
//             key={i}
//             ref={(el) => (cardRefs.current[i] = el)}
//             to={item.to}
//             draggable={false}
//             className="cg-card"
//             aria-label={item.label}
//             onClick={(e) => st.current.moved > 6 && e.preventDefault()}
//             style={{ width: cardW, height: cardH, marginLeft: -cardW / 2, marginTop: -cardH / 2 }}
//           >
//             <img src={item.img} alt={item.label} draggable={false} decoding="async" />
//             <div className="cg-shade" />
//             <div className="cg-info">
//               <h3>{item.label}</h3>
//               <p>{item.text}</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// }