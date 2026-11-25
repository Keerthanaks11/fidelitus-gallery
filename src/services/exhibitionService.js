// Frontend-only: exhibitions come from src/data/catalog.js (no server needed).
import { EXHIBITIONS } from "../data/catalog.js";

export const getExhibitions = () => Promise.resolve(EXHIBITIONS);
export const getExhibition = (id) => {
  const e = EXHIBITIONS.find((x) => x._id === id);
  return e ? Promise.resolve(e) : Promise.reject(new Error("Exhibition not found"));
};
