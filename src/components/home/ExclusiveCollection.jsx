import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import img5 from "../../assets/vishwaroopa.jpeg";
import img6 from "../../assets/trimurthy.jpeg";
import img7 from "../../assets/sun.jpeg";

/* =====================================================================
   EXCLUSIVE COLLECTION
   - Centred title
   - Artwork cards gliding left → right in an endless loop (never stops)
   - Cards: photo with a glass icon, frosted dark panel with label + title;
     hover (or tap on phones) reveals the details
   ===================================================================== */

// Edit titles, details, images and links here
const ITEMS = [
  {
    badge: "Featured",
    title: "Vishwaroopa",
    dimension: "96″ X 36″",
    medium: "Acrylic on Canvas",
    artist: "Kotegadde S Ravi",
    studio: "Fidelitus Gallery",
    year: "2020",
    img: img5,
    to: "/gallery",
  },
  {
    badge: "Popular",
    title: "Trimurthy",
    dimension: "48″ X 60″",
    medium: "Acrylic on Canvas",
    artist: "Kotegadde S Ravi",
    studio: "Fidelitus Gallery",
    year: "2022",
    img: img6,
    to: "/gallery",
  },
  {
    badge: "Exclusive",
    title: "Sun Chariot",
    dimension: "72″ X 72″",
    medium: "Acrylic on Canvas",
    artist: "Kotegadde S Ravi",
    studio: "Fidelitus Gallery",
    year: "2022",
    img: img7,
    to: "/gallery",
  },
];

const DETAILS = [
  ["Dimension", "dimension"],
  ["Artist", "artist"],
  ["Studio", "studio"],
];

// ---- Easy settings ----
const CARD_SECONDS = 9;      // time for ONE card to slide past (bigger = slower)
const TITLE = "Exclusive Collection";
const SUBTITLE = "Original works by Kotegadde S Ravi";
const COPIES = 4;            // how many times the cards repeat to fill wide screens

// ---- Colours (black & white) ----
const BLACK = "#0a0a0a";
const WHITE = "#ffffff";

/* ---------- icons ---------- */

function Heart({ filled }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? WHITE : "none"} stroke={WHITE}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function Brush() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18.4 2.6a2 2 0 0 1 2.9 2.9L12 14.8l-2.9-2.9z" />
      <path d="M9.1 11.9C6.8 11.9 5 13.7 5 16c0 1.6-1 2.6-2 3 1 1 2.6 2 5 2 2.9 0 5-2.1 5-5" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ---------- CSS ---------- */

