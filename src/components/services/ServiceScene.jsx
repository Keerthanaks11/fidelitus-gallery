import { motion, useReducedMotion } from "framer-motion";
import ServiceIcon from "./ServiceIcon.jsx";

// [colour, darker colour, accent] for every service. Only used when a service has no photo yet.
export const PALETTE = {
  "gallery-for-rent": ["#00679A", "#003F63", "#F39314"],
  "rent-on-art": ["#F39314", "#C96A00", "#FFFFFF"],
  "speed-painting": ["#2A2520", "#14110E", "#F39314"],
  workshop: ["#2F5D50", "#1C3A31", "#F2CC8F"],
  "desktop-painting": ["#8C2F39", "#5A1C24", "#F2CC8F"],
  caricature: ["#E07A5F", "#B4472E", "#FFFFFF"],
  murals: ["#3B4F8C", "#24315A", "#F2CC8F"],
  portraits: ["#9A7330", "#5E4318", "#FDE9C9"],
  "art-works": ["#00679A", "#1F3A5F", "#F39314"],
};

// Shows the service photo (slowly zooming). Without a photo, a flat colour with a line drawing.
export default function ServiceScene({ id, image, y, bare = false, lift = 6, className = "" }) {
  const reduce = useReducedMotion();
  const [colour, , accent] = PALETTE[id] ?? PALETTE["art-works"];

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: colour }}>
      {image ? (
        <motion.img src={image} alt="" className="absolute inset-0 h-full w-full object-cover"
          animate={reduce ? {} : { scale: [1, 1.08, 1] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      ) : (
        !bare && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `translateY(-${lift}%)` }}>
            <motion.div style={{ y }} className="flex h-full w-full items-center justify-center">
              <div className="aspect-square w-[46%] max-w-[300px]">
                <ServiceIcon name={id} size="100%" stroke="#FFFFFF" accent={accent} strokeWidth={2.2} />
              </div>
            </motion.div>
          </div>
        )
      )}
      {/* soft shade at the bottom so white captions stay readable on a photo */}
      {image && <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />}
    </div>
  );
}