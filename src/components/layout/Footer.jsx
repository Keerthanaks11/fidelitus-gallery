import { useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";

import logoImg from "../../assets/Fidelitus_art_gallery_logo.png";
const logo = logoImg; // src/assets/Fidelitus_art_gallery_logo.png

/* =====================================================================
   FOOTER — Fidelitus Gallery
   Content taken from fidelitusgallery.com (menu, services, exclusive collection, about).
   - Smoked-glass panel over the fixed page background, white text
   - Columns: About + contact | Explore | Services | Exclusive Collection + Shilpa Foundation
   - Solid blue copyright bar at the very bottom
   - No backdrop-filter → scrolling stays smooth
   - Shows only ONCE per page, even if <Footer /> is added in two places
   ===================================================================== */

// ---- Edit here ----
const BLUE = "#00679A";
const ORANGE = "#F39314";
const SITE = "https://fidelitusgallery.com";

const BRAND = {
  name: "Fidelitus Gallery",
  since: "Since 2014",
  about:
    "A contemporary art gallery in the heart of Bangalore showcasing realistic, modern, contemporary and abstract works — with exhibitions, workshops and programmes that bring artists and art lovers together.",
};

// ⚠ Phone and email are from your previous footer — the gallery website does not list them.
const CONTACT = {
  address: "Brigade Software Park, No. 42, Ground Floor, B Block, 27th Cross, Banashankari 2nd Stage, Bangalore – 560070, Karnataka.",
  phone: "+91 9845062227",
  email: "info@fidelituscorp.com",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Fidelitus+Gallery+Brigade+Software+Park+Banashankari+2nd+Stage+Bangalore",
};

// Links point to the pages on fidelitusgallery.com.
// When these pages exist in this React site, swap `href: SITE + "/…"` for `to: "/your-route"`.
const EXPLORE = [
  { label: "Home", to: "/" },
  { label: "About Us", href: `${SITE}/about-us/` },
  { label: "Our Team", href: `${SITE}/team/` },
  { label: "Chief Artist", href: `${SITE}/artist/` },
  { label: "Collection", href: `${SITE}/paintings/` },
  { label: "Exhibition & Events", href: `${SITE}/exhibition/` },
  { label: "Media", href: `${SITE}/media/` },
  { label: "Visitors Archive", href: `${SITE}/visitors/` },
  { label: "G Studio", href: `${SITE}/g-studio/` },
];

const SERVICES = [
  { label: "Gallery for Rent", href: `${SITE}/gallery-for-rent/` },
  { label: "Rent on Art", href: `${SITE}/rent-an-art/` },
  { label: "Speed Painting", href: `${SITE}/speed-painting/` },
  { label: "Workshop", href: `${SITE}/workshop/` },
  { label: "Desktop Painting", href: `${SITE}/desktop-painting/` },
  { label: "Caricature", href: `${SITE}/caricature/` },
  { label: "Murals", href: `${SITE}/murals/` },
  { label: "Portraits", href: `${SITE}/portraits/` },
  { label: "Art Works", href: `${SITE}/art-works/` },
];

const EXCLUSIVE = [
  { label: "Canvas of Compassion", href: `${SITE}/canvas-of-compassion/` },
  { label: "Divine Masters", href: `${SITE}/divine-masters/` },
  { label: "Vishwaroopa", href: `${SITE}/vishwaroopa/` },
  { label: "Trimurthy", href: `${SITE}/trimurthy/` },
  { label: "Sun Chariot", href: `${SITE}/sun-chariot/` },
];

const GIVE_BACK = {
  title: "Art that gives back",
  text: "25% of every purchase supports Shilpa Foundation's work for the education of underprivileged children.",
};

const COPYRIGHT = `${new Date().getFullYear()} Fidelitus Gallery. All Rights Reserved.`;

const CSS = `
.ft-root { position: relative; color: #fff; font-family: Montserrat, system-ui, sans-serif; background: #0d0907; } /* solid base: looks right on light pages too */

/* smoked glass panel */
.ft-glass {
  background: linear-gradient(170deg, rgba(255,255,255,.12) 0%, rgba(255,255,255,.04) 40%, rgba(255,255,255,.02) 100%), rgba(10,6,5,.66);
  border-top: 1px solid rgba(255,255,255,.18);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.12);
}
.ft-grid { display: grid; gap: 30px; max-width: 1320px; margin: 0 auto; padding: 40px 24px 32px; }
@media (min-width: 700px) { .ft-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1150px) {
  .ft-grid { grid-template-columns: 1.45fr .9fr .95fr 1.2fr; gap: 0; padding: 42px 32px 34px; }
  .ft-col { padding: 0 28px; }
  .ft-col:first-child { padding-left: 0; }
  .ft-col:last-child { padding-right: 0; }
  .ft-col + .ft-col { border-left: 1px solid rgba(255,255,255,.14); }
}

/* brand */
.ft-logo-chip { display: inline-flex; align-items: center; padding: 6px 12px; border-radius: 10px; background: #fff;
  box-shadow: 0 6px 18px rgba(0,0,0,.25); }
.ft-logo { display: block; height: 38px; width: auto; }
.ft-wordmark { display: inline-flex; flex-direction: column; text-decoration: none; color: #fff; }
.ft-wordmark strong { font-size: 28px; font-weight: 800; letter-spacing: -.01em; line-height: 1.05; }
.ft-wordmark strong b { color: ${ORANGE}; }
.ft-wordmark small { margin-top: 6px; font-size: 11px; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: rgba(255,255,255,.6); }
.ft-about { margin: 14px 0 0; font-size: 13px; line-height: 1.65; color: rgba(255,255,255,.72); max-width: 30rem; }
.ft-contact { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 9px; }
.ft-contact li { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; line-height: 1.6; color: rgba(255,255,255,.75); }
.ft-ico { flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; margin-top: 0;
  border-radius: 999px; border: 1px solid rgba(255,255,255,.28); color: #fff; }
.ft-contact a { color: inherit; text-decoration: none; transition: color .25s ease; }
.ft-contact a:hover { color: #fff; }

/* columns */
.ft-head { margin: 0; font-size: 12.5px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #fff; }
.ft-head::after { content: ""; display: block; width: 28px; height: 3px; margin-top: 10px; border-radius: 999px; background: ${ORANGE}; }
.ft-links { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 8px; }
.ft-links a { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,.72); text-decoration: none;
  transition: color .25s ease, transform .25s ease; }
.ft-links a::before { content: ""; width: 5px; height: 5px; border-radius: 999px; background: rgba(255,255,255,.35); transition: background-color .25s ease; }
.ft-links a:hover { color: #fff; transform: translateX(4px); }
.ft-links a:hover::before { background: ${ORANGE}; }

/* give-back card */
.ft-give { margin-top: 18px; padding: 13px 14px 12px; border-radius: 12px;
  background: linear-gradient(150deg, rgba(243,147,20,.18), rgba(243,147,20,.04)); border: 1px solid rgba(243,147,20,.35); }
.ft-give h4 { margin: 0; font-size: 13.5px; font-weight: 700; color: #fff; }
.ft-give p { margin: 6px 0 0; font-size: 12.5px; line-height: 1.55; color: rgba(255,255,255,.78); }

.ft-root a:focus-visible { outline: 2px solid #fff; outline-offset: 3px; border-radius: 3px; }

/* bottom blue bar */
.ft-bar { background: ${BLUE}; color: #fff; }
.ft-bar-in { max-width: 1320px; margin: 0 auto; padding: 10px 24px; display: flex; flex-wrap: wrap; gap: 6px 18px;
  align-items: center; justify-content: center; text-align: center; font-size: 12.5px; }
.ft-bar a { color: #fff; text-decoration: none; opacity: .9; }
.ft-bar a:hover { opacity: 1; text-decoration: underline; }
`;

/* ---------- icons ---------- */
const Pin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
const Phone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
  </svg>
);
const Mail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
  </svg>
);

