import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Navbar.jsx";
import SumiHeader from "../sumi/SumiHeader.jsx";
import SumiFooter from "../sumi/SumiFooter.jsx";
import Footer from "./Footer.jsx";
import SmoothScroll from "../fx/SmoothScroll.jsx";
import Preloader from "../fx/Preloader.jsx";
import Cursor from "../fx/Cursor.jsx";
import AutoReveal from "../fx/AutoReveal.jsx";

/* =====================================================================
   LAYOUT — wraps every public page
   - Navbar + page + Footer
   - SUMI-style extras: smooth scrolling, opening loader, custom cursor,
     headings that reveal on scroll, and a "curtain" transition between
     pages (the old page is covered, the new page is uncovered)
   ===================================================================== */

const ease = [0.76, 0, 0.24, 1];

// the two curtains: one closes over the old page, the other opens on the new page
const coverIn = {
  initial: { scaleY: 0 },
  enter: { scaleY: 0 },
  exit: { scaleY: 1, transition: { duration: 0.6, ease } },
};
const coverOut = {
  initial: { scaleY: 1 },
  enter: { scaleY: 0, transition: { duration: 0.8, ease, delay: 0.1 } },
  exit: { scaleY: 0 },
};
const page = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.5, delay: 0.25 } },
  exit: { opacity: 1, transition: { duration: 0.6 } },
};
const curtainStyle = {
  position: "fixed", inset: 0, zIndex: 900, background: "#0d0907", pointerEvents: "none",
};

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="flex min-h-screen flex-col">
      <SmoothScroll />
      <Preloader />
      <Cursor />
      {/* home page: SUMI-style minimal header · other pages: the blue navbar */}
      {location.pathname === "/" ? <SumiHeader /> : <Navbar />}

      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
          <motion.div key={location.pathname} variants={page} initial="initial" animate="enter" exit="exit">
            {outlet}
            <AutoReveal watchKey={location.pathname} />
            <motion.div aria-hidden variants={coverIn} style={{ ...curtainStyle, transformOrigin: "bottom" }} />
            <motion.div aria-hidden variants={coverOut} style={{ ...curtainStyle, transformOrigin: "top" }} />
          </motion.div>
        </AnimatePresence>
      </main>

      {location.pathname === "/" ? <SumiFooter /> : <Footer />}
    </div>
  );
}
