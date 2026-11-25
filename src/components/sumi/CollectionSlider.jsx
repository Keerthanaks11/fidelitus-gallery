import { useEffect, useRef } from "react";
import { Label, SU, SITE } from "./common.jsx";

import vishwaroopa from "../../assets/vishwaroopa.jpeg";
import trimurthy from "../../assets/trimurthy.jpeg";
import sun from "../../assets/sun.jpeg";
import art1 from "../../assets/image_1.jpeg";
import art2 from "../../assets/image_2.jpeg";
import art3 from "../../assets/image_3.jpg";
import queen from "../../assets/07.jpeg";

/* =====================================================================
   02 — Collection: SUMI's "Drag · View · Next" slider
   - drag (mouse or finger) with momentum, loops forever, drifts slowly on its own
   - cards lean slightly with the drag speed; colour comes back on hover
   ===================================================================== */

// ⚠ "Original Work" titles / details are placeholders — fill in the real ones.
const WORKS = [
  { img: vishwaroopa, title: "Vishwaroopa", meta: "Acrylic on canvas · 96″ × 36″", href: `${SITE}/vishwaroopa/` },
  { img: trimurthy, title: "Trimurthy", meta: "Acrylic on canvas · 48″ × 60″", href: `${SITE}/trimurthy/` },
  { img: sun, title: "Sun Chariot", meta: "Acrylic on canvas · 72″ × 72″", href: `${SITE}/sun-chariot/` },
  { img: art1, title: "Original Work", meta: "Kotegadde S Ravi", href: `${SITE}/paintings/` },
  { img: art2, title: "Original Work", meta: "Kotegadde S Ravi", href: `${SITE}/paintings/` },
  { img: art3, title: "Original Work", meta: "Kotegadde S Ravi", href: `${SITE}/paintings/` },
  { img: queen, title: "Original Work", meta: "From the collection", href: `${SITE}/paintings/` },
];
const DRIFT = 0.35; // px per frame when nobody is dragging (0 = still)

const CSS = `
.cs-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 24px; }
.cs-hint { display: flex; gap: 22px; font-size: 11px; letter-spacing: .3em; text-transform: uppercase; color: ${SU.mute}; }
.cs-hint span + span::before { content: "·"; margin-right: 22px; color: ${SU.ember}; }
.cs-view { margin-top: 56px; overflow: hidden; cursor: grab; touch-action: pan-y; user-select: none; }
.cs-view.is-drag { cursor: grabbing; }
.cs-track { display: flex; width: max-content; will-change: transform; padding: 0 24px; }
@media (min-width: 900px) { .cs-track { padding: 0 56px; } }
.cs-card { flex-shrink: 0; width: clamp(230px, 24vw, 360px); margin-right: clamp(20px, 3vw, 48px); color: ${SU.ink};
  text-decoration: none; transform-origin: center bottom; }
.cs-card:nth-child(even) { margin-top: 64px; }
.cs-card .su-img { aspect-ratio: 3 / 4; }
.cs-card:hover .su-img img { transform: scale(1.06); }
.cs-meta { display: flex; gap: 16px; align-items: baseline; margin-top: 18px; }
.cs-meta small { font-size: 11px; letter-spacing: .2em; color: ${SU.ember}; }
.cs-meta strong { font-weight: 300; font-size: 20px; letter-spacing: .04em; }
.cs-meta + p { margin: 6px 0 0 34px; font-size: 12px; letter-spacing: .08em; color: ${SU.mute}; }
.cs-card img { pointer-events: none; }
`;

export default function CollectionSlider() {
  const viewRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const st = useRef({ x: 0, vel: 0, down: false, lastX: 0, moved: 0, on: false });

  useEffect(() => {
    const view = viewRef.current;
    const track = trackRef.current;
    const s = st.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let setW = track.scrollWidth / 2;
    const ro = new ResizeObserver(() => (setW = track.scrollWidth / 2));
    ro.observe(track);

    let raf;
    const loop = () => {
      if (!s.down) {
        s.x += s.vel;
        s.vel *= 0.94;
        if (!reduce && Math.abs(s.vel) < 0.5) s.x -= DRIFT;
      }
      // wrap so the two copies loop seamlessly
      if (setW > 0) {
        while (s.x <= -setW) s.x += setW;
        while (s.x > 0) s.x -= setW;
      }
      track.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`;
      const skew = Math.max(-6, Math.min(6, s.vel * 0.25));
      cardsRef.current.forEach((c) => c && (c.style.transform = `skewX(${(-skew).toFixed(2)}deg)`));
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      s.on = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (s.on) raf = requestAnimationFrame(loop);
    });
    io.observe(view);

    const onDown = (e) => {
      s.down = true;
      s.lastX = e.clientX;
      s.startX = e.clientX;
      s.startY = e.clientY;
      s.moved = 0;
      s.vel = 0;
      s.horizontal = e.pointerType === "mouse";
    };
    const onMove = (e) => {
      if (!s.down) return;
      // on touch, only take over clearly sideways swipes (vertical = page scroll)
      if (!s.horizontal) {
        const dx = Math.abs(e.clientX - s.startX), dy = Math.abs(e.clientY - s.startY);
        if (dy > 10 && dy > dx) { s.down = false; return; }
        if (dx > 10) s.horizontal = true; else return;
      }
      const dx = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.x += dx;
      s.vel = dx;
      s.moved += Math.abs(dx);
      view.classList.add("is-drag");
    };
    const onUp = () => {
      s.down = false;
      view.classList.remove("is-drag");
    };
    // a drag is not a click
    const onClick = (e) => {
      if (s.moved > 8) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    view.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    view.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      view.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      view.removeEventListener("click", onClick, true);
    };
  }, []);

  const items = [...WORKS, ...WORKS]; // two copies → endless loop

  return (
    <section id="collection" className="su-sec" style={{ overflow: "hidden" }}>
      <style>{CSS}</style>
      <div className="su-wrap cs-head">
        <div>
          <Label no="02">Collection</Label>
          <h2 className="su-big" style={{ marginTop: 28 }}>Exclusive works by Kotegadde S Ravi</h2>
        </div>
        <div className="cs-hint" aria-hidden="true">
          <span>Drag</span><span>View</span><span>Next</span>
        </div>
      </div>

      <div ref={viewRef} className="cs-view" data-cursor="Drag" role="region" aria-label="Collection — drag to browse">
        <div ref={trackRef} className="cs-track">
          {items.map((w, i) => {
            const copy = i >= WORKS.length;
            return (
              <a
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
                className="cs-card"
                href={w.href}
                draggable={false}
                aria-hidden={copy || undefined}
                tabIndex={copy ? -1 : undefined}
              >
                <div className="su-img">
                  <img src={w.img} alt={copy ? "" : w.title} loading="lazy" decoding="async" draggable={false} />
                </div>
                <div className="cs-meta">
                  <small>{String((i % WORKS.length) + 1).padStart(2, "0")}</small>
                  <strong>{w.title}</strong>
                </div>
                <p>{w.meta}</p>
              </a>
            );
          })}
        </div>
      </div>

      <div className="su-wrap" style={{ marginTop: 56 }}>
        <a className="su-link" href={`${SITE}/paintings/`}>View the full collection <span aria-hidden>→</span></a>
      </div>
    </section>
  );
}
