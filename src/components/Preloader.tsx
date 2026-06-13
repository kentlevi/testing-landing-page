import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const updateProgress = () => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsLoaded(true);
            setTimeout(onComplete, 800); // Wait for AnimatePresence exit animations
          }, 400);
          return 100;
        }

        // Variable loading speeds to make it feel organic other than boring linear
        const increment = prev < 30 
          ? Math.floor(Math.random() * 8) + 4 
          : prev < 85 
            ? Math.floor(Math.random() * 4) + 1 
            : Math.random() > 0.7 
              ? 1 
              : 0;

        return Math.min(prev + increment, 100);
      });
    };

    timer = setInterval(updateProgress, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: '-100%',
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-50 bg-luxury-bg flex flex-col justify-between p-8 md:p-16 select-none"
        >
          {/* Header */}
          <div className="flex justify-between items-center w-full">
            <span className="font-serif tracking-[0.2em] uppercase text-xs text-luxury-gold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-pulse" />
              ZORGE 9 ESTATE
            </span>
            <span className="font-mono text-[10px] text-zinc-500 tracking-wider">
              EST. 2026 // MOSCOW - MANHATTAN
            </span>
          </div>

          {/* Central Statement */}
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="font-serif text-3xl md:text-5xl lg:text-6xl text-zinc-200 font-light leading-tight tracking-tight"
            >
              The Altitude of <br />
              <span className="italic text-luxury-gold">Architecture &amp; Heritage</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-sans text-xs tracking-widest text-[#8E929A] uppercase mt-4 block"
            >
              Precision Wrapped in Matte Obsidian
            </motion.p>
          </div>

          {/* Progress & Bottom Bar */}
          <div className="flex flex-col gap-6 w-full">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-luxury-gold mb-1 tracking-widest uppercase">
                  INITIALIZING AUDIO-VISUAL STAGE
                </span>
                <span className="font-sans text-xs text-[#8E929A] tracking-wider">
                  Configuring high-fashion vector matrices
                </span>
              </div>
              
              {/* Ticking graphic counter */}
              <div className="flex items-baseline font-serif overflow-hidden select-none">
                <span className="text-6xl md:text-8xl font-light text-luxury-gold tracking-tighter">
                  {progress.toString().padStart(3, '0')}
                </span>
                <span className="text-xl md:text-2xl font-light text-luxury-gold/60 ml-1 font-sans">
                  %
                </span>
              </div>
            </div>

            {/* Line slider */}
            <div className="h-[1px] bg-white/5 w-full relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-luxury-gold"
                style={{ width: `${progress}%` }}
                transition={{ type: 'tween', ease: 'easeOut' }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600 tracking-widest">
              <span>LOT CODES: EXP_Z9_17_19_21</span>
              <span>ALTITUDE REF: 4.8M CEILINGS</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