const CSS = `
.ec-root {
  position: relative; overflow: hidden; background: transparent; color: ${WHITE};
  padding: 56px 0; font-family: Montserrat, system-ui, sans-serif;
}
@media (min-width: 768px) { .ec-root { padding: 72px 0; } }

/* ---- Centred title ---- */
.ec-head { text-align: center; padding: 0 20px; }
.ec-head h2 {
  margin: 0; font-size: 30px; font-weight: 800; letter-spacing: .02em; line-height: 1.15; color: ${WHITE};
}
@media (min-width: 768px) { .ec-head h2 { font-size: 42px; } }
.ec-head-bar { display: block; width: 64px; height: 4px; margin: 16px auto 0; border-radius: 999px; background: ${WHITE}; }
.ec-head p { margin: 14px 0 0; font-size: 15px; color: rgba(255,255,255,.75); }
@media (min-width: 768px) { .ec-head p { font-size: 17px; } }

/* ---- Cards carousel ---- */
.ec-rail { overflow: hidden; padding: 40px 0 36px; }
.ec-track { display: flex; width: max-content; will-change: transform; }


.ec-card {
  position: relative; flex-shrink: 0; overflow: hidden;
  width: 300px; height: 330px; margin-right: 24px;
  border-radius: 18px; background: #1a1a1a; cursor: pointer;
  box-shadow: 0 18px 40px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.1);
}
@media (min-width: 768px) { .ec-card { width: 380px; height: 380px; margin-right: 32px; } }

.ec-card img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  transition: transform .8s cubic-bezier(.22,1,.36,1); user-select: none;
}
.ec-card:hover img, .ec-card.is-open img { transform: scale(1.05); }

/* glass bits */
.ec-glass {
  background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.35);
  -webkit-backdrop-filter: blur(12px) saturate(140%); backdrop-filter: blur(12px) saturate(140%);
}
.ec-icon {
  position: absolute; left: 22px; top: 22px; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  width: 54px; height: 54px; border-radius: 16px; color: ${WHITE};
  box-shadow: 0 6px 18px rgba(0,0,0,.18);
}
.ec-heart {
  position: absolute; right: 18px; top: 18px; z-index: 3;
  display: flex; align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: 999px; cursor: pointer; padding: 0;
  transition: transform .25s ease, background-color .25s ease;
}
.ec-heart:hover { transform: scale(1.1); background: rgba(255,255,255,.3); }

/* frosted bottom panel */
.ec-panel {
  position: absolute; left: 0; right: 0; bottom: 0; z-index: 2;
  padding: 20px 24px 22px; color: ${WHITE};
  background: linear-gradient(to bottom, rgba(20,20,20,.55), rgba(10,10,10,.78));
  border-top: 1px solid rgba(255,255,255,.12);
  -webkit-backdrop-filter: blur(18px) saturate(120%); backdrop-filter: blur(18px) saturate(120%);
}
.ec-label {
  margin: 0; font-size: 11px; font-weight: 700; letter-spacing: .22em;
  text-transform: uppercase; color: rgba(255,255,255,.72);
}
.ec-title { margin: 10px 0 0; font-size: 21px; font-weight: 800; line-height: 1.25; }
@media (min-width: 768px) { .ec-title { font-size: 24px; } }

/* details revealed on hover / tap */
.ec-more {
  display: grid; grid-template-rows: 0fr; opacity: 0;
  transition: grid-template-rows .45s cubic-bezier(.22,1,.36,1), opacity .35s ease;
}
.ec-card:hover .ec-more, .ec-card.is-open .ec-more, .ec-card:focus-within .ec-more { grid-template-rows: 1fr; opacity: 1; }
.ec-more-inner { overflow: hidden; }
.ec-dl { display: grid; grid-template-columns: repeat(3, auto); justify-content: start; gap: 6px 22px; margin: 14px 0 0; }
.ec-dl dt { font-size: 9px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.55); }
.ec-dl dd { margin: 3px 0 0; font-size: 12px; font-weight: 600; color: ${WHITE}; }
.ec-know {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 14px;
  padding: 7px 14px; border-radius: 999px; background: ${WHITE}; color: ${BLACK};
  font-size: 12px; font-weight: 700; text-decoration: none;
  transition: gap .25s ease;
}
.ec-know:hover { gap: 10px; }

/* bottom "View all" */
.ec-foot { display: flex; justify-content: center; margin-top: 8px; }
.ec-viewall {
  display: inline-flex; align-items: center; gap: 8px; padding: 12px 26px;
  border: 2px solid ${WHITE}; border-radius: 999px; background: ${WHITE}; color: ${BLACK};
  font-size: 14px; font-weight: 700; text-decoration: none;
  transition: background-color .3s ease, color .3s ease;
}
.ec-viewall:hover { background: transparent; color: ${WHITE}; }

.ec-heart:focus-visible, .ec-know:focus-visible, .ec-viewall:focus-visible { outline: 2px solid ${WHITE}; outline-offset: 3px; }
.ec-card .ec-heart:focus-visible, .ec-card .ec-know:focus-visible { outline-color: ${WHITE}; }

/* the picture row keeps moving at all times (never pauses) */
@media (prefers-reduced-motion: reduce) {
  .ec-card img, .ec-more { transition: none; }
}
`;

// Moves a row of repeated items forever with JavaScript (not CSS), so global
// "reduce animations" styles or settings can never stop it.
function useEndlessRow(trackRef, copies, secondsPerCopy, direction) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let copyW = track.scrollWidth / copies;
    const ro = new ResizeObserver(() => (copyW = track.scrollWidth / copies));
    ro.observe(track);

    let pos = 0;
    let last = performance.now();
    let raf;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (copyW > 0) {
        pos = (pos + (copyW / secondsPerCopy) * dt) % copyW;
        const x = direction === "right" ? pos - copyW : -pos;
        track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [trackRef, copies, secondsPerCopy, direction]);
}

/* ---------- one card ---------- */

