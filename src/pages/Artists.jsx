import { Link } from "react-router-dom";
import { getArtists } from "../services/artistService.js";
import useFetch from "../hooks/useFetch.js";
import Loader from "../components/ui/Loader.jsx";
import { imgUrl } from "../utils/formatters.js";

export default function Artists() {
  const { data, loading } = useFetch(getArtists);
  if (loading) return <Loader />;
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 font-serif text-4xl">Artists</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {data?.map((a) => (
          <Link key={a._id} to={`/artists/${a.slug}`}>
            <img src={imgUrl(a.photo)} alt={a.name} className="aspect-square w-full object-cover" />
            <h3 className="mt-2 font-serif text-lg">{a.name}</h3>
            <p className="text-sm text-brand-light">{a.country}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
