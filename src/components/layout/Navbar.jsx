import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logoImg from "../../assets/Fidelitus_art_gallery_logo.png";

/* =====================================================================
   NAVBAR — Fidelitus Gallery
   - Solid blue bar, logo on a white rounded card
   - Menu from fidelitusgallery.com with dropdowns (hover or click)
   - Orange underline on the current page
   - Cart (with count badge) + search
   - Phones: menu button → full menu with open/close sections
   - Sticks to the top; gets a shadow once you scroll
   ===================================================================== */

// ---- Edit here ----
const BLUE = "#00679A";
const BLUE_DARK = "#00537d";
const ORANGE = "#F39314";
const SITE = "https://fidelitusgallery.com";
const LOGO = logoImg; // src/assets/Fidelitus_art_gallery_logo.png

const CART_COUNT = 0; // replace with your real cart count later
const CART_URL = `${SITE}/cart/`;
const SEARCH_URL = (q) => `${SITE}/?s=${encodeURIComponent(q)}`; // where the search box sends people

// "to" = page inside this React site, "href" = page on fidelitusgallery.com
export const MENU = [
  {
    label: "Home",
    to: "/",
    children: [
      { label: "About Us", href: `${SITE}/about-us/` },
      { label: "Our Team", href: `${SITE}/team/` },
      { label: "Chief Artist", href: `${SITE}/artist/` },
    ],
  },
  { label: "Collection", href: `${SITE}/paintings/` },
  {
    label: "Exclusive Collection",
    children: [
      { label: "Canvas of Compassion", href: `${SITE}/canvas-of-compassion/` },
      { label: "Divine Masters", href: `${SITE}/divine-masters/` },
      { label: "Vishwaroopa", href: `${SITE}/vishwaroopa/` },
      { label: "Trimurthy", href: `${SITE}/trimurthy/` },
      { label: "Sun Chariot", href: `${SITE}/sun-chariot/` },
    ],
  },
  {
    label: "Services",
    children: [
      { label: "Gallery for Rent", href: `${SITE}/gallery-for-rent/` },
      { label: "Rent on Art", href: `${SITE}/rent-an-art/` },
      { label: "Speed Painting", href: `${SITE}/speed-painting/` },
      { label: "Workshop", href: `${SITE}/workshop/` },
      { label: "Desktop Painting", href: `${SITE}/desktop-painting/` },
      { label: "Caricature", href: `${SITE}/caricature/` },
      { label: "Murals", href: `${SITE}/murals/` },
      { label: "Portraits", href: `${SITE}/portraits/` },
      { label: "Art Works", href: `${SITE}/art-works/` },
    ],
  },
  { label: "Exhibition & Events", href: `${SITE}/exhibition/` },
  { label: "Media", href: `${SITE}/media/` },
  { label: "Visitors Archive", href: `${SITE}/visitors/` },
  { label: "G Studio", href: `${SITE}/g-studio/` },
];