// "/route" → page in this app; http(s) → normal link (same tab for the gallery site, new tab for other sites)
function SmartLink({ item, children }) {
  if (item.to) return <Link to={item.to}>{children}</Link>;
  const otherSite = item.href?.startsWith("http") && !item.href.startsWith(SITE);
  return (
    <a href={item.href || "#"} {...(otherSite ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

function LinkColumn({ title, items, children }) {
  return (
    <nav className="ft-col" aria-label={title}>
      <h3 className="ft-head">{title}</h3>
      <ul className="ft-links">
        {items.map((l) => (
          <li key={l.label}><SmartLink item={l}>{l.label}</SmartLink></li>
        ))}
      </ul>
      {children}
    </nav>
  );
}

// only one footer may be on screen at a time
let activeFooter = null;

export default function Footer() {
  const [me] = useState(() => Symbol("footer"));
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    if (activeFooter === null) {
      activeFooter = me;
      setShow(true);
    }
    return () => {
      if (activeFooter === me) activeFooter = null;
    };
  }, [me]);

  if (!show) return null;

  return (
    <footer className="ft-root">
      <style>{CSS}</style>

      <div className="ft-glass">
        <div className="ft-grid">
          {/* About + contact */}
          <div className="ft-col">
            <Link to="/" aria-label={`${BRAND.name} home`} className="ft-wordmark">
              {logo ? (
                <span className="ft-logo-chip">
                  <img className="ft-logo" src={logo} alt={BRAND.name} loading="lazy" decoding="async" />
                </span>
              ) : (
                <>
                  <strong>Fidel<b>i</b>tus Gallery</strong>
                  <small>{BRAND.since}</small>
                </>
              )}
            </Link>
            <p className="ft-about">{BRAND.about}</p>
            <ul className="ft-contact">
              <li>
                <span className="ft-ico"><Pin /></span>
                <a href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer">{CONTACT.address}</a>
              </li>
              <li>
                <span className="ft-ico"><Phone /></span>
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a>
              </li>
              <li>
                <span className="ft-ico"><Mail /></span>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
            </ul>
          </div>

          <LinkColumn title="Explore" items={EXPLORE} />
          <LinkColumn title="Services" items={SERVICES} />
          <LinkColumn title="Exclusive Collection" items={EXCLUSIVE}>
            <div className="ft-give">
              <h4>{GIVE_BACK.title}</h4>
              <p>{GIVE_BACK.text}</p>
            </div>
          </LinkColumn>
        </div>
      </div>

      {/* Blue bottom bar */}
      <div className="ft-bar">
        <div className="ft-bar-in">
          <span>© {COPYRIGHT}</span>
        </div>
      </div>
    </footer>
  );
}