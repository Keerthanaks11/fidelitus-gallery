import { useState } from "react";
import { getArtworks } from "../services/artworkService.js";
import useFetch from "../hooks/useFetch.js";
import useDebounce from "../hooks/useDebounce.js";
import FilterBar from "../components/gallery/FilterBar.jsx";
import MasonryGrid from "../components/gallery/MasonryGrid.jsx";
import Loader from "../components/ui/Loader.jsx";

export default function Gallery() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebounce(search);
  const { data, loading } = useFetch(() => getArtworks({ category, search: q, page }), [category, q, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 font-serif text-4xl">Gallery</h1>
      <FilterBar category={category} onCategory={(c) => { setCategory(c); setPage(1); }} search={search} onSearch={(s) => { setSearch(s); setPage(1); }} />
      {loading ? <Loader /> : <MasonryGrid items={data?.items} />}
      {data?.pages > 1 && (
        <div className="mt-10 flex justify-center gap-4">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="disabled:opacity-40">Prev</button>
          <span>{page} / {data.pages}</span>
          <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className="disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
