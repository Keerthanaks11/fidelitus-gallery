import { useEffect, useRef, useState } from "react";
export default function useInView(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), options);
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []); // eslint-disable-line
  return [ref, inView];
}
