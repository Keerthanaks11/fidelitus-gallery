import ArtworkCard from "./ArtworkCard.jsx";
export default function MasonryGrid({ items = [] }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((a) => <ArtworkCard key={a._id} artwork={a} />)}
    </div>
  );
}
