import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Compass, ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onTourClick: () => void;
  onExploreClick: () => void;
}

export default function HeroSection({ onTourClick, onExploreClick }: HeroSectionProps) {
  const [synthPlaying, setSynthPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [oscillators, setOscillators] = useState<any[]>([]);

  // Function to initialize luxury synth hum
  const toggleAmbientSound = () => {
    if (!synthPlaying) {
      // Create and start oscillators
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.005, ctx.currentTime); // Very quiet, elegant ambient drone
      
      // Warm low frequency oscillator for grounding hum
      const osc1 = ctx.createOscillator();
      osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2 note
      osc1.type = 'sine';

      // Warm third overtone
      const osc2 = ctx.createOscillator();
      osc2.frequency.setValueAtTime(165, ctx.currentTime); // E3 fifth
      osc2.type = 'sine';

      // Sub-bass grounding
      const osc3 = ctx.createOscillator();
      osc3.type = 'sawtooth';
      osc3.frequency.setValueAtTime(55, ctx.currentTime); // A1 sub-octave

      // Low pass filter to remove high buzz
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, ctx.currentTime);

      // Connect
      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc3.start();

      setAudioCtx(ctx);
      setOscillators([osc1, osc2, osc3, gainNode]);
      setSynthPlaying(true);
    } else {
      // Disconnect and stop
      try {
        oscillators.forEach(o => {
          try { o.stop(); } catch(e) {}
        });
        if (audioCtx) {
          audioCtx.close();
        }
      } catch (err) {
        console.error('Error stopping synth sound:', err);
      }
      setSynthPlaying(false);
      setOscillators([]);
      setAudioCtx(null);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup synth on unmount
      oscillators.forEach(o => {
        try { o.stop(); } catch(e) {}
      });
      if (audioCtx) {
        try { audioCtx.close(); } catch(e) {}
      }
    };
  }, [oscillators, audioCtx]);

  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col justify-between p-6 md:p-12 z-10 bg-black">
      {/* Background Hero Image with Slow Reveal & Zoom Action */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.12, filter: 'brightness(0.3)' }}
          animate={{ scale: 1.0, filter: 'brightness(0.55)' }}
          transition={{ duration: 3.5, ease: [0.25, 1, 0.5, 1] }}
          className="w-full h-full relative"
        >
          <img
            src="/src/assets/images/hero_penthouse_1781316127919.jpg"
            alt="Zorge 9 Crown Penthouse View"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover origin-center"
          />
          {/* Custom vignette gradient overlay to ground the typography */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-luxury-bg" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
        </motion.div>
      </div>

      {/* Floating Header */}
      <div className="relative z-10 flex justify-between items-center w-full">
        {/* Brand Logo */}
        <div className="flex flex-col">
          <span className="font-serif tracking-[0.25em] text-sm md:text-md uppercase text-white font-medium select-none">
            ZORGE 9
          </span>
          <span className="font-mono text-[9px] tracking-widest text-luxury-gold/80 uppercase">
            Penthouses &amp; Manors
          </span>
        </div>

        {/* Action controls & Audio Toggle */}
        <div className="flex items-center gap-6">
          {/* Active sound synth status */}
          <button
            onClick={toggleAmbientSound}
            data-hover-label={synthPlaying ? "MUTE HUM" : "AMB_SOUND"}
            className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#8E929A] hover:text-luxury-gold transition-colors py-1.5 px-3 border border-white/5 rounded-full bg-black/45 backdrop-blur-md"
          >
            {synthPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-luxury-gold-light animate-pulse" />
                <span className="text-luxury-gold-light">HUM:ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>HUM:OFF</span>
              </>
            )}
          </button>

          <button
            onClick={onTourClick}
            data-hover-label="BOOK SITE"
            className="hidden sm:inline-block font-sans text-[10px] tracking-widest uppercase py-2 px-5 bg-luxury-gold text-black hover:bg-luxury-gold-light font-medium transition-all duration-300 rounded shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            Schedule VIP Viewing
          </button>
        </div>
      </div>

      {/* Hero Typography & Text Mask Reveal */}
      <div className="relative z-10 my-auto max-w-4xl pt-12 md:pt-20">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-[1px] w-8 bg-luxury-gold" />
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-luxury-gold font-light">
            THE ULTIMATE RESIDENCE COLLECTION
          </span>
        </div>

        {/* Elegant typography layered neatly */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-white leading-[0.9] tracking-tight">
          <div className="overflow-hidden clip-mask-reveal py-1">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Crown of the
            </motion.div>
          </div>
          <div className="overflow-hidden clip-mask-reveal py-1 text-luxury-gold">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="italic"
            >
              Skyline Palace
            </motion.div>
          </div>
        </h1>

        <div className="overflow-hidden clip-mask-reveal mt-6 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="font-sans text-sm md:text-base text-[#8E929A] leading-relaxed font-light tracking-wide"
          >
            Discover three custom-crafted, multi-level penthouses at the peak of Moscow. Suspended heights of up to 4.8 meters, private heated pools with cantilevered skyways, and a curated concierge network redefine European high status.
          </motion.p>
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="flex flex-wrap items-center gap-4 mt-8"
        >
          <button
            onClick={onExploreClick}
            data-hover-label="EXPL_SPACE"
            className="font-mono text-[11px] tracking-widest text-white uppercase border border-white/20 py-3.5 px-6 hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            Discover Residences
          </button>
          
          <button
            onClick={onTourClick}
            data-hover-label="VIP_TOUR"
            className="font-mono text-[11px] tracking-widest text-[#8E929A] hover:text-luxury-gold-light uppercase transition-colors"
          >
            Digital Walkthrough
          </button>
        </motion.div>
      </div>

      {/* Bottom Coordinates & Scroll Indicators */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end w-full gap-4 pt-4 border-t border-white/5 select-none text-[10px] font-mono tracking-widest text-zinc-500">
        <div className="flex gap-8">
          <div>
            <span className="text-zinc-600 block">HEIGHT REF</span>
            <span className="text-zinc-300">UP TO 21 STORIES</span>
          </div>
          <div>
            <span className="text-zinc-600 block">GEOMETRIC MAP</span>
            <span className="text-zinc-300">55.7728° N, 37.5255° E</span>
          </div>
          <div className="hidden md:block">
            <span className="text-zinc-600 block">ELEVATION</span>
            <span className="text-zinc-300">110M ABOVE STREET LEVEL</span>
          </div>
        </div>

        {/* Center Scroll Indicator capsule with moving Dot */}
        <div className="w-full sm:w-auto flex justify-center py-2 sm:py-0">
          <button
            onClick={onExploreClick}
            data-hover-label="SCROLL"
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-luxury-gold/75 group-hover:text-luxury-gold duration-300">
              EXPLORE PENTHOUSES
            </span>
            <div className="w-6 h-10 border border-luxury-gold/50 rounded-full flex justify-center p-1.5 duration-300 group-hover:border-luxury-gold/90 bg-black/30 backdrop-blur-md">
              <motion.div
                animate={{
                  y: [0, 14, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="w-1.5 h-1.5 bg-luxury-gold rounded-full"
              />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
