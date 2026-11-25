import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { getArtwork } from "../services/artworkService.js";
import useFetch from "../hooks/useFetch.js";
import Loader from "../components/ui/Loader.jsx";
import Lightbox from "../components/gallery/Lightbox.jsx";
import { formatPrice, imgUrl } from "../utils/formatters.js";

export default function ArtworkDetail() {
  const { slug } = useParams();
  const { data: a, loading, error } = useFetch(() => getArtwork(slug), [slug]);
  const [zoom, setZoom] = useState(null);
  if (loading) return <Loader />;
  if (error || !a) return <p className="py-20 text-center">Artwork not found.</p>;
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
      <img src={imgUrl(a.images?.[0])} alt={a.title} className="w-full cursor-zoom-in" onClick={() => setZoom(imgUrl(a.images?.[0]))} />
      <div>
        <h1 className="font-serif text-4xl">{a.title}</h1>
        <Link to={`/artists/${a.artist?.slug}`} className="text-brand-light underline">{a.artist?.name}</Link>
        <p className="mt-4 text-sm">{[a.medium, a.dimensions, a.year].filter(Boolean).join(" · ")}</p>
        <p className="mt-4 text-xl">{a.status === "sold" ? "Sold" : formatPrice(a.price)}</p>
        <p className="mt-6 text-brand-light">{a.description}</p>
        <Link to="/contact" className="mt-8 inline-block rounded bg-brand px-6 py-2 text-white">Enquire</Link>
      </div>
      <Lightbox src={zoom} onClose={() => setZoom(null)} />
    </div>
  );
}
