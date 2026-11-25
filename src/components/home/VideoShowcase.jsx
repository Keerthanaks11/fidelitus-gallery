import { useEffect, useRef, useState } from "react";

/* =====================================================================
   VIDEO SHOWCASE — "Art in Motion"
   - 6 YouTube videos, 3 per row, smoked-glass cards: video on top (icon, tag,
     title over it), glass body with a coloured accent, label, text, button
   - Videos autoplay muted & loop (browsers only allow muted autoplay)
   - Smooth scrolling: a video only loads when it comes near the screen,
     and pauses again when it leaves it
   - "Explore more" opens YouTube in a new tab
   ===================================================================== */

// ---- Edit here ----
const HEADING = {
  eyebrow: "Watch & Experience",
  title: "Art in Motion",
  subtitle: "Exhibitions, live painting and the stories behind the canvas — straight from our studio.",
};

// ⚠ Titles, tags and text are placeholders — replace them with your real video details.
const VIDEOS = [
  { id: "rEwtr7ZEgmo", tag: "Exhibition", title: "Video title 1", text: "A short line about what this video shows." },
  { id: "L8FdDWYDaWs", tag: "Live Painting", title: "Video title 2", text: "A short line about what this video shows." },
  { id: "TNS9jGeRc-0", tag: "Artist Story", title: "Video title 3", text: "A short line about what this video shows." },
  { id: "Zxq4gybBQys", tag: "Behind the Canvas", title: "Video title 4", text: "A short line about what this video shows." },
  { id: "Xle_9-NtCPY", tag: "Gallery Tour", title: "Video title 5", text: "A short line about what this video shows." },
  { id: "INecz1Zs4rA", tag: "Highlights", title: "Video title 6", text: "A short line about what this video shows." },
];

const LABEL = "Now Playing";
const CARD_BUTTON = "Watch on YouTube";
const EXPLORE_TEXT = "Explore More";
const EXPLORE_URL = "https://www.youtube.com/"; // ← put your YouTube channel link here (e.g. https://www.youtube.com/@yourchannel)

// ---- Colours (alternate per card, like the reference) ----
const ORANGE = "#F39314";
const BLUE = "#00679A";

const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
const thumbUrl = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const embedUrl = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}` +
  `&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1`;

const CSS = `
.vs-root { position: relative; padding: 8px 0 64px; color: #fff; font-family: Montserrat, system-ui, sans-serif; }
@media (min-width: 768px) { .vs-root { padding: 12px 0 80px; } }

/* heading */
.vs-head { text-align: center; padding: 0 20px; max-width: 760px; margin: 0 auto; }
.vs-eyebrow { display: inline-flex; align-items: center; gap: 12px; margin: 0;
  font-size: 12px; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: ${ORANGE}; }
.vs-eyebrow::before, .vs-eyebrow::after { content: ""; width: 28px; height: 2px; background: ${ORANGE}; }
.vs-title { margin: 14px 0 0; font-size: 32px; font-weight: 800; line-height: 1.12; color: #fff; }
@media (min-width: 768px) { .vs-title { font-size: 44px; } }
.vs-bar { display: block; width: 64px; height: 4px; margin: 16px auto 0; border-radius: 999px; background: #fff; }
.vs-sub { margin: 14px 0 0; font-size: 15px; line-height: 1.7; color: rgba(255,255,255,.78); }
@media (min-width: 768px) { .vs-sub { font-size: 17px; } }

/* grid */
.vs-grid { display: grid; gap: 24px; max-width: 1400px; margin: 40px auto 0; padding: 0 20px; }
@media (min-width: 680px) { .vs-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1100px) { .vs-grid { grid-template-columns: repeat(3, 1fr); gap: 28px; padding: 0 32px; } }

/* card */
/* smoked glass (no backdrop-filter → smooth scrolling over the fixed page background) */
.vs-card { display: flex; flex-direction: column; overflow: hidden; border-radius: 22px; color: #fff;
  background: linear-gradient(160deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,.05) 45%, rgba(255,255,255,.02) 100%), rgba(16,10,8,.55);
  border: 1px solid rgba(255,255,255,.18);
  box-shadow: 0 22px 50px -26px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.2);
  transition: transform .45s cubic-bezier(.22,1,.36,1), box-shadow .45s ease, border-color .45s ease; }
.vs-card:hover { transform: translateY(-6px); border-color: rgba(255,255,255,.38);
  box-shadow: 0 32px 64px -28px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.28); }

/* video area */
.vs-media { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #0b1520; margin: 10px 10px 0; border-radius: 16px; }
.vs-thumb, .vs-frame { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.vs-thumb { object-fit: cover; transform: scale(1.02); }
.vs-frame { pointer-events: none; transform: scale(1.18); opacity: 0; transition: opacity .8s ease; } /* scale hides YouTube's edges */
.vs-frame.is-on { opacity: 1; }
.vs-shade { position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to top, rgba(4,30,52,.92) 0%, rgba(4,30,52,.35) 45%, rgba(0,0,0,.05) 75%); }
.vs-icon { position: absolute; left: 18px; top: 18px; display: flex; align-items: center; justify-content: center;
  width: 52px; height: 52px; border-radius: 999px; color: #fff;
  background: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.4); }
