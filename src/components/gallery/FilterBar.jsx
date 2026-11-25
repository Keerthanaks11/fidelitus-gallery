import { CATEGORIES } from "../../utils/constants.js";

export default function FilterBar({ category, onCategory, search, onSearch }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {["", ...CATEGORIES].map((c) => (
          <button key={c || "all"} onClick={() => onCategory(c)} className={`rounded-full border px-4 py-1 text-sm ${category === c ? "bg-brand text-white" : ""}`}>
            {c || "All"}
          </button>
        ))}
      </div>
      <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search artworks…" className="rounded border px-3 py-2 text-sm" />
    </div>
  );
}
