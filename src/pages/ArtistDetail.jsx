import { useParams } from "react-router-dom";
import { getArtist } from "../services/artistService.js";
import { getArtworks } from "../services/artworkService.js";
import useFetch from "../hooks/useFetch.js";
import MasonryGrid from "../components/gallery/MasonryGrid.jsx";
import Loader from "../components/ui/Loader.jsx";

export default function ArtistDetail() {
  const { slug } = useParams();
  const { data: artist, loading } = useFetch(() => getArtist(slug), [slug]);
  const { data: works } = useFetch(() => (artist ? getArtworks({ artist: artist._id, limit: 50 }) : Promise.resolve(null)), [artist]);
  if (loading) return <Loader />;
  if (!artist) return <p className="py-20 text-center">Artist not found.</p>;
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-serif text-4xl">{artist.name}</h1>
      <p className="mt-2 text-brand-light">{artist.country}</p>
      <p className="mt-4 max-w-2xl">{artist.bio}</p>
      <h2 className="mb-6 mt-12 font-serif text-2xl">Works</h2>
      <MasonryGrid items={works?.items} />
    </div>
  );
}
