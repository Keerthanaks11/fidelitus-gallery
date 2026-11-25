import { motion, useReducedMotion } from "framer-motion";

const BLUE = "#00679A";
const ORANGE = "#F39314";
const INK = "#1F1B16";

// Line drawings (120 x 120) and little coloured accents for each service.
const ICONS = {
  "gallery-for-rent": {
    lines: ["M16 26h52v40H16z", "M78 26h26v26H78z", "M78 60h26v24H78z", "M8 104h104", "M26 92h34M30 92v12M56 92v12"],
    dots: [{ cx: 42, cy: 46, r: 8, c: ORANGE }],
  },
  "rent-on-art": {
    lines: ["M20 22h58v46H20z", "M26 62l15-17 11 11 9-10 12 16", "M82 70h26v30l-13 9-13-9z"],
    dots: [{ cx: 60, cy: 36, r: 6, c: ORANGE }, { cx: 95, cy: 82, r: 3, c: BLUE }],
  },
  "speed-painting": {
    lines: ["M60 32a34 34 0 1 0 0.01 0", "M50 18h20M60 18v14", "M60 66V46", "M26 108q17-14 34 0t34 0"],
    dots: [{ cx: 60, cy: 66, r: 5, c: ORANGE }],
  },
  workshop: {
    lines: ["M36 24h48v40H36z", "M60 64v40", "M60 78L36 108M60 78l24 30", "M44 50q8-14 16 0t16 0"],
    dots: [{ cx: 76, cy: 36, r: 5, c: ORANGE }],
  },
  "desktop-painting": {
    lines: ["M12 100h96", "M32 34h56v44H32z", "M60 78L46 100M60 78l14 22", "M40 68l13-15 9 9 9-11 12 17"],
    dots: [{ cx: 72, cy: 48, r: 5, c: ORANGE }],
  },
  caricature: {
    lines: ["M60 20c26 0 42 14 42 36 0 24-17 38-42 38S18 80 18 56c0-22 16-36 42-36z", "M46 50a5 5 0 1 0 0.01 0", "M74 50a5 5 0 1 0 0.01 0", "M60 58l-5 12h10", "M40 80q20 16 40 0", "M50 20q10-14 20 0"],
    dots: [{ cx: 30, cy: 68, r: 6, c: ORANGE }, { cx: 90, cy: 68, r: 6, c: ORANGE }],
  },
  murals: {
    lines: ["M10 22h100v72H10z", "M22 80c14-32 30 6 44-20s28 6 32-8", "M30 106h60"],
    dots: [{ cx: 86, cy: 40, r: 9, c: ORANGE }],
  },
  portraits: {
    lines: ["M60 12c24 0 38 20 38 46s-14 50-38 50S22 84 22 58 36 12 60 12z", "M60 40a12 12 0 1 0 0.01 0", "M36 92c4-18 16-24 24-24s20 6 24 24", "M60 12L46 2M60 12L74 2"],
    dots: [{ cx: 60, cy: 100, r: 3, c: ORANGE }],
  },
  "art-works": {
    lines: ["M60 18c-26 0-44 16-44 38 0 18 14 30 30 30 8 0 8-8 4-12s0-10 10-10h8c14 0 26-8 26-20 0-14-16-26-34-26z", "M72 104l32-46"],
    dots: [{ cx: 38, cy: 50, r: 5, c: ORANGE }, { cx: 56, cy: 36, r: 5, c: BLUE }, { cx: 78, cy: 40, r: 5, c: INK }, { cx: 84, cy: 60, r: 5, c: ORANGE }],
  },
};

// A line "draws itself", then the coloured dots pop in.
export default function ServiceIcon({ name, size = 120, className = "", stroke = BLUE, accent, strokeWidth = 2.5 }) {
  const reduce = useReducedMotion();
  const icon = ICONS[name] ?? ICONS["art-works"];
  const draw = (i) => ({
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1, opacity: 1,
      transition: { pathLength: { duration: 0.9, delay: i * 0.14, ease: "easeInOut" }, opacity: { duration: 0.01, delay: i * 0.14 } },
    },
  });
  const pop = (i) => ({
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 14, delay: 0.5 + icon.lines.length * 0.14 + i * 0.1 } },
  });

  return (
    <motion.svg viewBox="0 0 120 120" width={size} height={size} className={className} fill="none" role="img" aria-hidden
      initial={reduce ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
      {icon.lines.map((d, i) => (
        <motion.path key={i} d={d} variants={draw(i)} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {icon.dots.map((d, i) => (
        <motion.circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={accent ?? d.c} variants={pop(i)} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      ))}
    </motion.svg>
  );
}