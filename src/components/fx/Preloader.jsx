import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/Fidelitus_art_gallery_logo.png";

/* =====================================================================
   Preloader — SUMI-style opening: logo + counting number, then the
   whole screen lifts away. Shown once per visit (per browser tab).
   ===================================================================== */

const ORANGE = "#F39314";
const ease = [0.76, 0, 0.24, 1];
const MIN_MS = 1500;   // always show at least this long (so it never just flashes)
const MAX_MS = 4500;   // never wait longer than this
const KEY = "fg-intro-seen";

export default function Preloader() {
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem(KEY); } catch { return true; }
  });
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!show) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const start = performance.now();
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);

    let raf;
    let value = 0;
    const tick = (now) => {
      const t = now - start;
      // creep towards 90 %, then run to 100 % once the page has loaded (and the minimum time passed)
      const goal = (loaded && t > MIN_MS) || t > MAX_MS ? 100 : Math.min(90, (t / MAX_MS) * 140);
      value += (goal - value) * 0.08;
      if (goal === 100 && value > 99.5) value = 100;
      setPct(Math.round(value));
      if (value < 100) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          try { sessionStorage.setItem(KEY, "1"); } catch { /* private mode */ }
          setShow(false);
        }, 250);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      html.style.overflow = prevOverflow;
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="pre"
          aria-hidden="true"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 1.1, ease } }}
          style={{
            position: "fixed", inset: 0, zIndex: 10000, background: "#0d0907", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Roboto, system-ui, sans-serif",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, transition: { duration: 0.5 } }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}
          >
            <span style={{ background: "#fff", borderRadius: 12, padding: "8px 16px", boxShadow: "0 20px 50px -20px rgba(0,0,0,.8)" }}>
              <img src={logo} alt="" style={{ display: "block", height: 46, width: "auto" }} />
            </span>
            <span style={{ fontSize: 11, letterSpacing: ".42em", textTransform: "uppercase", color: "rgba(255,255,255,.6)" }}>
              Art that lives with you
            </span>
          </motion.div>

          {/* counter + line */}
          <div style={{ position: "absolute", left: 32, right: 32, bottom: 28, display: "flex", alignItems: "flex-end", gap: 24 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.15)", marginBottom: 18 }}>
              <div style={{ height: 1, width: `${pct}%`, background: ORANGE, transition: "width .1s linear" }} />
            </div>
            <span style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: "clamp(56px, 9vw, 120px)", lineHeight: 0.8, fontWeight: 500 }}>
              {String(pct).padStart(3, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
