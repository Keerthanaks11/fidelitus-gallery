import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SERVICES } from "../../data/services.js";
import ServiceScene from "../services/ServiceScene.jsx";

/* =====================================================================
   SERVICES — curved panorama
   - Service photos placed on the inside of a curve (like a wrap-around
     gallery wall): middle panels sit further back, outer panels swing
     towards you and look larger
   - Name + tag over each photo; hover brightens it and shows "Explore"
   - Phones: plain 2-column grid (the curve needs width)
   - See-through section over the fixed page background, no backdrop blur
   - All photos load together, then fade in at the same time
   ===================================================================== */

// ---- Easy settings ----
const TITLE = "Our Services";
const SUBTITLE = "Art for occasions, offices and learning.";
const CTA = "Explore";
const CURVE = 2.2;        // bigger = flatter curve, smaller = stronger curve
const GAP = 14;           // px between panels
const MAX_PANEL = 330;    // largest panel width (px)
const PANEL_RATIO = 1.15; // panel height = width × this
const MOBILE_BELOW = 760; // screens narrower than this get the flat grid
const MAX_WAIT_MS = 3000; // never wait longer than this for slow images

const CSS = `
/* stage */
.sv-stage { position: relative; margin: 34px auto 0; perspective: 1100px; perspective-origin: 50% 45%; }
.sv-ring { position: absolute; inset: 0; transform-style: preserve-3d; }

/* one panel */
.sv-pan { position: absolute; top: 50%; left: 50%; display: block; overflow: hidden; border-radius: 6px;
  color: #fff; text-decoration: none; background: rgba(255,255,255,.06);
  box-shadow: 0 24px 50px -24px rgba(0,0,0,.85);
  backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.sv-pan:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }

.sv-photo-inner { position: absolute; inset: 0; transition: opacity .6s ease, transform .6s ease; }
.sv-photo-zoom { width: 100%; height: 100%; transition: transform .9s cubic-bezier(.22,1,.36,1), filter .5s ease; filter: brightness(.88); }
.sv-pan:hover .sv-photo-zoom, .sv-pan:focus-visible .sv-photo-zoom { transform: scale(1.07); filter: brightness(1.02); }

.sv-shade { position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to top, rgba(0,0,0,.78) 0%, rgba(0,0,0,.25) 38%, rgba(0,0,0,0) 60%); }
.sv-sheen { position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(115deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,0) 35%); }

.sv-skeleton { position: absolute; inset: 0; transition: opacity .5s ease;
  background: linear-gradient(100deg, rgba(255,255,255,.05) 30%, rgba(255,255,255,.14) 50%, rgba(255,255,255,.05) 70%);
  background-size: 200% 100%; animation: sv-shimmer 1.4s linear infinite; }
@keyframes sv-shimmer { from { background-position: 150% 0; } to { background-position: -50% 0; } }

.sv-cap { position: absolute; left: 18px; right: 18px; bottom: 16px; }
.sv-tag { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 10.5px; font-weight: 700;
  letter-spacing: .12em; text-transform: uppercase; background: rgba(0,0,0,.45); border: 1px solid rgba(255,255,255,.25); }
.sv-name { margin: 8px 0 0; font-size: 20px; font-weight: 800; line-height: 1.2; text-shadow: 0 2px 10px rgba(0,0,0,.5); }
@media (min-width: 1200px) { .sv-name { font-size: 22px; } }
.sv-go { display: inline-flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 12px; font-weight: 700;
  letter-spacing: .14em; text-transform: uppercase; color: #fff;
  opacity: 0; transform: translateY(6px); transition: opacity .35s ease, transform .35s ease, gap .3s ease; }
.sv-pan:hover .sv-go, .sv-pan:focus-visible .sv-go { opacity: 1; transform: none; }
.sv-pan:hover .sv-go { gap: 12px; }

/* phones: flat grid */
.sv-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 28px; padding: 0 16px; }
.sv-grid .sv-pan { position: relative; top: auto; left: auto; aspect-ratio: 3 / 4; }
.sv-grid .sv-go { opacity: 1; transform: none; }
.sv-grid .sv-name { font-size: 16px; }
.sv-grid .sv-cap { left: 12px; right: 12px; bottom: 12px; }

/* bottom button */
.sv-all { display: inline-flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 32px;
  border-radius: 999px; font-size: 13px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
  color: #fff; text-decoration: none; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.35);
  transition: background-color .3s ease, color .3s ease; }
.sv-all:hover { background: #fff; color: #111; }
.sv-all:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
.sv-all svg { transition: transform .3s ease; }
.sv-all:hover svg { transform: translateX(4px); }

@media (prefers-reduced-motion: reduce) {
  .sv-photo-inner, .sv-photo-zoom, .sv-go { transition: none; }
  .sv-skeleton { animation: none; }
}
`;

