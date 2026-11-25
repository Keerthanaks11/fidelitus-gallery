import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


import img11 from "../../assets/11.jpeg";
import img12 from "../../assets/12.jpg";
import img13 from "../../assets/13.jpg";

// Edit labels, text and links here
const BASE = [
  { label: "Artworks", text: "Showcasing the best works of Indian handpainted art.", img: img11, to: "/gallery" },
  { label: "Events", text: "Join our art events and live painting sessions.", img: img12, to: "/events" },
  { label: "Exhibitions", text: "Explore our latest exhibitions.", img: img13, to: "/exhibitions" },
];

// Repeated so the ring always looks full (3 photos alone leave gaps)
const ITEMS = [...BASE, ...BASE];

// ---- Easy settings ----
const SPEED = 0.4;            // auto-scroll speed (cards per second). Negative = other direction
const GAP = 14;               // white gap between photos (px)
const BORDER = 5;             // white border around each photo (px)
const PAUSE_ON_HOVER = false; // false = keeps moving even when the mouse is on it
const ALWAYS_MOVE = true;     // true = moves even if the computer has "reduce animations" turned on
const HEIGHT = 640;           // section height on desktop/tablet (px)
const HEIGHT_MOBILE = 500;    // section height on phones (px)

const CSS = `
.ar-text { animation: arIn .7s ease both; text-shadow: 0 2px 10px rgba(0,0,0,.65), 0 0 3px rgba(0,0,0,.5); }
@keyframes arIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
.ar-btn { display:inline-flex; align-items:center; gap:8px; padding:14px 32px; border-radius:20px;
  background:rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.45); color:#fff;
  font-weight:600; font-size:16px; text-decoration:none; backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px); transition:background .25s ease; text-shadow:0 1px 6px rgba(0,0,0,.5); }
.ar-btn:hover { background:rgba(255,255,255,.38); }
.ar-seg { cursor:pointer; outline:none; }
`;

