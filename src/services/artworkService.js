// Frontend-only: artworks come from src/data/catalog.js (no server needed).
import { ARTWORKS } from "../data/catalog.js";

const PER_PAGE = 9;
const later = (v) => Promise.resolve(v);

// same answer shape the pages used before: { items, page, pages, total }
export const getArtworks = ({ category = "", search = "", page = 1, artist, limit = PER_PAGE } = {}) => {
  const q = search.trim().toLowerCase();
  const list = ARTWORKS.filter(
    (a) =>
      (!category || a.category === category) &&
      (!artist || a.artist?._id === artist) &&
      (!q || [a.title, a.artist?.name, a.medium, a.category].join(" ").toLowerCase().includes(q))
  );
  const pages = Math.max(1, Math.ceil(list.length / limit));
  const p = Math.min(Math.max(1, page), pages);
  return later({ items: list.slice((p - 1) * limit, p * limit), page: p, pages, total: list.length });
};

export const getArtwork = (slug) => {
  const a = ARTWORKS.find((x) => x.slug === slug);
  return a ? later(a) : Promise.reject(new Error("Artwork not found"));
};
