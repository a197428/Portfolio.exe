/** Adapted from Kokonut UI Background Paths, MIT. */
import { motion, useReducedMotion } from 'motion/react';
import { useMemo } from 'react';

export default function BackgroundPaths() {
  const reduced = useReducedMotion();
  const paths = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: index,
        d: `M -200 ${120 + index * 48} C 300 ${-80 + index * 34}, 760 ${420 - index * 18}, 1500 ${60 + index * 42}`,
        opacity: 0.08 + index * 0.018,
      })),
    [],
  );
  return (
    <div className="portfolio-paths" aria-hidden="true">
      <svg viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="portfolio-path-gradient">
            <stop offset="0" stopColor="#b8ff63" stopOpacity="0" />
            <stop offset="0.48" stopColor="#b8ff63" />
            <stop offset="1" stopColor="#73b4ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            fill="none"
            stroke="url(#portfolio-path-gradient)"
            strokeWidth={1 + path.id * 0.14}
            style={{ opacity: path.opacity }}
            animate={reduced ? undefined : { pathLength: [0.25, 1, 0.25], x: [0, 22, 0] }}
            transition={{
              duration: 10 + path.id * 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
