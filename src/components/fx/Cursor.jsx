import { useEffect, useRef } from "react";

/* =====================================================================
   Cursor — a soft ring that follows the mouse (desktop only).
   - grows over links and buttons
   - shows a word over anything with data-cursor="Word" (e.g. "Next", "View")
   The normal mouse pointer stays visible, so nothing is lost.
   ===================================================================== */

const CSS = `
.fx-cursor { position: fixed; left: 0; top: 0; z-index: 9999; pointer-events: none; width: 34px; height: 34px;
  margin: -17px 0 0 -17px; border-radius: 999px; border: 1px solid rgba(255,255,255,.85);
  mix-blend-mode: difference; display: flex; align-items: center; justify-content: center;
  transition: width .35s cubic-bezier(.22,1,.36,1), height .35s cubic-bezier(.22,1,.36,1), margin .35s cubic-bezier(.22,1,.36,1),
    background-color .35s ease, opacity .3s ease; opacity: 0; }
.fx-cursor.is-on { opacity: 1; }
.fx-cursor.is-link { width: 58px; height: 58px; margin: -29px 0 0 -29px; background: rgba(255,255,255,.12); }
.fx-cursor.is-label { width: 92px; height: 92px; margin: -46px 0 0 -46px; background: #fff; border-color: #fff; mix-blend-mode: normal;
  box-shadow: 0 10px 30px rgba(0,0,0,.35); }
.fx-cursor span { font: 500 11px/1 Roboto, system-ui, sans-serif; letter-spacing: .2em; text-transform: uppercase; color: #000;
  opacity: 0; transition: opacity .25s ease; }
.fx-cursor.is-label span { opacity: 1; }
.fx-cursor.is-down { transform: scale(.85); }
`;

export default function Cursor() {
  const ref = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!fine || !el) return;

    let x = -100, y = -100, cx = -100, cy = -100, raf;
    const loop = () => {
      const k = reduce ? 1 : 0.2;
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      el.style.translate = `${cx}px ${cy}px`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const update = (t) => {
      const tagged = t?.closest("[data-cursor]");
      const link = t?.closest("a, button, [role='button'], input, select, textarea, label");
      el.classList.toggle("is-label", !!tagged);
      el.classList.toggle("is-link", !tagged && !!link);
      if (tagged) label.current.textContent = tagged.getAttribute("data-cursor");
    };
    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      el.classList.add("is-on");
      update(e.target instanceof Element ? e.target : null);
    };
    // the page can scroll under a still mouse → re-check what is under it
    const onScroll = () => update(document.elementFromPoint(x, y));
    // …and the page itself can change under it (route changes, menus) → light re-check
    const poll = setInterval(onScroll, 300);
    const onLeave = () => el.classList.remove("is-on");
    const onDown = () => el.classList.add("is-down");
    const onUp = () => el.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(poll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div ref={ref} className="fx-cursor" aria-hidden="true">
        <span ref={label} />
      </div>
    </>
  );
}
