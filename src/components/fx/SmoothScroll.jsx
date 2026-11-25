import { useEffect } from "react";

/* =====================================================================
   SmoothScroll — buttery mouse-wheel scrolling (like Lenis / GSAP sites)
   - Desktop mouse wheel / trackpad only; phones keep their own native scroll
   - Still scrolls the real page, so sticky navbars, anchors and
     window.scrollTo() all keep working
   - Lets inner scroll areas (menus, modals, sideways carousels) scroll normally
   - Off for visitors who ask for reduced motion
   - Shares scroll speed through `scrollFx.velocity` (used by the hero's bend effect)
   ===================================================================== */

export const scrollFx = { velocity: 0 }; // -1 … 1, read by effects

const EASE = 0.1;       // 0.05 = very floaty, 0.2 = snappy
const WHEEL_SPEED = 1;  // multiply wheel distance

function scrollableParent(el, dy) {
  while (el && el !== document.body && el !== document.documentElement) {
    const s = getComputedStyle(el);
    if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 1) {
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      if ((dy < 0 && !atTop) || (dy > 0 && !atBottom)) return el;
    }
    el = el.parentElement;
  }
  return null;
}

export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    // velocity for effects (works with native scrolling too)
    let lastY = window.scrollY;
    let velRaf;
    const trackVelocity = () => {
      const y = window.scrollY;
      const v = (y - lastY) / 60;
      scrollFx.velocity += (Math.max(-1, Math.min(1, v)) - scrollFx.velocity) * 0.2;
      lastY = y;
      velRaf = requestAnimationFrame(trackVelocity);
    };
    velRaf = requestAnimationFrame(trackVelocity);

    if (reduce || !fine) return () => cancelAnimationFrame(velRaf);

    let target = window.scrollY;
    let current = target;
    let raf = null;
    let ownScroll = false;

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

    const step = () => {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.4) current = target;
      const before = window.scrollY;
      window.scrollTo(0, current);
      if (window.scrollY !== before) ownScroll = true; // only expect an event if the page really moved
      if (current !== target) raf = requestAnimationFrame(step);
      else raf = null;
    };

    const onWheel = (e) => {
      if (e.ctrlKey || e.defaultPrevented) return;                 // pinch-zoom / handled elsewhere
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;          // sideways swipes
      let dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (scrollableParent(e.target, dy)) return;                   // inner scroll areas
      e.preventDefault();
      if (!raf) current = target = window.scrollY;                  // resync after native jumps
      target = Math.max(0, Math.min(maxScroll(), target + dy * WHEEL_SPEED));
      if (!raf) raf = requestAnimationFrame(step);
    };

    // any scroll we did not cause (keyboard, scrollbar drag, links, window.scrollTo) → follow it
    const onScroll = () => {
      if (ownScroll) {
        ownScroll = false;
        return;
      }
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      current = target = window.scrollY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(velRaf);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
