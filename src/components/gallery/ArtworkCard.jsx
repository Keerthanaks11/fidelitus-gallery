import { Link } from "react-router-dom";
import { formatPrice, imgUrl } from "../../utils/formatters.js";

export default function ArtworkCard({ artwork }) {
  return (
    <Link to={`/gallery/${artwork.slug}`} className="group block">
      <div className="overflow-hidden bg-stone-100">
        <img src={imgUrl(artwork.images?.[0])} alt={artwork.title} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <h3 className="mt-3 font-serif text-lg">{artwork.title}</h3>
      <p className="text-sm text-brand-light">{artwork.artist?.name}</p>
      <p className="text-sm">{artwork.status === "sold" ? "Sold" : formatPrice(artwork.price)}</p>
    </Link>
  );
}
