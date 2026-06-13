import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Compass, MoveHorizontal, Navigation } from 'lucide-react';
import { PANORAMAS } from '../data';

export default function PanoramicViewer() {
  const [activePanIndex, setActivePanIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [panDegrees, setPanDegrees] = useState(180); // Center degrees

  // Handle dragging math to rotate compass and move panorama
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.6; // Speed boost multiplier
    const currentScroll = scrollLeft - walk;
    containerRef.current.scrollLeft = currentScroll;

    // Calculate panoramic angle based on scroll ratio
    const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
    if (maxScroll > 0) {
      const scrollRatio = containerRef.current.scrollLeft / maxScroll;
      const deg = Math.floor(scrollRatio * 360);
      setPanDegrees(deg);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    containerRef.current.scrollLeft = scrollLeft - walk;

    const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
    if (maxScroll > 0) {
      const scrollRatio = containerRef.current.scrollLeft / maxScroll;
      setPanDegrees(Math.floor(scrollRatio * 360));
    }
  };

  // Center scroll container on construct
  useEffect(() => {
    if (containerRef.current) {
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      containerRef.current.scrollLeft = maxScroll / 2;
    }
  }, [activePanIndex]);

  const getCompassDirection = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return 'N (0°)';
    if (deg >= 22.5 && deg < 67.5) return 'NE (45°)';
    if (deg >= 67.5 && deg < 112.5) return 'E (90°)';
    if (deg >= 112.5 && deg < 157.5) return 'SE (135°)';
    if (deg >= 157.5 && deg < 202.5) return 'S (180°)';
    if (deg >= 202.5 && deg < 247.5) return 'SW (225°)';
    if (deg >= 247.5 && deg < 292.5) return 'W (270°)';
    return 'NW (315°)';
  };

  return (
    <section className="relative w-full bg-[#0B0C0E] py-16 md:py-24 border-b border-white/10 overflow-hidden flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 mb-10 select-none">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-luxury-gold animate-spin-slow" />
              <span className="font-mono text-[10px] tracking-widest text-[#8E929A] uppercase">
                ATMOSPHERE FIELD / INTERACTIVE SHADOWS
              </span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-none">
              Horizon Panoramic <span className="font-sans italic text-luxury-gold">360° Overlooks</span>
            </h2>
          </div>

          {/* Panoramic view toggler buttons */}
          <div className="flex gap-4">
            {PANORAMAS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActivePanIndex(idx)}
                data-hover-label={`VIEW_${idx + 1}`}
                className={`font-mono text-xs tracking-widest uppercase border py-2 px-4 transition-all rounded cursor-pointer ${
                  activePanIndex === idx 
                    ? 'bg-luxury-gold/10 border-luxury-gold text-white font-medium' 
                    : 'bg-black/40 border-white/10 text-[#8E929A] hover:border-white/30'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PANORAMIC CAROUSEL VIEWPORT WITH MOUSE CAROUSEL GRABBING */}
      <div className="w-full relative select-none">
        
        {/* Dynamic Floating HUD overlays indicating drag action */}
        <div className="absolute top-6 left-6 md:left-12 z-20 pointer-events-none bg-black/75 backdrop-blur-md px-5 py-3 border border-white/10 rounded-md flex items-center gap-4">
          <motion.div 
            animate={{ rotate: panDegrees }}
            className="w-8 h-8 rounded-full border border-luxury-gold/50 flex items-center justify-center text-luxury-gold"
          >
            <Navigation className="w-4 h-4 transform -rotate-45" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-zinc-500 tracking-wider">OBSERVATORY COMPASS BEARING</span>
            <span className="font-serif text-md text-white font-light tracking-wide">{getCompassDirection(panDegrees)}</span>
          </div>
        </div>

        {/* Swipe instruction tooltip overlay in the center */}
        <div className="absolute bottom-6 right-6 md:right-12 z-20 pointer-events-none bg-black/75 backdrop-blur-md px-4 py-2 border border-[#d4af37]/25 rounded flex items-center gap-2">
          <MoveHorizontal className="w-4 h-4 text-luxury-gold animate-bounce-slow" />
          <span className="font-mono text-[9px] tracking-widest text-[#8E929A] uppercase">
            CLICK &amp; DRAG TO PANORAMA VIEW
          </span>
        </div>

        {/* Sliding Main Frame wrapper containing custom cursor triggers */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleMouseLeaveOrUp}
          onTouchMove={handleTouchMove}
          data-hover-label="DRAG PAN"
          className="w-full overflow-x-scroll scrollbar-none cursor-grab active:cursor-grabbing relative flex h-[480px] md:h-[600px] border-t border-b border-white/5"
          style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
        >
          {/* Panoramic wide background canvas */}
          <div className="min-w-[2800px] h-full relative">
            <img
              src={PANORAMAS[activePanIndex].image}
              alt={PANORAMAS[activePanIndex].title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none pointer-events-none"
              style={{ filter: 'brightness(0.72) contrast(1.02)' }}
            />
            
            {/* Absolute annotations on the wide panorama canvas for architectural context! */}
            <div className="absolute top-[35%] left-[24%] pointer-events-none bg-black/60 backdrop-blur-md border border-luxury-gold/30 p-3 rounded-lg flex flex-col gap-0.5">
              <span className="font-mono text-[9px] text-[#8E929A] tracking-wider uppercase">NORTH BELT RECTOR</span>
              <span className="font-serif text-sm font-light text-white">THE HUDSON MERIDIAN</span>
            </div>

            <div className="absolute top-[42%] left-[62%] pointer-events-none bg-black/60 backdrop-blur-md border border-luxury-gold/30 p-3 rounded-lg flex flex-col gap-0.5">
              <span className="font-mono text-[9px] text-[#8E929A] tracking-wider uppercase">EAST POINT APEX</span>
              <span className="font-serif text-sm font-light text-white">KREMLIN SPARKS VIEW</span>
            </div>

            <div className="absolute top-[28%] left-[78%] pointer-events-none bg-black/60 backdrop-blur-md border border-white/5 p-3 rounded-lg flex flex-col gap-0.5">
              <span className="font-mono text-[9px] text-zinc-500 tracking-wider">ALTITUDE REF</span>
              <span className="font-serif text-sm font-light text-[#D4AF37]">ZORGE 9 RESIDENCE CROWN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer statistics descriptor */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border border-white/10 bg-[#0e1012] p-4 rounded-md gap-4 select-none text-xs font-mono tracking-widest text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-luxury-gold rounded-full animate-ping" />
            <span className="text-zinc-500 uppercase">LOCATION STATUS:</span>
            <span className="text-white font-medium uppercase">{PANORAMAS[activePanIndex].title} ACTIVE</span>
          </div>
          <p className="font-sans text-[11px] text-[#8E929A] max-w-lg leading-relaxed select-none">
            {PANORAMAS[activePanIndex].description} Glass panes are manufactured from acoustic structural shielding layer laminate to filter out low-frequency noise from town currents.
          </p>
        </div>
      </div>
    </section>
  );
}
