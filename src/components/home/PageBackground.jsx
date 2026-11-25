import { useEffect } from "react";
import bgImage from "../../assets/background.jpg";

/* =====================================================================
   PAGE BACKGROUND — one fixed image + overlay behind the whole page.
   The image never moves; every section slides over it as you scroll.
   Put <PageBackground /> once, at the top of your page/layout.

   It also clears the white background that html / body / #root usually
   have (from index.css), because that white would otherwise hide the image.
   Everything goes back to normal when you leave the page.
   ===================================================================== */

// ---- Easy settings ----
const OVERLAY = "rgba(0, 0, 0, 0.55)"; // layer on top of the image (0 = none, 1 = solid)
const BLUR = 0;                        // px of blur on the image (0 = sharp)
const CLEAR = ["html", "body", "#root", "#app", "#__next"]; // page wrappers to make see-through

export default function PageBackground() {
  // make the page wrappers see-through while this page is open
  useEffect(() => {
    const changed = [];
    CLEAR.forEach((sel) => {
      const el = document.querySelector(sel);
      if (!el) return;
      changed.push([el, el.style.background]);
      // html keeps a dark colour underneath, everything else becomes transparent
      el.style.background = sel === "html" ? "#111" : "transparent";
    });
    return () => changed.forEach(([el, old]) => (el.style.background = old));
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        background: "#111",
        pointerEvents: "none",
        transform: "translateZ(0)", // own GPU layer → no repaint while scrolling
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    >
      <img
        src={bgImage}
        alt=""
        draggable={false}
        decoding="async"
        style={{
          position: "absolute",
          inset: BLUR ? -BLUR * 2 : 0,
          width: BLUR ? `calc(100% + ${BLUR * 4}px)` : "100%",
          height: BLUR ? `calc(100% + ${BLUR * 4}px)` : "100%",
          objectFit: "cover",
          filter: BLUR ? `blur(${BLUR}px)` : "none",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: OVERLAY }} />
    </div>
  );
}