import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import InkGL from "../fx/InkGL.js";
import { scrollFx } from "../fx/SmoothScroll.jsx";

import sun from "../../assets/sun.jpeg";
import trimurthy from "../../assets/trimurthy.jpeg";
import art1 from "../../assets/image_2.jpeg";
import art2 from "../../assets/image_1.jpeg";

/* =====================================================================
   HERO — SUMI-style editorial opening (no video)
   Left: giant headline that rises in line by line.
   Right: a "living canvas" (WebGL) that flows from painting to painting
   with an ink/flame dissolve, ripples under the mouse and bends when
   you scroll. Click / swipe the canvas for the next painting.
   Falls back to a simple cross-fade if WebGL is not available.
   ===================================================================== */

// ---- Edit here ----
// ⚠ "Original Work" titles are placeholders — put the real painting names.
const SLIDES = [
  { img: sun, title: "Sun Chariot", artist: "Kotegadde S Ravi" },
  { img: trimurthy, title: "Trimurthy", artist: "Kotegadde S Ravi" },
  { img: art1, title: "Original Work", artist: "Kotegadde S Ravi" },
  { img: art2, title: "Original Work", artist: "Kotegadde S Ravi" },
];
const AUTOPLAY_MS = 6000;
const EYEBROW = "Fidelitus Gallery · Bengaluru · Since 2014";
const LINES = ["Where every", "canvas", "breathes."]; // the middle line is set in italic orange
const TEXT = "Original hand-painted works by Kotegadde S Ravi and celebrated Indian artists — exhibited, collected and lived with.";

const ORANGE = "#F39314";
const ease = [0.22, 1, 0.36, 1];
const pad = (n) => String(n).padStart(2, "0");