function Card({ item, hidden }) {
  const [open, setOpen] = useState(false); // tap on phones
  const [liked, setLiked] = useState(false);
  const tab = hidden ? -1 : undefined;

  return (
    <article
      className={`ec-card ${open ? "is-open" : ""}`}
      aria-hidden={hidden || undefined}
      onClick={() => setOpen((v) => !v)}
    >
      <img src={item.img} alt={hidden ? "" : item.title} loading="lazy" draggable={false} />

      <span className="ec-icon ec-glass" aria-hidden="true">
        <Brush />
      </span>

      <button
        type="button"
        tabIndex={tab}
        className="ec-heart ec-glass"
        aria-label={liked ? "Remove from favourites" : "Add to favourites"}
        aria-pressed={liked}
        onClick={(e) => {
          e.stopPropagation();
          setLiked((v) => !v);
        }}
      >
        <Heart filled={liked} />
      </button>

      <div className="ec-panel">
        <p className="ec-label">
          {item.badge} · {item.medium}
        </p>
        <h3 className="ec-title">{item.title}</h3>

        <div className="ec-more">
          <div className="ec-more-inner">
            <dl className="ec-dl">
              {DETAILS.map(([label, key]) => (
                <div key={key}>
                  <dt>{label}</dt>
                  <dd>{item[key]}</dd>
                </div>
              ))}
            </dl>
            <Link to={item.to} tabIndex={tab} className="ec-know" onClick={(e) => e.stopPropagation()}>
              Know More <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------- section ---------- */

export default function ExclusiveCollection() {
  const trackRef = useRef(null);
  useEndlessRow(trackRef, COPIES, CARD_SECONDS * ITEMS.length, "right"); // left → right

  return (
    <section className="ec-root" aria-labelledby="ec-heading">
      <style>{CSS}</style>
      <div className="ec-head">
        <h2 id="ec-heading">{TITLE}</h2>
        <span className="ec-head-bar" aria-hidden="true" />
        <p>{SUBTITLE}</p>
      </div>

      {/* Cards: glide left → right, endlessly */}
      <div className="ec-rail">
        <div ref={trackRef} className="ec-track">
          {Array.from({ length: COPIES }).flatMap((_, c) =>
            ITEMS.map((item) => <Card key={`${c}-${item.title}`} item={item} hidden={c !== 1} />)
          )}
        </div>
      </div>

      <div className="ec-foot">
        <Link to="/gallery" className="ec-viewall">
          View all <Arrow />
        </Link>
      </div>
    </section>
  );
}
// import { useState } from "react";
// import { Link } from "react-router-dom";

// import img5 from "../../assets/vishwaroopa.jpeg";
// import img6 from "../../assets/trimurthy.jpeg";
// import img7 from "../../assets/sun.jpeg";

// /* =====================================================================
//    EXCLUSIVE COLLECTION
//    - Centred title
//    - Artwork cards gliding left → right in an endless loop (never stops)
//    - Cards: photo with a glass icon, frosted dark panel with label + title;
//      hover (or tap on phones) reveals the details
//    ===================================================================== */

// // Edit titles, details, images and links here
// const ITEMS = [
//   {
//     badge: "Featured",
//     title: "Vishwaroopa",
//     dimension: "96″ X 36″",
//     medium: "Acrylic on Canvas",
//     artist: "Kotegadde S Ravi",
//     studio: "Fidelitus Gallery",
//     year: "2020",
//     img: img5,
//     to: "/gallery",
//   },
//   {
//     badge: "Popular",
//     title: "Trimurthy",
//     dimension: "48″ X 60″",
//     medium: "Acrylic on Canvas",
//     artist: "Kotegadde S Ravi",
//     studio: "Fidelitus Gallery",
//     year: "2022",
//     img: img6,
//     to: "/gallery",
//   },
//   {
//     badge: "Exclusive",
//     title: "Sun Chariot",
//     dimension: "72″ X 72″",
//     medium: "Acrylic on Canvas",
//     artist: "Kotegadde S Ravi",
//     studio: "Fidelitus Gallery",
//     year: "2022",
//     img: img7,
//     to: "/gallery",
//   },
// ];

// const DETAILS = [
//   ["Dimension", "dimension"],
//   ["Artist", "artist"],
//   ["Studio", "studio"],
// ];

// // ---- Easy settings ----
// const CARD_SECONDS = 9;      // time for ONE card to slide past (bigger = slower)
// const TITLE = "Exclusive Collection";
// const SUBTITLE = "Original works by Kotegadde S Ravi";
// const COPIES = 4;            // how many times the cards repeat to fill wide screens

// // ---- Colours (black & white) ----
// const BLACK = "#0a0a0a";
// const WHITE = "#ffffff";

// /* ---------- icons ---------- */

// function Heart({ filled }) {
//   return (
//     <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? WHITE : "none"} stroke={WHITE}
//       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//       <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
//     </svg>
//   );
// }

// function Brush() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
//       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//       <path d="M18.4 2.6a2 2 0 0 1 2.9 2.9L12 14.8l-2.9-2.9z" />
//       <path d="M9.1 11.9C6.8 11.9 5 13.7 5 16c0 1.6-1 2.6-2 3 1 1 2.6 2 5 2 2.9 0 5-2.1 5-5" />
//     </svg>
//   );
// }

// function Arrow() {
//   return (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
//       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//       <path d="M5 12h14M13 6l6 6-6 6" />
//     </svg>
//   );
// }

// /* ---------- CSS ---------- */

// const CSS = `
// .ec-root {
//   position: relative; overflow: hidden; background: ${WHITE}; color: ${BLACK};
//   padding: 56px 0; font-family: Montserrat, system-ui, sans-serif;
// }
// @media (min-width: 768px) { .ec-root { padding: 72px 0; } }

// /* ---- Centred title ---- */
// .ec-head { text-align: center; padding: 0 20px; }
// .ec-head h2 {
//   margin: 0; font-size: 30px; font-weight: 800; letter-spacing: .02em; line-height: 1.15; color: ${BLACK};
// }
// @media (min-width: 768px) { .ec-head h2 { font-size: 42px; } }
// .ec-head-bar { display: block; width: 64px; height: 4px; margin: 16px auto 0; border-radius: 999px; background: ${BLACK}; }
// .ec-head p { margin: 14px 0 0; font-size: 15px; color: #666; }
// @media (min-width: 768px) { .ec-head p { font-size: 17px; } }

// /* ---- Cards carousel ---- */
// .ec-rail { overflow: hidden; padding: 40px 0 36px; }
// .ec-track {
//   display: flex; width: max-content;
//   animation: ec-cards calc(${CARD_SECONDS}s * ${ITEMS.length}) linear infinite;
// }

// /* one copy = 1/COPIES of the track; sliding by that much loops seamlessly */
// @keyframes ec-cards { from { transform: translateX(calc(-100% / ${COPIES})); } to { transform: translateX(0); } }

// .ec-card {
//   position: relative; flex-shrink: 0; overflow: hidden;
//   width: 300px; height: 330px; margin-right: 24px;
//   border-radius: 18px; background: #1a1a1a; cursor: pointer;
//   box-shadow: 0 14px 34px rgba(0,0,0,.16);
// }
// @media (min-width: 768px) { .ec-card { width: 380px; height: 380px; margin-right: 32px; } }

// .ec-card img {
//   position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
//   transition: transform .8s cubic-bezier(.22,1,.36,1); user-select: none;
// }
// .ec-card:hover img, .ec-card.is-open img { transform: scale(1.05); }

// /* glass bits */
// .ec-glass {
//   background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.35);
//   -webkit-backdrop-filter: blur(12px) saturate(140%); backdrop-filter: blur(12px) saturate(140%);
// }
// .ec-icon {
//   position: absolute; left: 22px; top: 22px; z-index: 2;
//   display: flex; align-items: center; justify-content: center;
//   width: 54px; height: 54px; border-radius: 16px; color: ${WHITE};
//   box-shadow: 0 6px 18px rgba(0,0,0,.18);
// }
// .ec-heart {
//   position: absolute; right: 18px; top: 18px; z-index: 3;
//   display: flex; align-items: center; justify-content: center;
//   width: 38px; height: 38px; border-radius: 999px; cursor: pointer; padding: 0;
//   transition: transform .25s ease, background-color .25s ease;
// }
// .ec-heart:hover { transform: scale(1.1); background: rgba(255,255,255,.3); }

// /* frosted bottom panel */
// .ec-panel {
//   position: absolute; left: 0; right: 0; bottom: 0; z-index: 2;
//   padding: 20px 24px 22px; color: ${WHITE};
//   background: linear-gradient(to bottom, rgba(20,20,20,.55), rgba(10,10,10,.78));
//   border-top: 1px solid rgba(255,255,255,.12);
//   -webkit-backdrop-filter: blur(18px) saturate(120%); backdrop-filter: blur(18px) saturate(120%);
// }
// .ec-label {
//   margin: 0; font-size: 11px; font-weight: 700; letter-spacing: .22em;
//   text-transform: uppercase; color: rgba(255,255,255,.72);
// }
// .ec-title { margin: 10px 0 0; font-size: 21px; font-weight: 800; line-height: 1.25; }
// @media (min-width: 768px) { .ec-title { font-size: 24px; } }

// /* details revealed on hover / tap */
// .ec-more {
//   display: grid; grid-template-rows: 0fr; opacity: 0;
//   transition: grid-template-rows .45s cubic-bezier(.22,1,.36,1), opacity .35s ease;
// }
// .ec-card:hover .ec-more, .ec-card.is-open .ec-more, .ec-card:focus-within .ec-more { grid-template-rows: 1fr; opacity: 1; }
// .ec-more-inner { overflow: hidden; }
// .ec-dl { display: grid; grid-template-columns: repeat(3, auto); justify-content: start; gap: 6px 22px; margin: 14px 0 0; }
// .ec-dl dt { font-size: 9px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.55); }
// .ec-dl dd { margin: 3px 0 0; font-size: 12px; font-weight: 600; color: ${WHITE}; }
// .ec-know {
//   display: inline-flex; align-items: center; gap: 6px; margin-top: 14px;
//   padding: 7px 14px; border-radius: 999px; background: ${WHITE}; color: ${BLACK};
//   font-size: 12px; font-weight: 700; text-decoration: none;
//   transition: gap .25s ease;
// }
// .ec-know:hover { gap: 10px; }

// /* bottom "View all" */
// .ec-foot { display: flex; justify-content: center; margin-top: 8px; }
// .ec-viewall {
//   display: inline-flex; align-items: center; gap: 8px; padding: 12px 26px;
//   border: 2px solid ${BLACK}; border-radius: 999px; background: ${BLACK}; color: ${WHITE};
//   font-size: 14px; font-weight: 700; text-decoration: none;
//   transition: background-color .3s ease, color .3s ease;
// }
// .ec-viewall:hover { background: ${WHITE}; color: ${BLACK}; }

// .ec-heart:focus-visible, .ec-know:focus-visible, .ec-viewall:focus-visible { outline: 2px solid ${BLACK}; outline-offset: 3px; }
// .ec-card .ec-heart:focus-visible, .ec-card .ec-know:focus-visible { outline-color: ${WHITE}; }

// /* the picture row keeps moving at all times (never pauses) */
// @media (prefers-reduced-motion: reduce) {
//   .ec-card img, .ec-more { transition: none; }
// }
// `;

// /* ---------- one card ---------- */

// function Card({ item, hidden }) {
//   const [open, setOpen] = useState(false); // tap on phones
//   const [liked, setLiked] = useState(false);
//   const tab = hidden ? -1 : undefined;

//   return (
//     <article
//       className={`ec-card ${open ? "is-open" : ""}`}
//       aria-hidden={hidden || undefined}
//       onClick={() => setOpen((v) => !v)}
//     >
//       <img src={item.img} alt={hidden ? "" : item.title} loading="lazy" draggable={false} />

//       <span className="ec-icon ec-glass" aria-hidden="true">
//         <Brush />
//       </span>

//       <button
//         type="button"
//         tabIndex={tab}
//         className="ec-heart ec-glass"
//         aria-label={liked ? "Remove from favourites" : "Add to favourites"}
//         aria-pressed={liked}
//         onClick={(e) => {
//           e.stopPropagation();
//           setLiked((v) => !v);
//         }}
//       >
//         <Heart filled={liked} />
//       </button>

//       <div className="ec-panel">
//         <p className="ec-label">
//           {item.badge} · {item.medium}
//         </p>
//         <h3 className="ec-title">{item.title}</h3>

//         <div className="ec-more">
//           <div className="ec-more-inner">
//             <dl className="ec-dl">
//               {DETAILS.map(([label, key]) => (
//                 <div key={key}>
//                   <dt>{label}</dt>
//                   <dd>{item[key]}</dd>
//                 </div>
//               ))}
//             </dl>
//             <Link to={item.to} tabIndex={tab} className="ec-know" onClick={(e) => e.stopPropagation()}>
//               Know More <Arrow />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }

// /* ---------- section ---------- */

// export default function ExclusiveCollection() {
//   return (
//     <section className="ec-root" aria-labelledby="ec-heading">
//       <style>{CSS}</style>
//       <div className="ec-head">
//         <h2 id="ec-heading">{TITLE}</h2>
//         <span className="ec-head-bar" aria-hidden="true" />
//         <p>{SUBTITLE}</p>
//       </div>

//       {/* Cards: glide left → right, endlessly */}
//       <div className="ec-rail">
//         <div className="ec-track">
//           {Array.from({ length: COPIES }).flatMap((_, c) =>
//             ITEMS.map((item) => <Card key={`${c}-${item.title}`} item={item} hidden={c !== 1} />)
//           )}
//         </div>
//       </div>

//       <div className="ec-foot">
//         <Link to="/gallery" className="ec-viewall">
//           View all <Arrow />
//         </Link>
//       </div>
//     </section>
//   );
// }