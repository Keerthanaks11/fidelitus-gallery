import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import InkGL from "../fx/InkGL.js";
import { scrollFx } from "../fx/SmoothScroll.jsx";
import { SU, ease } from "./common.jsx";

import bg from "../../assets/background.jpg";
import sun from "../../assets/sun.jpeg";
import trimurthy from "../../assets/trimurthy.jpeg";
import mural from "../../assets/image_11.jpg";

/* =====================================================================
   SUMI-style full-screen hero
   Paintings fill the whole screen in muted colour with drifting charcoal
   smoke; they burn into one another every few seconds. Centred, quiet
   title + a question, like SUMI's "What does it mean to have a fulfilling life?"
   ===================================================================== */

// ⚠ Names for the background painting and the mural are placeholders — rename them.
const SLIDES = [
  { img: bg, title: "From the Collection" },
  { img: sun, title: "Sun Chariot" },
  { img: trimurthy, title: "Trimurthy" },
  { img: mural, title: "Murals" },
];
const AUTOPLAY_MS = 6500;
const QUESTION = "What does it mean to live with art?";

const CSS = `
.sx { position: relative; height: 100svh; min-height: 560px; overflow: hidden; background: #0d0c0b; color: ${SU.ink};
  font-family: Roboto, system-ui, sans-serif; font-weight: 300; }
.sx canvas, .sx-fallback { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.sx-fallback img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(.7);
  transition: opacity 1.6s ease; }
.sx-veil { position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(13,12,11,.42) 0%, rgba(13,12,11,.62) 65%, rgba(13,12,11,.88) 100%); }
.sx-hit { position: absolute; inset: 0; cursor: pointer; }
.sx-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none; width: 92%; }
.sx-kicker { margin: 0; font-size: 11px; letter-spacing: .5em; text-transform: uppercase; color: rgba(233,230,225,.8); }
.sx-title { margin: 22px 0 0; font-weight: 200; font-size: clamp(34px, 6.4vw, 104px); letter-spacing: .32em; line-height: 1.05;
  padding-left: .32em; }
.sx-title span { display: block; overflow: hidden; }
.sx-title span > span { display: inline-block; }
.sx-q { margin: 26px 0 0; font-family: "Cormorant Garamond", Georgia, serif; font-style: italic; font-size: clamp(18px, 1.8vw, 26px);
  color: rgba(233,230,225,.8); }
.sx-foot { position: absolute; left: 24px; right: 24px; bottom: 28px; display: flex; align-items: flex-end; justify-content: space-between;
  gap: 24px; font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: ${SU.mute}; pointer-events: none; }
@media (min-width: 900px) { .sx-foot { left: 56px; right: 56px; bottom: 36px; } }
.sx-cap b { color: ${SU.ink}; font-weight: 400; }
.sx-cap em { font-style: normal; color: ${SU.ember}; }
.sx-bar { width: 120px; height: 1px; margin-top: 12px; background: ${SU.line}; }
.sx-bar i { display: block; height: 100%; background: ${SU.ink}; transform-origin: left; }
.sx-scroll { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.sx-scroll span { position: relative; width: 1px; height: 56px; background: ${SU.line}; overflow: hidden; }
.sx-scroll span::after { content: ""; position: absolute; left: 0; top: -40%; width: 1px; height: 40%; background: ${SU.ink};
  animation: sx-drip 2.2s cubic-bezier(.65,0,.35,1) infinite; }
@keyframes sx-drip { to { top: 100%; } }
@media (prefers-reduced-motion: reduce) { .sx-scroll span::after { animation: none; top: 0; } }
`;

export default function SumiHero() {
  const reduce = useReducedMotion();
  const canvasRef = useRef(null);
  const hitRef = useRef(null);
  const glRef = useRef(null);
  const [glOk, setGlOk] = useState(true);
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let gl;
    try {
      gl = new InkGL(canvasRef.current, SLIDES.map((s) => s.img), { duration: 2.4, saturation: 1, smoke: 1 });
    } catch {
      setGlOk(false);
      return;
    }
    glRef.current = gl;
    gl.velocitySource = () => scrollFx.velocity;
    gl.onChange = (i) => setActive(i);
    gl.ready.catch(() => setGlOk(false));
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? gl.start() : gl.stop()));
    io.observe(canvasRef.current);
    return () => {
      io.disconnect();
      gl.destroy();
      glRef.current = null;
    };
  }, []);

  const next = () => {
    const gl = glRef.current;
    if (glOk && gl) {
      if (gl.next()) {
        setActive(gl.nextIdx);
        setTick((t) => t + 1);
      }
    } else {
      setActive((a) => (a + 1) % SLIDES.length);
      setTick((t) => t + 1);
    }
  };

  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [tick, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMove = (e) => {
    const r = hitRef.current.getBoundingClientRect();
    glRef.current?.setMouse((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
  };

  const rise = (d) => ({
    initial: reduce ? false : { y: "110%" },
    animate: { y: "0%" },
    transition: { duration: 1.6, ease, delay: d },
  });

  return (
    <section className="sx" aria-label="Fidelitus Gallery">
      <style>{CSS}</style>

      {glOk ? (
        <canvas ref={canvasRef} aria-hidden="true" />
      ) : (
        <div className="sx-fallback" aria-hidden="true">
          {SLIDES.map((s, i) => <img key={i} src={s.img} alt="" style={{ opacity: i === active ? 1 : 0 }} />)}
        </div>
      )}
      <div className="sx-veil" aria-hidden="true" />
      <div
        ref={hitRef}
        className="sx-hit"
        data-cursor="Next"
        role="button"
        tabIndex={0}
        aria-label={`Showing ${SLIDES[active].title}. Show next painting`}
        onPointerMove={onMove}
        onPointerLeave={() => glRef.current?.leave()}
        onClick={next}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), next())}
      />

      <div className="sx-center">
        <motion.p className="sx-kicker" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, delay: 0.4 }}>
          Bengaluru · Since 2014
        </motion.p>
        <h1 className="sx-title" aria-label="Fidelitus Gallery">
          <span aria-hidden="true"><motion.span {...rise(0.5)}>FIDELITUS</motion.span></span>
          <span aria-hidden="true"><motion.span {...rise(0.65)}>GALLERY</motion.span></span>
        </h1>
        <motion.p className="sx-q" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease, delay: 1.2 }}>
          {QUESTION}
        </motion.p>
      </div>

      <div className="sx-foot" aria-hidden="true">
        <div className="sx-cap">
          <em>{String(active + 1).padStart(2, "0")}</em> / {String(SLIDES.length).padStart(2, "0")} — <b>{SLIDES[active].title}</b>
          <div className="sx-bar">
            <motion.i key={tick} initial={{ scaleX: 0 }} animate={{ scaleX: reduce ? 0 : 1 }}
              transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }} />
          </div>
        </div>
        <div className="sx-scroll">
          Scroll
          <span />
        </div>
      </div>
    </section>
  );
}