const CSS = `
.nb { position: sticky; top: 0; z-index: 1000; background: ${BLUE}; color: #fff;
  font-family: Montserrat, system-ui, sans-serif; transition: box-shadow .3s ease; }
.nb.is-scrolled { box-shadow: 0 10px 30px -12px rgba(0,0,0,.55); }
.nb-in { max-width: 1500px; margin: 0 auto; height: 78px; padding: 0 24px; display: flex; align-items: center; gap: 24px; }

/* logo */
.nb-logo { flex-shrink: 0; display: flex; align-items: center; height: 66px; padding: 6px 18px; border-radius: 14px;
  background: #fff; box-shadow: 0 6px 18px -8px rgba(0,0,0,.45); }
.nb-logo img { display: block; height: 52px; width: auto; }

/* desktop menu */
.nb-menu { display: flex; align-items: center; gap: 2px; margin: 0 0 0 auto; padding: 0; list-style: none; }
.nb-item { position: relative; }
.nb-link { position: relative; display: inline-flex; align-items: center; gap: 6px; height: 78px; padding: 0 13px;
  font-size: 15.5px; font-weight: 600; color: #fff; text-decoration: none; background: none; border: 0; cursor: pointer;
  font-family: inherit; white-space: nowrap; }
.nb-link::after { content: ""; position: absolute; left: 13px; right: 13px; bottom: 18px; height: 3px; border-radius: 999px;
  background: ${ORANGE}; transform: scaleX(0); transform-origin: left; transition: transform .3s ease; }
.nb-link:hover::after, .nb-link.is-active::after { transform: scaleX(1); }
.nb-chev { transition: transform .25s ease; }
.nb-item.is-open .nb-chev { transform: rotate(180deg); }

/* dropdown */
.nb-drop { position: absolute; top: calc(100% - 8px); left: 0; min-width: 230px; padding: 8px; margin: 0; list-style: none;
  background: #fff; border-radius: 12px; box-shadow: 0 24px 50px -20px rgba(0,0,0,.45);
  opacity: 0; visibility: hidden; transform: translateY(8px); transition: opacity .2s ease, transform .2s ease, visibility .2s; }
.nb-item.is-open .nb-drop { opacity: 1; visibility: visible; transform: none; }
.nb-drop a { display: block; padding: 10px 14px; border-radius: 8px; font-size: 14.5px; font-weight: 500; color: #1f2937;
  text-decoration: none; border-left: 3px solid transparent; transition: background-color .2s ease, color .2s ease, border-color .2s ease; }
.nb-drop a:hover, .nb-drop a:focus-visible { background: #f1f7fb; color: ${BLUE}; border-left-color: ${ORANGE}; outline: none; }

/* icons on the right */
.nb-tools { display: flex; align-items: center; gap: 6px; margin-left: 8px; }
.nb-icon { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 42px;
  border-radius: 999px; color: #fff; background: none; border: 0; cursor: pointer; text-decoration: none;
  transition: background-color .2s ease; }
.nb-icon:hover { background: rgba(255,255,255,.14); }
.nb-badge { position: absolute; top: 4px; right: 0; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 4px;
  font-size: 11px; font-weight: 700; line-height: 18px; text-align: center; background: #17a2e8; color: #fff; }

.nb a:focus-visible, .nb button:focus-visible { outline: 2px solid #fff; outline-offset: 2px; border-radius: 6px; }

/* search bar (drops down under the navbar) */
.nb-search { background: ${BLUE_DARK}; overflow: hidden; max-height: 0; transition: max-height .3s ease; }
.nb-search.is-open { max-height: 90px; }
.nb-search form { max-width: 900px; margin: 0 auto; padding: 14px 24px; display: flex; gap: 10px; }
.nb-search input { flex: 1; height: 46px; padding: 0 18px; border-radius: 999px; border: 0; font-size: 15px; font-family: inherit; color: #111; }
.nb-search input:focus { outline: 3px solid ${ORANGE}; }
.nb-search button { height: 46px; padding: 0 22px; border-radius: 999px; border: 0; background: ${ORANGE}; color: #fff;
  font-weight: 700; font-family: inherit; cursor: pointer; }

/* phones / tablets */
.nb-burger { display: none; }
.nb-mobile { display: none; }
@media (max-width: 1180px) {
  .nb-menu { display: none; }
  .nb-tools { margin-left: auto; }
  .nb-burger { display: inline-flex; }
  .nb-in { height: 70px; padding: 0 16px; }
  .nb-logo { height: 56px; padding: 5px 12px; }
  .nb-logo img { height: 44px; }
  .nb-mobile { display: block; max-height: 0; overflow: hidden; background: ${BLUE_DARK}; transition: max-height .35s ease; }
  .nb-mobile.is-open { max-height: calc(100vh - 70px); overflow-y: auto; }
  .nb-mlist { list-style: none; margin: 0; padding: 8px 16px 18px; }
  .nb-mrow { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,.12); }
  .nb-mrow a, .nb-mrow button.nb-mlabel { flex: 1; padding: 14px 4px; font-size: 16px; font-weight: 600; color: #fff;
    text-decoration: none; background: none; border: 0; text-align: left; font-family: inherit; cursor: pointer; }
  .nb-mrow a.is-active { color: ${ORANGE}; }
  .nb-mtoggle { width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center;
    background: none; border: 0; color: #fff; cursor: pointer; }
  .nb-msub { list-style: none; margin: 0; padding: 0 0 8px 14px; max-height: 0; overflow: hidden; transition: max-height .3s ease; }
  .nb-msub.is-open { max-height: 600px; }
  .nb-msub a { display: block; padding: 10px 4px; font-size: 15px; color: rgba(255,255,255,.82); text-decoration: none; }
  .nb-msub a:hover { color: #fff; }
}
@media (max-width: 420px) { .nb-logo img { height: 38px; } }
`;

/* ---------- icons ---------- */
const Chevron = () => (
  <svg className="nb-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const BagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
const SearchIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
  </svg>
);
const Burger = ({ open }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
  </svg>
);

