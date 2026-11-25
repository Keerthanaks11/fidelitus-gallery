import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import Home from "../pages/Home.jsx";
import Gallery from "../pages/Gallery.jsx";
import ArtworkDetail from "../pages/ArtworkDetail.jsx";
import Artists from "../pages/Artists.jsx";
import ArtistDetail from "../pages/ArtistDetail.jsx";
import Exhibitions from "../pages/Exhibitions.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/Contact.jsx";
import NotFound from "../pages/NotFound.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:slug" element={<ArtworkDetail />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:slug" element={<ArtistDetail />} />
        <Route path="/exhibitions" element={<Exhibitions />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
