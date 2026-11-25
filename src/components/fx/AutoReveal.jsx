import { useEffect } from "react";

/* =====================================================================
   AutoReveal — section headings (and anything with data-reveal)
   rise and fade in as they scroll into view. Works on every page
   without editing each section. Off for reduced-motion visitors.
   ===================================================================== */

const CSS = `
.fx-reveal { opacity: 0; transform: translateY(42px); filter: blur(6px);
  transition: opacity 1.1s cubic-bezier(.22,1,.36,1), transform 1.2s cubic-bezier(.22,1,.36,1), filter 1.1s ease;
  transition-delay: var(--fx-delay, 0s); }
.fx-reveal.is-in { opacity: 1; transform: none; filter: none; }
@media (prefers-reduced-motion: reduce) { .fx-reveal { opacity: 1; transform: none; filter: none; transition: none; } }
`;

const SELECTOR = "main h2, main [data-reveal]";
const SKIP = ".hx, [data-no-reveal]"; // the hero animates itself

export default function AutoReveal({ watchKey }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let io;
    const t = setTimeout(() => {
      const els = [...document.querySelectorAll(SELECTOR)].filter(
        (el) => !el.closest(SKIP) && !el.classList.contains("fx-reveal")
      );
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io.unobserve(e.target);
            }
          }),
        { rootMargin: "0px 0px -10% 0px" }
      );
      els.forEach((el) => {
        // already on screen → no hide/show flash
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9 && r.bottom > 0) return;
        el.classList.add("fx-reveal");
        io.observe(el);
      });
    }, 120);
    return () => {
      clearTimeout(t);
      io && io.disconnect();
    };
  }, [watchKey]);

  return <style>{CSS}</style>;
}
