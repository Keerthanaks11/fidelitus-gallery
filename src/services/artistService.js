// Frontend-only: artists come from src/data/catalog.js (no server needed).
import { ARTISTS } from "../data/catalog.js";

export const getArtists = () => Promise.resolve(ARTISTS);
export const getArtist = (slug) => {
  const a = ARTISTS.find((x) => x.slug === slug);
  return a ? Promise.resolve(a) : Promise.reject(new Error("Artist not found"));
};
