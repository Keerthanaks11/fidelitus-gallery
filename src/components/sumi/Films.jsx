import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Label, SU, ease } from "./common.jsx";

/* =====================================================================
   04 — Films: one large playing film + a quiet list to switch between them.
   Only ONE YouTube player is ever loaded (much lighter than six).
   ===================================================================== */

// ⚠ Titles are placeholders — replace with the real film names.
const FILMS = [
  { id: "rEwtr7ZEgmo", tag: "Exhibition", title: "Film 01" },
  { id: "L8FdDWYDaWs", tag: "Live Painting", title: "Film 02" },
  { id: "TNS9jGeRc-0", tag: "Artist Story", title: "Film 03" },
  { id: "Zxq4gybBQys", tag: "Behind the Canvas", title: "Film 04" },
  { id: "Xle_9-NtCPY", tag: "Gallery Tour", title: "Film 05" },
  { id: "INecz1Zs4rA", tag: "Highlights", title: "Film 06" },
];
const CHANNEL = "https://www.youtube.com/"; // ← your YouTube channel link

const embed = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3`;
const thumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const CSS = `
.fm { display: grid; gap: 40px; margin-top: 56px; }
@media (min-width: 1000px) { .fm { grid-template-columns: 1.6fr 1fr; gap: 56px; } }
.fm-screen { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #0d0c0b; }
.fm-screen img, .fm-screen iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; object-fit: cover; }
.fm-screen iframe { pointer-events: none; transform: scale(1.2); }
.fm-screen::after { content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to top, rgba(13,12,11,.7), rgba(13,12,11,0) 45%); }
.fm-now { position: absolute; left: 24px; bottom: 20px; z-index: 1; font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: ${SU.mute}; }
.fm-now b { display: block; margin-top: 6px; font-weight: 300; font-size: 26px; letter-spacing: .04em; text-transform: none; color: ${SU.ink}; }
.fm-list { list-style: none; margin: 0; padding: 0; border-bottom: 1px solid ${SU.line}; align-self: start; }
.fm-list li { border-top: 1px solid ${SU.line}; }
.fm-list button { width: 100%; display: grid; grid-template-columns: 40px 1fr auto; align-items: baseline; gap: 12px; padding: 18px 0;
  background: none; border: 0; color: ${SU.mute}; text-align: left; cursor: pointer; font: 300 17px Roboto, system-ui, sans-serif;
  transition: color .3s ease, padding .4s ease; }
.fm-list button:hover { color: ${SU.ink}; padding-left: 10px; }
.fm-list button.is-on { color: ${SU.ink}; }
.fm-list small { font-size: 11px; letter-spacing: .2em; color: ${SU.ember}; }
.fm-list em { font-style: normal; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; }
.fm-list button.is-on em::before { content: "● "; color: ${SU.ember}; }
`;

export default function Films() {
  const [cur, setCur] = useState(0);
  const [near, setNear] = useState(false); // only load YouTube once the section is close
  const ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "300px 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const f = FILMS[cur];
  return (
    <section id="films" ref={ref} className="su-sec">
      <style>{CSS}</style>
      <div className="su-wrap">
        <Label no="04">Films</Label>
        <h2 className="su-big" style={{ marginTop: 28 }}>Art in motion.</h2>

        <div className="fm">
          <div className="fm-screen">
            <AnimatePresence mode="wait">
              <motion.div key={f.id} style={{ position: "absolute", inset: 0 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }}>
                <img src={thumb(f.id)} alt="" loading="lazy" />
                {near && <iframe src={embed(f.id)} title={`${f.tag} — ${f.title}`} allow="autoplay; encrypted-media" tabIndex={-1} />}
              </motion.div>
            </AnimatePresence>
            <p className="fm-now">Now playing<b>{f.tag}</b></p>
          </div>

          <div>
            <ul className="fm-list">
              {FILMS.map((x, i) => (
                <li key={x.id}>
                  <button type="button" className={i === cur ? "is-on" : ""} aria-pressed={i === cur} onClick={() => setCur(i)}>
                    <small>{String(i + 1).padStart(2, "0")}</small>
                    <span>{x.tag}</span>
                    <em>{x.title}</em>
                  </button>
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 28, marginTop: 32 }}>
              <a className="su-link" href={`https://www.youtube.com/watch?v=${f.id}`} target="_blank" rel="noopener noreferrer">
                Watch with sound <span aria-hidden>↗</span>
              </a>
              <a className="su-link" href={CHANNEL} target="_blank" rel="noopener noreferrer">
                Explore more <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
