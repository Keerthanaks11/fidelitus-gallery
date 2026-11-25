import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/Fidelitus_art_gallery_logo.png";
import { MENU } from "../layout/Navbar.jsx";
import { SU, ease } from "./common.jsx";

/* =====================================================================
   SUMI-style header for the home page
   - transparent, thin, white logo; hides when scrolling down, returns on scroll up
   - small section links + a "Menu" button that opens a full-screen menu
   ===================================================================== */

const SECTIONS = [
  { label: "Concept", href: "#concept" },
  { label: "Collection", href: "#collection" },
  { label: "Services", href: "#services" },
  { label: "Films", href: "#films" },
];

const CSS = `
.sh { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; color: ${SU.ink}; font-family: Roboto, system-ui, sans-serif;
  transition: transform .6s cubic-bezier(.22,1,.36,1), background-color .6s ease; }
.sh.is-hidden { transform: translateY(-100%); }
.sh.is-solid { background: rgba(26,25,24,.82); }
.sh-in { height: 84px; display: flex; align-items: center; gap: 32px; padding: 0 24px; }
@media (min-width: 900px) { .sh-in { padding: 0 56px; } }
.sh-logo img { display: block; height: 34px; width: auto; filter: brightness(0) invert(1); opacity: .95; }
.sh-tag { font-size: 11px; letter-spacing: .3em; text-transform: uppercase; color: ${SU.mute}; }
.sh-nav { display: flex; gap: 30px; margin-left: auto; }
.sh-nav a { font-size: 12px; letter-spacing: .24em; text-transform: uppercase; text-decoration: none; color: ${SU.ink};
  opacity: .8; transition: opacity .3s ease; }
.sh-nav a:hover { opacity: 1; }
.sh-menu { display: inline-flex; align-items: center; gap: 12px; background: none; border: 0; color: ${SU.ink}; cursor: pointer;
  font: 400 12px Roboto, system-ui, sans-serif; letter-spacing: .24em; text-transform: uppercase; padding: 8px 0; }
.sh-menu span { position: relative; width: 26px; height: 8px; }
.sh-menu span::before, .sh-menu span::after { content: ""; position: absolute; left: 0; right: 0; height: 1px; background: currentColor;
  transition: transform .4s ease, top .4s ease; }
.sh-menu span::before { top: 0; } .sh-menu span::after { top: 7px; }
.sh-menu.is-open span::before { top: 4px; transform: rotate(20deg); }
.sh-menu.is-open span::after { top: 4px; transform: rotate(-20deg); }
@media (max-width: 899px) { .sh-tag, .sh-nav { display: none; } .sh-menu { margin-left: auto; } }
.sh a:focus-visible, .sh button:focus-visible { outline: 1px solid ${SU.ink}; outline-offset: 4px; }

/* full-screen menu */
.sm { position: fixed; inset: 0; z-index: 990; background: ${SU.bg}; color: ${SU.ink}; overflow-y: auto;
  font-family: Roboto, system-ui, sans-serif; font-weight: 300; }
.sm-in { min-height: 100%; display: grid; gap: 48px; padding: 120px 24px 48px; }
@media (min-width: 900px) { .sm-in { grid-template-columns: 1.4fr 1fr; padding: 140px 56px 56px; } }
.sm-list { list-style: none; margin: 0; padding: 0; }
.sm-list > li { border-top: 1px solid ${SU.line}; }
.sm-list > li > a, .sm-list > li > span { display: flex; align-items: baseline; gap: 22px; padding: 14px 0;
  font-size: clamp(26px, 3.4vw, 46px); text-decoration: none; transition: color .3s ease, padding-left .4s ease; }
.sm-list > li > a:hover { color: #fff; padding-left: 12px; }
.sm-list small { font-size: 11px; letter-spacing: .2em; color: ${SU.ember}; }
.sm-sub { display: flex; flex-wrap: wrap; gap: 6px 18px; padding: 0 0 16px 44px; }
.sm-sub a { font-size: 13px; color: ${SU.mute}; text-decoration: none; }
.sm-sub a:hover { color: ${SU.ink}; }
.sm-side { align-self: end; font-size: 14px; line-height: 1.9; color: ${SU.mute}; }
.sm-side h4 { margin: 0 0 10px; font-weight: 400; font-size: 11px; letter-spacing: .3em; text-transform: uppercase; color: ${SU.ink}; }
.sm-side a { text-decoration: none; }
.sm-side a:hover { color: ${SU.ink}; }
`;

const MenuLink = ({ item, onClick, children }) =>
  item.to ? <Link to={item.to} onClick={onClick}>{children}</Link> : <a href={item.href} onClick={onClick}>{children}</a>;

export default function SumiHeader() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  // hide on scroll down, show on scroll up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > window.innerHeight * 0.6);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 200);
        last = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock page scroll + Esc while the menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <style>{CSS}</style>
      <header className={`sh ${hidden && !open ? "is-hidden" : ""} ${solid && !open ? "is-solid" : ""}`}>
        <div className="sh-in">
          <Link to="/" className="sh-logo" aria-label="Fidelitus Gallery — home">
            <img src={logo} alt="Fidelitus Art Gallery" />
          </Link>
          <span className="sh-tag">Hand-painted Indian art · Since 2014</span>
          <nav className="sh-nav" aria-label="Sections">
            {SECTIONS.map((s) => (
              <a key={s.href} href={s.href}>{s.label}</a>
            ))}
          </nav>
          <button type="button" className={`sh-menu ${open ? "is-open" : ""}`} aria-expanded={open} aria-controls="sumi-menu"
            onClick={() => setOpen((v) => !v)}>
            {open ? "Close" : "Menu"} <span aria-hidden="true" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="sumi-menu"
            className="sm"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="sm-in">
              <ul className="sm-list">
                {MENU.map((item, i) => (
                  <motion.li key={item.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease, delay: 0.3 + i * 0.05 }}>
                    {item.to || item.href ? (
                      <MenuLink item={item} onClick={() => setOpen(false)}>
                        <small>{String(i + 1).padStart(2, "0")}</small>
                        {item.label}
                      </MenuLink>
                    ) : (
                      <span><small>{String(i + 1).padStart(2, "0")}</small>{item.label}</span>
                    )}
                    {item.children && (
                      <div className="sm-sub">
                        {item.children.map((c) => (
                          <MenuLink key={c.label} item={c} onClick={() => setOpen(false)}>{c.label}</MenuLink>
                        ))}
                      </div>
                    )}
                  </motion.li>
                ))}
              </ul>
              <motion.div className="sm-side" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}>
                <h4>Visit</h4>
                Brigade Software Park, No. 42, B Block,<br />27th Cross, Banashankari 2nd Stage,<br />Bangalore – 560070
                <br /><br />
                <h4>Contact</h4>
                <a href="tel:+919845062227">+91 9845062227</a><br />
                <a href="mailto:info@fidelituscorp.com">info@fidelituscorp.com</a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