const CSS = `
.hx { position: relative; color: #fff; overflow: hidden;
  min-height: max(600px, calc(100svh - 78px)); display: flex; align-items: center; }
.hx::before { content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(90deg, rgba(13,9,7,.92) 0%, rgba(13,9,7,.75) 40%, rgba(13,9,7,.35) 70%, rgba(13,9,7,.2) 100%),
              linear-gradient(to bottom, rgba(13,9,7,0) 70%, rgba(13,9,7,.6) 100%); }
.hx-in { position: relative; width: 100%; max-width: 1440px; margin: 0 auto; padding: 48px 24px 88px;
  display: grid; gap: 40px; align-items: center; }
@media (min-width: 1024px) { .hx-in { grid-template-columns: 1.05fr .95fr; gap: 56px; padding: 40px 48px 96px; } }

.hx-eyebrow { display: flex; align-items: center; gap: 14px; margin: 0; font-family: Roboto, system-ui, sans-serif;
  font-size: 12px; font-weight: 500; letter-spacing: .32em; text-transform: uppercase; color: rgba(255,255,255,.7); }
.hx-eyebrow::before { content: ""; width: 42px; height: 1px; background: ${ORANGE}; }

.hx-title { margin: 22px 0 0; font-family: "Cormorant Garamond", Georgia, serif; font-weight: 500;
  font-size: clamp(54px, 8.6vw, 132px); line-height: .92; letter-spacing: -.02em; }
.hx-line { display: block; overflow: hidden; padding-bottom: .08em; }
.hx-line > span { display: inline-block; will-change: transform; }
.hx-line.is-accent > span { font-style: italic; color: ${ORANGE}; padding-left: .35em; }

.hx-text { max-width: 30rem; margin: 26px 0 0; font-family: Roboto, system-ui, sans-serif; font-size: 16px; line-height: 1.75;
  color: rgba(255,255,255,.75); }
.hx-ctas { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 32px; }
.hx-btn { display: inline-flex; align-items: center; gap: 10px; height: 52px; padding: 0 28px; border-radius: 999px;
  font-family: Roboto, system-ui, sans-serif; font-size: 13px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase;
  text-decoration: none; transition: background-color .35s ease, color .35s ease, border-color .35s ease, gap .3s ease; }
.hx-btn:hover { gap: 14px; }
.hx-btn.is-solid { background: #fff; color: #111; border: 1px solid #fff; }
.hx-btn.is-solid:hover { background: ${ORANGE}; border-color: ${ORANGE}; color: #fff; }
.hx-btn.is-ghost { color: #fff; border: 1px solid rgba(255,255,255,.4); }
.hx-btn.is-ghost:hover { border-color: #fff; background: rgba(255,255,255,.08); }
.hx-btn:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }

/* living canvas */
.hx-stage { position: relative; justify-self: center; width: 100%; max-width: 620px; aspect-ratio: 4 / 5; max-height: 76svh; }
@media (max-width: 1023px) { .hx-stage { max-width: 520px; } }
.hx-frame { position: absolute; inset: 0; overflow: hidden; border-radius: 4px; cursor: pointer; background: #120c0a;
  box-shadow: 0 50px 90px -40px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.08); touch-action: pan-y; }
.hx-frame canvas, .hx-frame img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.hx-frame img { object-fit: cover; transition: opacity 1.4s ease; }
.hx-shade { position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to top, rgba(0,0,0,.7) 0%, rgba(0,0,0,0) 38%); }
.hx-cap { position: absolute; left: 24px; right: 24px; bottom: 22px; pointer-events: none; font-family: Roboto, system-ui, sans-serif; }
.hx-cap small { display: block; font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: rgba(255,255,255,.65); }
.hx-cap strong { display: block; margin-top: 6px; font-family: "Cormorant Garamond", Georgia, serif; font-size: 34px; font-weight: 500; line-height: 1.05; }
.hx-count { position: absolute; top: 18px; right: 20px; pointer-events: none; font-family: Roboto, system-ui, sans-serif;
  font-size: 12px; letter-spacing: .2em; color: rgba(255,255,255,.85); }
.hx-count b { color: ${ORANGE}; font-weight: 500; }
.hx-bar { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: rgba(255,255,255,.15); }
.hx-bar i { display: block; height: 100%; background: ${ORANGE}; transform-origin: left; }
.hx-hint { position: absolute; left: -6px; top: 50%; transform: translate(-100%, -50%) rotate(-90deg); transform-origin: right center;
  font-family: Roboto, system-ui, sans-serif; font-size: 11px; letter-spacing: .3em; text-transform: uppercase;
  color: rgba(255,255,255,.5); white-space: nowrap; }
@media (max-width: 1023px) { .hx-hint { display: none; } }

/* scroll cue */
.hx-scroll { position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%); display: flex; flex-direction: column;
  align-items: center; gap: 10px; font-family: Roboto, system-ui, sans-serif; font-size: 10.5px; letter-spacing: .34em;
  text-transform: uppercase; color: rgba(255,255,255,.6); }
.hx-scroll span { position: relative; width: 1px; height: 46px; background: rgba(255,255,255,.2); overflow: hidden; }
.hx-scroll span::after { content: ""; position: absolute; left: 0; top: -50%; width: 1px; height: 50%; background: #fff;
  animation: hx-drip 2s cubic-bezier(.65,0,.35,1) infinite; }
@keyframes hx-drip { to { top: 100%; } }
@media (max-width: 1023px) { .hx-scroll { display: none; } }
@media (prefers-reduced-motion: reduce) { .hx-scroll span::after { animation: none; top: 0; } .hx-frame img { transition: none; } }
`;

