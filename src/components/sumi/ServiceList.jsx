import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SERVICES } from "../../data/services.js";
import { Label, Rise, SU, SITE, ease } from "./common.jsx";

/* =====================================================================
   03 — Services: a quiet numbered list.
   On desktop a photo floats beside the mouse and changes per row.
   ===================================================================== */

// service id → page on fidelitusgallery.com
const URL = { "rent-on-art": `${SITE}/rent-an-art/` };
const href = (id) => URL[id] || `${SITE}/${id}/`;

const CSS = `
.sl { list-style: none; margin: 56px 0 0; padding: 0; border-bottom: 1px solid ${SU.line}; }
.sl li { border-top: 1px solid ${SU.line}; }
.sl a { display: grid; grid-template-columns: 56px 1fr auto 28px; align-items: center; gap: 16px; padding: 26px 0;
  text-decoration: none; color: ${SU.ink}; transition: padding .5s cubic-bezier(.22,1,.36,1), color .4s ease; }
.sl a:hover { padding-left: 18px; color: #fff; }
.sl small { font-size: 11px; letter-spacing: .2em; color: ${SU.ember}; }
.sl strong { font-weight: 300; font-size: clamp(22px, 2.8vw, 40px); letter-spacing: .02em; }
.sl em { font-style: normal; font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: ${SU.mute}; }
.sl i { font-style: normal; opacity: .4; transition: opacity .4s ease, transform .4s ease; }
.sl a:hover i { opacity: 1; transform: translateX(4px); }
@media (max-width: 640px) { .sl a { grid-template-columns: 40px 1fr 20px; } .sl em { display: none; } }
.sl-float { position: fixed; left: 0; top: 0; z-index: 50; width: 280px; aspect-ratio: 4 / 5; pointer-events: none;
  overflow: hidden; box-shadow: 0 40px 80px -30px rgba(0,0,0,.9); }
.sl-float img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
@media (hover: none), (max-width: 899px) { .sl-float { display: none; } }
`;

export default function ServiceList() {
  const [hot, setHot] = useState(null);
  const floatRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, cx: 0, cy: 0 });

  // the floating photo trails the mouse
  useEffect(() => {
    if (hot === null) return;
    let raf;
    const loop = () => {
      const p = pos.current;
      p.cx += (p.x - p.cx) * 0.14;
      p.cy += (p.y - p.cy) * 0.14;
      if (floatRef.current) floatRef.current.style.translate = `${p.cx + 40}px ${p.cy - 170}px`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [hot]);

  const onMove = (e) => {
    const p = pos.current;
    if (hot === null) { p.cx = e.clientX; p.cy = e.clientY; }
    p.x = e.clientX;
    p.y = e.clientY;
  };

  return (
    <section id="services" className="su-sec">
      <style>{CSS}</style>
      <div className="su-wrap">
        <Label no="03">Services</Label>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24, marginTop: 28 }}>
          <h2 className="su-big">Art for occasions,<br />offices and learning.</h2>
          <Rise><p className="su-text" style={{ margin: 0, maxWidth: 26 + "rem" }}>Rent the gallery, rent a painting, book a live
            speed-painting act or learn with us — nine ways to bring art into your space.</p></Rise>
        </div>

        <ul className="sl" onMouseLeave={() => setHot(null)} onMouseMove={onMove}>
          {SERVICES.map((s, i) => (
            <li key={s.id} onMouseEnter={() => setHot(i)}>
              <a href={href(s.id)}>
                <small>{String(i + 1).padStart(2, "0")}</small>
                <strong>{s.name}</strong>
                <em>{s.tag}</em>
                <i aria-hidden>→</i>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {hot !== null && SERVICES[hot]?.image && (
          <motion.div
            ref={floatRef}
            className="sl-float"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease }}
            style={{ translate: `${pos.current.cx + 40}px ${pos.current.cy - 170}px` }}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={hot}
                src={SERVICES[hot].image}
                alt=""
                initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.2 } }}
                transition={{ duration: 0.7, ease }}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