.vs-live { position: absolute; right: 16px; top: 18px; display: inline-flex; align-items: center; gap: 7px;
  padding: 6px 11px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: .08em;
  background: rgba(0,0,0,.45); color: #fff; }
.vs-live i { width: 7px; height: 7px; border-radius: 999px; background: #ef4444; animation: vs-blink 1.4s ease-in-out infinite; }
@keyframes vs-blink { 50% { opacity: .25; } }
.vs-over { position: absolute; left: 18px; right: 18px; bottom: 16px; }
.vs-tag { display: inline-block; padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 700;
  letter-spacing: .04em; text-transform: uppercase; background: rgba(4,30,52,.75); color: #fff; }
.vs-card-title { margin: 10px 0 0; font-size: 22px; font-weight: 700; line-height: 1.2; color: #fff;
  text-shadow: 0 2px 10px rgba(0,0,0,.4); }
@media (min-width: 768px) { .vs-card-title { font-size: 25px; } }

/* body */
.vs-body { position: relative; flex: 1; display: flex; flex-direction: column; align-items: flex-start;
  padding: 22px 24px 24px; border-top: 1px solid rgba(255,255,255,.12); }
.vs-body::before { content: ""; position: absolute; left: 24px; top: -1px; width: 48px; height: 3px; border-radius: 0 0 3px 3px; background: var(--accent); }
.vs-label { margin: 0; font-size: 11px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); }
.vs-text { margin: 10px 0 0; font-size: 15px; line-height: 1.6; color: rgba(255,255,255,.8); }
.vs-btn { margin-top: auto; display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 999px;
  font-size: 14px; font-weight: 700; color: #fff; text-decoration: none;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.38);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.2);
  transition: background-color .25s ease, color .25s ease, gap .25s ease; }
.vs-body .vs-text + .vs-btn { margin-top: 20px; }
.vs-btn:hover { background: #fff; color: #111; gap: 12px; }
.vs-btn:focus-visible, .vs-more:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

/* explore more */
.vs-foot { display: flex; justify-content: center; margin-top: 40px; padding: 0 20px; }
.vs-more { display: inline-flex; align-items: center; gap: 10px; min-height: 52px; padding: 0 34px; border-radius: 999px;
  font-size: 14px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; text-decoration: none;
  color: #111; background: #fff; border: 2px solid #fff; transition: background-color .3s ease, color .3s ease; }
.vs-more:hover { background: transparent; color: #fff; }
.vs-more svg { transition: transform .3s ease; }
.vs-more:hover svg { transform: translate(3px, -3px); }

@media (prefers-reduced-motion: reduce) {
  .vs-card, .vs-frame { transition: none; }
  .vs-live i { animation: none; }
}
`;

/* ---------- icons ---------- */
function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
    </svg>
  );
}
function OutArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

/* ---------- one video card ---------- */
function VideoCard({ v, accent }) {
  const boxRef = useRef(null);
  const frameRef = useRef(null);
  const [load, setLoad] = useState(false);   // iframe created (only once it comes near the screen)
  const [shown, setShown] = useState(false); // iframe has loaded → fade it in

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLoad(true);
        // play while on screen, pause when scrolled away (saves CPU → smooth scrolling)
        const win = frameRef.current?.contentWindow;
        if (win) {
          win.postMessage(
            JSON.stringify({ event: "command", func: entry.isIntersecting ? "playVideo" : "pauseVideo", args: [] }),
            "*"
          );
        }
      },
      { rootMargin: "200px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article className="vs-card" style={{ "--accent": accent }}>
      <div ref={boxRef} className="vs-media">
        <img className="vs-thumb" src={thumbUrl(v.id)} alt="" loading="lazy" decoding="async" />
        {load && (
          <iframe
            ref={frameRef}
            className={`vs-frame ${shown ? "is-on" : ""}`}
            src={embedUrl(v.id)}
            title={v.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            loading="lazy"
            tabIndex={-1}
            onLoad={() => setTimeout(() => setShown(true), 600)} // short wait so the player's start screen never flashes
          />
        )}
        <div className="vs-shade" aria-hidden="true" />
        <span className="vs-icon" aria-hidden="true">
          <PlayIcon />
        </span>
        <span className="vs-live" aria-hidden="true">
          <i /> PLAYING
        </span>
        <div className="vs-over">
          <span className="vs-tag">{v.tag}</span>
          <h3 className="vs-card-title">{v.title}</h3>
        </div>
      </div>

      <div className="vs-body">
        <p className="vs-label">{LABEL}</p>
        <p className="vs-text">{v.text}</p>
        <a className="vs-btn" href={watchUrl(v.id)} target="_blank" rel="noopener noreferrer">
          {CARD_BUTTON} <OutArrow />
        </a>
      </div>
    </article>
  );
}

/* ---------- section ---------- */
export default function VideoShowcase() {
  return (
    <section className="vs-root" aria-labelledby="vs-heading">
      <style>{CSS}</style>

      <div className="vs-head">
        <p className="vs-eyebrow">{HEADING.eyebrow}</p>
        <h2 id="vs-heading" className="vs-title">{HEADING.title}</h2>
        <span className="vs-bar" aria-hidden="true" />
        <p className="vs-sub">{HEADING.subtitle}</p>
      </div>

      <div className="vs-grid">
        {VIDEOS.map((v, i) => (
          <VideoCard key={v.id} v={v} accent={i % 2 === 0 ? ORANGE : BLUE} />
        ))}
      </div>

      <div className="vs-foot">
        <a className="vs-more" href={EXPLORE_URL} target="_blank" rel="noopener noreferrer">
          {EXPLORE_TEXT} <OutArrow />
        </a>
      </div>
    </section>
  );
}