export default function Hero() {
  const reduce = useReducedMotion();
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const [glOk, setGlOk] = useState(true);
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0); // restarts the progress bar
  const drag = useRef({ x: 0, on: false, moved: false });

  // start the WebGL "living canvas"
  useEffect(() => {
    let gl;
    try {
      gl = new InkGL(canvasRef.current, SLIDES.map((s) => s.img));
    } catch {
      setGlOk(false);
      return;
    }
    glRef.current = gl;
    gl.velocitySource = () => scrollFx.velocity;
    gl.onChange = (i) => setActive(i);
    gl.ready.catch(() => setGlOk(false));

    // only animate while the hero is on screen
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? gl.start() : gl.stop()), { threshold: 0 });
    io.observe(frameRef.current);
    return () => {
      io.disconnect();
      gl.destroy();
      glRef.current = null;
    };
  }, []);

  const go = (dir) => {
    const gl = glRef.current;
    if (glOk && gl) {
      if (dir > 0 ? gl.next() : gl.prev()) {
        setActive(gl.nextIdx); // caption changes as the ink starts to flow
        setTick((t) => t + 1);
      }
    } else {
      setActive((a) => (a + dir + SLIDES.length) % SLIDES.length);
      setTick((t) => t + 1);
    }
  };

  // autoplay
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [tick, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  // mouse ripple + click/swipe for next
  const onMove = (e) => {
    const r = frameRef.current.getBoundingClientRect();
    glRef.current?.setMouse((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    if (drag.current.on && Math.abs(e.clientX - drag.current.x) > 10) drag.current.moved = true;
  };
  const onDown = (e) => (drag.current = { x: e.clientX, on: true, moved: false });
  const onUp = (e) => {
    const d = drag.current;
    d.on = false;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    else if (!d.moved) go(1);
  };

  const slide = SLIDES[active];
  const rise = (i) => ({
    initial: reduce ? false : { y: "110%" },
    animate: { y: "0%" },
    transition: { duration: 1.2, ease, delay: 0.35 + i * 0.12 },
  });
  const fade = (d) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease, delay: d },
  });

  return (
    <section className="hx" aria-label="Welcome">
      <style>{CSS}</style>

      <div className="hx-in">
        {/* headline */}
        <div>
          <motion.p className="hx-eyebrow" {...fade(0.2)}>{EYEBROW}</motion.p>
          <h1 className="hx-title" aria-label={LINES.join(" ")}>
            {LINES.map((l, i) => (
              <span key={l} className={`hx-line ${i === 1 ? "is-accent" : ""}`} aria-hidden="true">
                <motion.span {...rise(i)}>{l}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="hx-text" {...fade(0.8)}>{TEXT}</motion.p>
          <motion.div className="hx-ctas" {...fade(0.95)}>
            <Link to="/gallery" className="hx-btn is-solid" data-cursor="Enter">
              Explore the Gallery <span aria-hidden>→</span>
            </Link>
            <a href="#services" className="hx-btn is-ghost">
              Our Services
            </a>
          </motion.div>
        </div>

        {/* living canvas */}
        <motion.div
          className="hx-stage"
          initial={reduce ? false : { opacity: 0, scale: 0.94, clipPath: "inset(12% 12% 12% 12%)" }}
          animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.6, ease, delay: 0.25 }}
        >
          <span className="hx-hint" aria-hidden>Click · Drag — Next</span>
          <div
            ref={frameRef}
            className="hx-frame"
            data-cursor="Next"
            role="button"
            tabIndex={0}
            aria-label={`Painting ${active + 1} of ${SLIDES.length}: ${slide.title}. Show next painting`}
            onPointerMove={onMove}
            onPointerDown={onDown}
            onPointerUp={onUp}
            onPointerLeave={() => {
              drag.current.on = false;
              glRef.current?.leave();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); go(1); }
              if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
            }}
          >
            {glOk ? (
              <canvas ref={canvasRef} aria-hidden="true" />
            ) : (
              SLIDES.map((s, i) => (
                <img key={i} src={s.img} alt="" style={{ opacity: i === active ? 1 : 0 }} draggable={false} />
              ))
            )}
            <div className="hx-shade" aria-hidden />
            <span className="hx-count" aria-hidden>
              <b>{pad(active + 1)}</b> / {pad(SLIDES.length)}
            </span>
            <div className="hx-cap" aria-live="polite">
              <motion.div key={active} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
                <small>{slide.artist}</small>
                <strong>{slide.title}</strong>
              </motion.div>
            </div>
            <div className="hx-bar" aria-hidden>
              <motion.i
                key={tick}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: reduce ? 0 : 1 }}
                transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hx-scroll" aria-hidden>
        Scroll
        <span />
      </div>
    </section>
  );
}