export default function ArcGallery() {
  const n = ITEMS.length;
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const segRefs = useRef([]);
  const [w, setW] = useState(1200);
  const [active, setActive] = useState(0);

  const st = useRef({ pos: 0, vel: SPEED, hover: false, dragging: false, lastY: 0, lastT: 0, moved: 0, shown: 0 });

  // ---- sizes ----
  const mobile = w < 720;
  const H = mobile ? HEIGHT_MOBILE : HEIGHT;
  const T = Math.round(Math.min(H * 0.62, mobile ? w * 0.5 : w * 0.34)); // ring thickness (photo width)
  const r1 = Math.round(T * 1.25);                                       // inner radius
  const r2 = r1 + T;                                                     // outer radius
  const mid = (r1 + r2) / 2;
  const cardH = T * 0.7;                                                 // photo height along the arc
  const step = (cardH + GAP) / mid;                                      // angle between photos
  const half = step / 2 - GAP / 2 / mid;                                 // half-angle of one photo
  const rightMargin = mobile ? 6 : Math.max(20, w * 0.05);
  const cx = w - rightMargin - r2;                                       // circle centre (off to the left)
  const cy = H / 2;

  const layout = useRef({});
  layout.current = { cx, cy, step, stepPx: cardH + GAP };

  // ring-segment shape: inner edge curved, outer edge curved, sides point at the centre
  const d = useMemo(() => {
    const p = (r, a) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
    return `M ${p(r1, -half)} L ${p(r2, -half)} A ${r2} ${r2} 0 0 1 ${p(r2, half)} L ${p(r1, half)} A ${r1} ${r1} 0 0 0 ${p(r1, -half)} Z`;
  }, [r1, r2, half]);

  const imgX = r1 * Math.cos(half);
  const imgY = -r2 * Math.sin(half);
  const imgW = r2 - imgX;
  const imgH = 2 * r2 * Math.sin(half);

  // keep responsive
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const update = () => setW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- animation loop (runs all the time, no matter what the page is doing) ----
  useEffect(() => {
    const reduce = !ALWAYS_MOVE && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = st.current;
      const { cx, cy, step } = layout.current;

      if (!s.dragging) {
        const target = reduce || (PAUSE_ON_HOVER && s.hover) ? 0 : SPEED;
        s.vel += (target - s.vel) * Math.min(1, dt * 2.5); // eases back to the steady speed
        s.pos += s.vel * dt;
      }

      // centre photo → drives the text
      const idx = ((Math.round(s.pos) % n) + n) % n;
      if (idx !== s.shown) {
        s.shown = idx;
        setActive(idx);
      }

      for (let i = 0; i < n; i++) {
        const el = segRefs.current[i];
        if (!el) continue;

        let dd = (((i - s.pos) % n) + n) % n;
        if (dd > n / 2) dd -= n;
        const abs = Math.abs(dd);

        if (abs > 2.6) {
          el.setAttribute("visibility", "hidden");
          continue;
        }
        const deg = (dd * step * 180) / Math.PI;
        const fade = Math.min(1, Math.max(0, 2.6 - abs) / 0.6);

        el.setAttribute("visibility", "visible");
        el.setAttribute("opacity", fade.toFixed(3));
        el.setAttribute("transform", `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${deg.toFixed(3)})`);
        el.setAttribute("tabindex", abs < 0.6 ? "0" : "-1");
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n]);

  // ---- mouse drag up and down (touch is left alone so the page scrolls normally) ----
  useEffect(() => {
    const box = sectionRef.current;
    if (!box) return;
    const s = st.current;

    let sx = 0, sy = 0, armed = false;

    const onMove = (e) => {
      if (!armed && !s.dragging) return;
      if (!s.dragging) {
        const dx = e.clientX - sx;
        const dy = e.clientY - sy;
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
          armed = false;
          return;
        }
        if (Math.abs(dy) > 8) {
          s.dragging = true;
          s.lastY = e.clientY;
          s.lastT = performance.now();
        }
        return;
      }
      const now = performance.now();
      const dy = e.clientY - s.lastY;
      const dt = Math.max(1, now - s.lastT) / 1000;
      const dCards = -dy / layout.current.stepPx;
      s.pos += dCards;
      s.vel = Math.max(-4, Math.min(4, dCards / dt));
      s.moved += Math.abs(dy);
      s.lastY = e.clientY;
      s.lastT = now;
    };

    const onUp = () => {
      armed = false;
      s.dragging = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    const onDown = (e) => {
      if (e.pointerType === "touch") return; // phones: let the page scroll, ring keeps moving on its own
      if (e.button !== 0) return;
      armed = true;
      s.moved = 0;
      sx = e.clientX;
      sy = e.clientY;
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    };

    box.addEventListener("pointerdown", onDown);
    window.addEventListener("blur", onUp); // never get stuck if the window loses focus mid-drag
    return () => {
      onUp();
      box.removeEventListener("pointerdown", onDown);
      window.removeEventListener("blur", onUp);
    };
  }, []);

  const go = (to) => {
    if (st.current.moved > 6) return; // a drag is not a click
    navigate(to);
  };

  const current = ITEMS[active];

  return (
    <section
      ref={sectionRef}
      onPointerEnter={(e) => e.pointerType === "mouse" && (st.current.hover = true)}
      onPointerLeave={() => (st.current.hover = false)}
      style={{
        position: "relative",
        zIndex: 0,
        isolation: "isolate", // keeps everything inside this section, under the navbar
        height: H,
        overflow: "hidden",
        background: "transparent", // the fixed page background shows through
        color: "#fff",
        userSelect: "none",
      }}
    >
      <style>{CSS}</style>

      {/* ring of photos */}
      <svg
        width={w}
        height={H}
        viewBox={`0 0 ${w} ${H}`}
        style={{ position: "absolute", inset: 0, zIndex: 10, filter: "drop-shadow(0 10px 16px rgba(0,0,0,.35))" }}
      >
        <defs>
          <clipPath id="ar-sector">
            <path d={d} />
          </clipPath>
        </defs>

        {ITEMS.map((item, i) => (
          <g
            key={i}
            ref={(el) => (segRefs.current[i] = el)}
            className="ar-seg"
            role="link"
            aria-label={item.label}
            onClick={() => go(item.to)}
            onKeyDown={(e) => e.key === "Enter" && go(item.to)}
          >
            <g clipPath="url(#ar-sector)">
              <image
                href={item.img}
                x={imgX}
                y={imgY}
                width={imgW}
                height={imgH}
                preserveAspectRatio="xMidYMid slice"
                draggable="false"
              />
            </g>
            <path d={d} fill="none" stroke="#fff" strokeWidth={BORDER} strokeLinejoin="round" />
          </g>
        ))}
      </svg>

      {/* text on the left */}
      <div
        key={active}
        className="ar-text"
        style={{
          position: "absolute",
          zIndex: 20,
          left: mobile ? 16 : "6%",
          top: "46%",
          transform: "translateY(-50%)",
          maxWidth: mobile ? Math.max(120, cx + r1 - 40) : 540,
          pointerEvents: "none",
        }}
      >
        <div style={{ width: mobile ? 120 : 200, height: 1, background: "rgba(255,255,255,.9)", marginBottom: 20 }} />
        <h2
          style={{
            margin: 0,
            fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".16em",
            fontSize: mobile ? 23 : "clamp(32px, 3.7vw, 54px)",
            lineHeight: 1.2,
          }}
        >
          {current.label}
        </h2>
        <p style={{ margin: "16px 0 0", fontSize: mobile ? 14 : 19, lineHeight: 1.5, opacity: 0.95 }}>{current.text}</p>
        <div style={{ width: mobile ? 120 : 200, height: 1, background: "rgba(255,255,255,.9)", marginTop: 20 }} />
      </div>

      {/* button, bottom left */}
      <div style={{ position: "absolute", zIndex: 20, left: mobile ? 16 : "6%", bottom: 32 }}>
        <Link to={current.to} className="ar-btn">
          <span aria-hidden="true">↗</span> Explore
        </Link>
      </div>
    </section>
  );
}
