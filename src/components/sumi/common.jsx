import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/* =====================================================================
   SUMI-style building blocks shared by the home page sections
   ===================================================================== */

export const SU = {
  bg: "#1a1918",       // charcoal (SUMI's theme colour is #1A1A1A)
  ink: "#e9e6e1",      // warm white text
  mute: "rgba(233,230,225,.55)",
  line: "rgba(233,230,225,.14)",
  ember: "#d0763a",    // muted brand orange, like a glowing ember
};
export const ease = [0.22, 1, 0.36, 1];
export const SITE = "https://fidelitusgallery.com";

// Global classes for the SUMI home page
export function SumiStyles() {
  return (
    <style>{`
.su { position: relative; background: ${SU.bg}; color: ${SU.ink}; font-family: Roboto, system-ui, sans-serif; font-weight: 300; }
.su a { color: inherit; }
.su-wrap { max-width: 1440px; margin: 0 auto; padding: 0 24px; }
@media (min-width: 900px) { .su-wrap { padding: 0 56px; } }
.su-sec { position: relative; padding: 120px 0; border-top: 1px solid ${SU.line}; }
@media (max-width: 899px) { .su-sec { padding: 84px 0; } }

.su-label { display: flex; align-items: center; gap: 16px; margin: 0; font-size: 12px; font-weight: 400;
  letter-spacing: .32em; text-transform: uppercase; color: ${SU.mute}; }
.su-label b { font-weight: 400; color: ${SU.ember}; letter-spacing: .1em; }
.su-label i { width: 48px; height: 1px; background: ${SU.line}; }

.su-big { margin: 0; font-weight: 300; font-size: clamp(30px, 3.6vw, 54px); line-height: 1.25; letter-spacing: .01em; }
.su-line { display: block; overflow: hidden; padding-bottom: .06em; }
.su-line > span { display: inline-block; }
.su-text { font-size: 15px; line-height: 2; color: ${SU.mute}; max-width: 34rem; }

.su-link { display: inline-flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 400; letter-spacing: .28em;
  text-transform: uppercase; text-decoration: none; padding-bottom: 8px; border-bottom: 1px solid ${SU.line};
  transition: gap .4s ease, border-color .4s ease, color .4s ease; }
.su-link:hover { gap: 18px; border-color: ${SU.ember}; color: #fff; }
.su a:focus-visible, .su button:focus-visible { outline: 1px solid ${SU.ink}; outline-offset: 4px; }

.su-img { position: relative; overflow: hidden; background: #262321; }
.su-img img { width: 100%; height: 100%; object-fit: cover; display: block;
  transition: filter 1.2s ease, transform 1.6s cubic-bezier(.22,1,.36,1); }
.su-img:hover img, .su-img.is-color img { filter: none; }

`}</style>
  );
}

// Section label: "01 —— Concept"
export function Label({ no, children }) {
  return (
    <p className="su-label">
      <b>{no}</b>
      <i aria-hidden="true" />
      {children}
    </p>
  );
}

// Lines that rise out of a mask as they scroll into view
export function RevealLines({ lines, as: Tag = "h2", className = "su-big", delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <Tag className={className} aria-label={lines.join(" ")}>
      {lines.map((l, i) => (
        <span key={i} className="su-line" aria-hidden="true">
          <motion.span
            initial={reduce ? false : { y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 1.3, ease, delay: delay + i * 0.09 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// Fade + rise
export function Rise({ children, delay = 0, className, style }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.2, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

// Image that is uncovered (curtain) on scroll, drifts slowly (parallax), turns colour on hover
export function RevealImage({ src, alt = "", ratio = "4 / 5", parallax = 60, className = "", style }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-parallax, parallax]);
  return (
    <motion.div
      ref={ref}
      className={`su-img ${className}`}
      style={{ aspectRatio: ratio, ...style }}
      initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.6, ease }}
    >
      <motion.img src={src} alt={alt} loading="lazy" decoding="async" draggable={false}
        style={{ y, scale: 1.18, position: "absolute", inset: 0 }} />
    </motion.div>
  );
}
