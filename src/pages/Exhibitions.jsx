import { getExhibitions } from "../services/exhibitionService.js";
import useFetch from "../hooks/useFetch.js";
import Loader from "../components/ui/Loader.jsx";
import { formatDate, imgUrl } from "../utils/formatters.js";

export default function Exhibitions() {
  const { data, loading } = useFetch(getExhibitions);
  if (loading) return <Loader />;
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 font-serif text-4xl">Exhibitions</h1>
      <div className="space-y-10">
        {data?.map((e) => (
          <article key={e._id} className="grid gap-6 md:grid-cols-2">
            <img src={imgUrl(e.coverImage)} alt={e.title} className="w-full object-cover" />
            <div>
              <span className="text-xs uppercase tracking-wide text-brand-accent">{e.status}</span>
              <h2 className="font-serif text-2xl">{e.title}</h2>
              <p className="text-sm text-brand-light">{[e.startDate && `${formatDate(e.startDate)}${e.endDate ? ` – ${formatDate(e.endDate)}` : ""}`, e.location].filter(Boolean).join(" · ")}</p>
              <p className="mt-3">{e.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
