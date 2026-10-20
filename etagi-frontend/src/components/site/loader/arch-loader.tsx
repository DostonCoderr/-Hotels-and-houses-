'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOADER_EVENT, LOADER_KEY } from '../animations/use-loader-done';

const IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=800&fit=crop',
];

export function ArchLoader() {
  const [imgIndex, setImgIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    let current = 0;
    
    const progressTimer = setInterval(() => {
      current += 2;
      if (current > 92 && !isDone) current = 92;
      setProgress(Math.floor(current));
    }, 50);

    const imgTimer = setInterval(() => {
      setImgIndex((prev) => {
        if (prev === IMAGES.length - 1) {
          clearInterval(imgTimer);
          clearInterval(progressTimer);
          
          setProgress(100);
          setTimeout(() => setIsDone(true), 300); 
          setTimeout(() => setIsZooming(true), 1800); 
          
          setTimeout(() => {
            setShowLoader(false);
            window.dispatchEvent(new Event(LOADER_EVENT));
            (window as any).__loaderDone = true;
            try { sessionStorage.setItem(LOADER_KEY, '1'); } catch {}
          }, 3200); 
          
          return prev;
        }
        return prev + 1;
      });
    }, 900);

    return () => {
      clearInterval(progressTimer);
      clearInterval(imgTimer);
    };
  }, [isDone]);

  if (!showLoader) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="fixed inset-0 z-[9999] flex flex-col justify-between overflow-hidden"
        style={{ background: 'radial-gradient(circle at center, #1a2235 0%, #070c17 100%)' }} 
      >
        <div className="absolute top-8 right-8 text-white/30 z-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" strokeLinecap="round" />
          </svg>
        </div>

        <div className="flex-1 flex items-center justify-center relative w-full overflow-hidden">
          <AnimatePresence>
            {!isDone && (
              <motion.div 
                key="stage-1"
                exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="relative flex items-center justify-center gap-4"
              >
                {/* Chap tomon: ЭТ */}
                <div className="text-[#e54d42] relative z-10 drop-shadow-[0_0_15px_rgba(229,77,66,0.3)]" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 'clamp(60px, 10vw, 150px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  Дове
                </div>

                {/* O'rta: Rasm */}
                <div className="relative z-0 mx-2" style={{ width: 'clamp(150px, 18vw, 260px)', height: 'clamp(150px, 18vw, 260px)' }}>
                  <motion.div
                    key={imgIndex}
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10"
                    style={{ backgroundImage: `url(${IMAGES[imgIndex]})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '16px' }}
                  />
                </div>

                {/* O'ng tomon: ЖИ va Uy ikonkasi */}
                <div className="flex items-center gap-2 relative z-10">
                  <div className="text-[#e54d42] drop-shadow-[0_0_15px_rgba(229,77,66,0.3)]" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 'clamp(60px, 10vw, 150px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    риЯ
                  </div>
                  {/* Uy ikonkasi (rasmdagi kabi) */}
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="#e54d42" className="ml-2">
                    <path d="M12 3L2 12h3v8h5v-6h4v6h5v-8h3L12 3z" />
                    <path d="M7 11v8h2v-6h6v6h2v-8H7z" fill="#1a2235" opacity="0.3" />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isDone && (
              <motion.div 
                key="stage-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isZooming ? { scale: 50, opacity: 1 } : { scale: 1, opacity: 1 }} 
                transition={{ duration: isZooming ? 1.4 : 0.5, ease: isZooming ? [0.76, 0, 0.24, 1] : 'easeOut' }}
                className="absolute z-50 flex items-center gap-4"
              >
                <div className="text-[#e54d42] drop-shadow-[0_0_30px_rgba(229,77,66,0.4)]" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 'clamp(80px, 12vw, 200px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  ДовериЯ
                </div>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="#e54d42">
                  <path d="M12 3L2 12h3v8h5v-6h4v6h5v-8h3L12 3z" />
                  <path d="M7 11v8h2v-6h6v6h2v-8H7z" fill="#1a2235" opacity="0.3" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isDone && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex justify-between p-8 text-[#98a1b4] font-semibold tracking-widest text-sm z-50"
          >
            <div>(LOADING)</div>
            <div>{progress}%</div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}