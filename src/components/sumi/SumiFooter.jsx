import { Link } from "react-router-dom";
import logo from "../../assets/Fidelitus_art_gallery_logo.png";
import { MENU } from "../layout/Navbar.jsx";
import { SU } from "./common.jsx";

/* SUMI-style footer for the home page: quiet, charcoal, thin lines */
const CSS = `
.sf { background: #141312; color: ${SU.ink}; font-family: Roboto, system-ui, sans-serif; font-weight: 300; border-top: 1px solid ${SU.line}; }
.sf-in { max-width: 1440px; margin: 0 auto; padding: 88px 24px 32px; }
@media (min-width: 900px) { .sf-in { padding: 110px 56px 36px; } }
.sf-top { display: grid; gap: 48px; }
@media (min-width: 900px) { .sf-top { grid-template-columns: 1.3fr 1fr 1fr 1fr; } }
.sf-logo img { height: 40px; width: auto; filter: brightness(0) invert(1); opacity: .95; }
.sf-brand p { margin: 22px 0 0; max-width: 22rem; font-size: 13px; line-height: 1.9; color: ${SU.mute}; }
.sf h4 { margin: 0 0 18px; font-weight: 400; font-size: 11px; letter-spacing: .3em; text-transform: uppercase; color: ${SU.ink}; }
.sf ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.sf a { color: ${SU.mute}; text-decoration: none; font-size: 13px; transition: color .3s ease; }
.sf a:hover { color: ${SU.ink}; }
.sf address { font-style: normal; font-size: 13px; line-height: 1.9; color: ${SU.mute}; }
.sf-big { margin: 96px 0 0; font-weight: 200; font-size: clamp(40px, 9.4vw, 150px); letter-spacing: .18em; line-height: 1;
  color: rgba(233,230,225,.08); white-space: nowrap; overflow: hidden; user-select: none; }
.sf-bottom { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; margin-top: 28px; padding-top: 24px;
  border-top: 1px solid ${SU.line}; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: ${SU.mute}; }
.sf-top-btn { background: none; border: 0; color: ${SU.mute}; cursor: pointer; font: inherit; letter-spacing: inherit; text-transform: inherit; }
.sf-top-btn:hover { color: ${SU.ink}; }
.sf a:focus-visible, .sf button:focus-visible { outline: 1px solid ${SU.ink}; outline-offset: 4px; }
`;

const Item = ({ item }) =>
  item.to ? <Link to={item.to}>{item.label}</Link> : <a href={item.href}>{item.label}</a>;

export default function SumiFooter() {
  const services = MENU.find((m) => m.label === "Services")?.children || [];
  const explore = MENU.filter((m) => m.to || m.href);
  return (
    <footer className="sf">
      <style>{CSS}</style>
      <div className="sf-in">
        <div className="sf-top">
          <div className="sf-brand">
            <Link to="/" className="sf-logo" aria-label="Fidelitus Gallery — home"><img src={logo} alt="Fidelitus Art Gallery" /></Link>
            <p>A contemporary art gallery in Bengaluru since 2014. 25% of every purchase supports Shilpa Foundation.</p>
          </div>
          <nav aria-label="Explore">
            <h4>Explore</h4>
            <ul>{explore.map((m) => <li key={m.label}><Item item={m} /></li>)}</ul>
          </nav>
          <nav aria-label="Services">
            <h4>Services</h4>
            <ul>{services.map((m) => <li key={m.label}><Item item={m} /></li>)}</ul>
          </nav>
          <div>
            <h4>Visit</h4>
            <address>
              Brigade Software Park, No. 42,<br />B Block, 27th Cross,<br />Banashankari 2nd Stage,<br />Bangalore – 560070
            </address>
            <ul style={{ marginTop: 18 }}>
              <li><a href="tel:+919845062227">+91 9845062227</a></li>
              <li><a href="mailto:info@fidelituscorp.com">info@fidelituscorp.com</a></li>
            </ul>
          </div>
        </div>

        <p className="sf-big" aria-hidden="true">FIDELITUS</p>

        <div className="sf-bottom">
          <span>© {new Date().getFullYear()} Fidelitus Gallery</span>
          <button type="button" className="sf-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