// "/route" → page in this app (NavLink gets the orange underline when active); http → normal link
function MenuLink({ item, className, onClick, children }) {
  if (item.to) {
    return (
      <NavLink to={item.to} end className={({ isActive }) => `${className || ""} ${isActive ? "is-active" : ""}`} onClick={onClick}>
        {children}
      </NavLink>
    );
  }
  return (
    <a href={item.href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(null);         // which desktop dropdown is open
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const navRef = useRef(null);
  const searchRef = useRef(null);
  const closeTimer = useRef(null);
  const location = useLocation();

  // shadow once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close everything when the page changes
  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // click outside / Escape closes menus
  useEffect(() => {
    const onDown = (e) => navRef.current && !navRef.current.contains(e.target) && setOpen(null);
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(null);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 150);
  }, [searchOpen]);

  // hover opens instantly, leaving waits a moment (so the mouse can reach the dropdown)
  const enter = (i) => {
    clearTimeout(closeTimer.current);
    setOpen(i);
  };
  const leave = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (q.trim()) window.location.href = SEARCH_URL(q.trim());
  };

  return (
    <header ref={navRef} className={`nb ${scrolled ? "is-scrolled" : ""}`}>
      <style>{CSS}</style>

      <div className="nb-in">
        <Link to="/" className="nb-logo" aria-label="Fidelitus Art Gallery — home">
          <img src={LOGO} alt="Fidelitus Art Gallery" />
        </Link>

        {/* desktop menu */}
        <nav aria-label="Main">
          <ul className="nb-menu">
            {MENU.map((item, i) => (
              <li
                key={item.label}
                className={`nb-item ${open === i ? "is-open" : ""}`}
                onMouseEnter={() => item.children && enter(i)}
                onMouseLeave={() => item.children && leave()}
              >
                {item.children && !item.to && !item.href ? (
                  <button
                    type="button"
                    className="nb-link"
                    aria-expanded={open === i}
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    {item.label} <Chevron />
                  </button>
                ) : (
                  <MenuLink item={item} className="nb-link">
                    {item.label}
                    {item.children && (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Open ${item.label} menu`}
                        aria-expanded={open === i}
                        onClick={(e) => {
                          e.preventDefault();
                          setOpen(open === i ? null : i);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setOpen(open === i ? null : i);
                          }
                        }}
                        style={{ display: "inline-flex" }}
                      >
                        <Chevron />
                      </span>
                    )}
                  </MenuLink>
                )}

                {item.children && (
                  <ul className="nb-drop">
                    {item.children.map((c) => (
                      <li key={c.label}>
                        <MenuLink item={c}>{c.label}</MenuLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* cart + search + phone menu button */}
        <div className="nb-tools">
          <a className="nb-icon" href={CART_URL} aria-label={`Cart, ${CART_COUNT} items`}>
            <BagIcon />
            <span className="nb-badge">{CART_COUNT}</span>
          </a>
          <button
            type="button"
            className="nb-icon"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className="nb-icon nb-burger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Burger open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* search bar */}
      <div className={`nb-search ${searchOpen ? "is-open" : ""}`}>
        <form onSubmit={submitSearch} role="search">
          <input
            ref={searchRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search paintings, artists, services…"
            aria-label="Search"
            tabIndex={searchOpen ? 0 : -1}
          />
          <button type="submit" tabIndex={searchOpen ? 0 : -1}>Search</button>
        </form>
      </div>

      {/* phone / tablet menu */}
      <div className={`nb-mobile ${mobileOpen ? "is-open" : ""}`}>
        <ul className="nb-mlist">
          {MENU.map((item, i) => (
            <li key={item.label}>
              <div className="nb-mrow">
                {item.to || item.href ? (
                  <MenuLink item={item}>{item.label}</MenuLink>
                ) : (
                  <button type="button" className="nb-mlabel" onClick={() => setMobileSub(mobileSub === i ? null : i)}>
                    {item.label}
                  </button>
                )}
                {item.children && (
                  <button
                    type="button"
                    className="nb-mtoggle"
                    aria-label={`${mobileSub === i ? "Close" : "Open"} ${item.label}`}
                    aria-expanded={mobileSub === i}
                    onClick={() => setMobileSub(mobileSub === i ? null : i)}
                    style={{ transform: mobileSub === i ? "rotate(180deg)" : "none", transition: "transform .25s ease" }}
                  >
                    <Chevron />
                  </button>
                )}
              </div>
              {item.children && (
                <ul className={`nb-msub ${mobileSub === i ? "is-open" : ""}`}>
                  {item.children.map((c) => (
                    <li key={c.label}>
                      <MenuLink item={c}>{c.label}</MenuLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}