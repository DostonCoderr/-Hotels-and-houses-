'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        transformOrigin: '0 50%',
        scaleX,
        zIndex: 9998,
        pointerEvents: 'none',
        background: 'linear-gradient(90deg,#8a5f27,#c9a36a,#e6c993)',
      }}
    />
  );
}