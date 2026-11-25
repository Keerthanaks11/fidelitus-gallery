import { SumiStyles } from "../components/sumi/common.jsx";
import SumiHero from "../components/sumi/SumiHero.jsx";
import Concept from "../components/sumi/Concept.jsx";
import CollectionSlider from "../components/sumi/CollectionSlider.jsx";
import ServiceList from "../components/sumi/ServiceList.jsx";
import Films from "../components/sumi/Films.jsx";
import GiveBack from "../components/sumi/GiveBack.jsx";

/* =====================================================================
   HOME — SUMI-style (sumi.fillinglife.co): charcoal, quiet, lots of space.
   00 Hero · 01 Concept · 02 Collection · 03 Services · 04 Films · 05 Story · 06 Visit
   The header for this page is SumiHeader (chosen in Layout.jsx); the footer comes from Layout.

   The previous home sections still exist in src/components/home/ (Hero, ShowcaseRows, Artworks,
   ExclusiveCollection, Services, VideoShowcase, PageBackground) — import them here to bring any back.
   ===================================================================== */
export default function Home() {
  return (
    <div className="su" data-no-reveal>
      <SumiStyles />
      <SumiHero />
      <Concept />
      <CollectionSlider />
      <ServiceList />
      <Films />
      <GiveBack />
    </div>
  );
}