function Arrow({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// photo + caption (shared by the curve and the phone grid)
function PanelBody({ s, ready }) {
  return (
    <>
      <div aria-hidden className="sv-skeleton" style={{ opacity: ready ? 0 : 1 }} />
      <div className="sv-photo-inner" style={{ opacity: ready ? 1 : 0, transform: ready ? "none" : "scale(1.03)" }}>
        <div className="sv-photo-zoom">
          <ServiceScene id={s.id} image={s.image} className="h-full w-full" />
        </div>
      </div>
      <div aria-hidden className="sv-shade" />
      <div aria-hidden className="sv-sheen" />
      <div className="sv-cap">
        {s.tag && <span className="sv-tag">{s.tag}</span>}
        <h3 className="sv-name">{s.name}</h3>
        <span className="sv-go">
          {CTA} <Arrow size={13} />
        </span>
      </div>
    </>
  );
}

export default function Services() {
  const featured = SERVICES.filter((s) => s.featured);
  const n = featured.length;
  const [ready, setReady] = useState(false);
  const boxRef = useRef(null);
  const [cw, setCw] = useState(1200);

  // keep the curve sized to the available width
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => setCw(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // load every service photo up front, then show them all at once
  useEffect(() => {
    const urls = featured.map((s) => s.image).filter(Boolean);
    if (!urls.length) {
      setReady(true);
      return;
    }
    let left = urls.length;
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };
    const imgs = urls.map((url) => {
      const img = new Image();
      img.decoding = "async";
      const one = () => {
        left -= 1;
        if (left <= 0) finish();
      };
      img.onload = () => (img.decode ? img.decode().catch(() => {}).finally(one) : one());
      img.onerror = one;
      img.src = url;
      return img;
    });
    const timer = setTimeout(finish, MAX_WAIT_MS);
    return () => {
      clearTimeout(timer);
      imgs.forEach((img) => (img.onload = img.onerror = null));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- curve geometry ----
  const mobile = cw < MOBILE_BELOW;
  const W = Math.round(Math.min(MAX_PANEL, cw / (n + 0.9)));   // panel width
  const H = Math.round(W * PANEL_RATIO);                       // panel height
  const R = W * CURVE;                                          // curve radius
  const step = ((W + GAP) / R) * (180 / Math.PI);               // degrees between panels
  const mid = (n - 1) / 2;
  const outerZ = R * (1 - Math.cos((mid * step * Math.PI) / 180)); // how far the outer panels come forward
  const stageH = Math.round(H * (1 + outerZ / 1100) + 40);

  return (
    <section id="services" className="relative overflow-hidden pb-6 pt-4 text-white md:pb-8 md:pt-6">
      <style>{CSS}</style>

      {/* Title */}
      <div className="px-5 text-center">
        <h2 className="m-0 text-[30px] font-extrabold leading-[1.15] tracking-[0.02em] text-white md:text-[42px]">{TITLE}</h2>
        <span aria-hidden className="mx-auto mt-4 block h-1 w-16 rounded-full bg-white" />
        <p className="mt-3.5 text-[15px] text-white/75 md:text-[17px]">{SUBTITLE}</p>
      </div>

      <div ref={boxRef} className="mx-auto w-full max-w-[1400px] px-4 lg:px-8">
        {mobile ? (
          /* ---------- phones: flat grid ---------- */
          <div className="sv-grid">
            {featured.map((s) => (
              <Link key={s.id} to={`/services#${s.id}`} draggable={false} className="sv-pan">
                <PanelBody s={s} ready={ready} />
              </Link>
            ))}
          </div>
        ) : (
          /* ---------- curved panorama ---------- */
          <div className="sv-stage" style={{ height: stageH }}>
            <div className="sv-ring">
              {featured.map((s, i) => {
                const angle = -(i - mid) * step; // negative so right-hand panels sit on the right
                return (
                  <Link
                    key={s.id}
                    to={`/services#${s.id}`}
                    draggable={false}
                    className="sv-pan"
                    style={{
                      width: W,
                      height: H,
                      marginLeft: -W / 2,
                      marginTop: -H / 2,
                      // swing each panel around a point in front of the wall → concave curve
                      transform: `translateZ(${R}px) rotateY(${angle}deg) translateZ(${-R}px)`,
                    }}
                  >
                    <PanelBody s={s} ready={ready} />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="mt-6 flex justify-center px-5">
        <Link to="/services" className="sv-all">
          See all {SERVICES.length} services <Arrow />
        </Link>
      </div>
    </section>
  );
}
// import { Link } from "react-router-dom";
// import { motion, useReducedMotion } from "framer-motion";
// import { SERVICES } from "../../data/services.js";
// import ServiceScene from "../services/ServiceScene.jsx";

// /* =====================================================================
//    SERVICES — glass "cast list" style
//    - White background with very soft colour blurs behind frosted-glass pieces
//    - Glass pill label, arrow and line on top
//    - Frosted-glass cards, all featured services shown side by side (no carousel)
//    ===================================================================== */

// const ease = [0.22, 1, 0.36, 1];

// // ---- Easy settings ----
// const LABEL = "Our Services :";

// // frosted-glass look shared by the pill, cards and button
// const glass = {
//   background: "linear-gradient(135deg, rgba(255,255,255,.62), rgba(255,255,255,.28))",
//   border: "1px solid rgba(255,255,255,.85)",
//   backdropFilter: "blur(18px) saturate(160%)",
//   WebkitBackdropFilter: "blur(18px) saturate(160%)",
// };



// export default function Services() {
//   const reduce = useReducedMotion();
//   const featured = SERVICES.filter((s) => s.featured);

//   return (
//     <section id="services" className="relative isolate overflow-hidden py-[88px] text-neutral-900 md:py-[104px]" style={{ background: "#fff" }}>
//       {/* very soft colour blurs so the glass has something to frost (page still reads white) */}
//       <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
//         <div className="absolute left-[6%] top-[38%] h-[340px] w-[340px] rounded-full blur-[90px]" style={{ background: "rgba(255,46,99,.16)" }} />
//         <div className="absolute left-[40%] top-[52%] h-[300px] w-[440px] rounded-full blur-[100px]" style={{ background: "rgba(243,147,20,.14)" }} />
//         <div className="absolute right-[4%] top-[30%] h-[360px] w-[360px] rounded-full blur-[100px]" style={{ background: "rgba(0,103,154,.12)" }} />
//       </div>

//       {/* ---------- Top bar ---------- */}
//       <div className="mx-auto max-w-[1300px] px-5 lg:px-8">
//         <div className="flex items-center gap-4 md:gap-6">
//           <span
//             className="inline-flex shrink-0 items-center rounded-full px-7 py-3 text-sm font-semibold tracking-wide text-neutral-900 shadow-[0_10px_30px_-12px_rgba(0,0,0,.3)] md:text-base"
//             style={glass}
//           >
//             {LABEL}
//           </span>
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-neutral-900">
//             <path d="M6 6l12 12M18 8v10H8" />
//           </svg>
//           <span aria-hidden className="h-px flex-1 bg-neutral-300" />
//         </div>

//         <h2 className="h2 mt-8 max-w-2xl text-neutral-900">Art for occasions, offices and learning.</h2>
//       </div>

//       {/* ---------- All services, side by side ---------- */}
//       <div className="mx-auto mt-10 grid max-w-[1520px] grid-cols-1 gap-6 px-5 pb-10 pt-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:px-8">
//         {featured.map((s, idx) => (
//           <motion.div
//             key={s.id}
//             className="mx-auto w-full max-w-[400px]"
//             initial={reduce ? false : { opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, margin: "-60px" }}
//             transition={{ duration: 0.8, ease, delay: idx * 0.1 }}
//           >
//             <Link
//               to={`/services#${s.id}`}
//               draggable={false}
//               className="group block h-full rounded-[32px] p-[18px] text-neutral-900 transition duration-500 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
//               style={{ ...glass, boxShadow: "0 20px 44px -28px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.9)" }}
//             >
//               <div className="relative aspect-[4/4.3] overflow-hidden rounded-[24px] bg-neutral-200">
//                 <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-110">
//                   <ServiceScene id={s.id} image={s.image} className="h-full w-full" />
//                 </div>
//                 <span aria-hidden className="absolute bottom-0 left-0 h-1 w-0 bg-white/90 transition-all duration-700 group-hover:w-full" />
//               </div>

//               <div className="px-2 pb-2 pt-6">
//                 <h3 className="text-[22px] font-bold leading-tight md:text-[26px]">{s.name}</h3>
//                 <p className="mt-2.5 flex items-center justify-between gap-2 text-[15px] text-neutral-600 md:text-[17px]">
//                   <span className="truncate">{s.tag}</span>
//                   <span
//                     aria-hidden
//                     className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition-all duration-300 group-hover:translate-x-1 lg:opacity-0 lg:group-hover:opacity-100"
//                   >
//                     →
//                   </span>
//                 </p>
//               </div>
//             </Link>
//           </motion.div>
//         ))}
//       </div>

//       {/* ---------- Bottom button ---------- */}
//       <div className="mt-4 flex justify-center px-5">
//         <Link
//           to="/services"
//           className="group inline-flex min-h-[50px] items-center gap-2 rounded-full px-9 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-900 shadow-[0_14px_34px_-16px_rgba(0,0,0,.35)] transition duration-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
//           style={glass}
//         >
//           See all {SERVICES.length} services
//           <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
//         </Link>
//       </div>
//     </section>
//   );
// }