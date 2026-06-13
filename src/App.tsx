import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import HeroSection from './components/HeroSection';
import SplitScreenSection from './components/SplitScreenSection';
import ArchitecturalPlanner from './components/ArchitecturalPlanner';
import PanoramicViewer from './components/PanoramicViewer';
import BookingForm from './components/BookingForm';
import { Compass, Sparkles, Building2, SunDim, HelpCircle, MapPin, KeyRound, ArrowUpRight } from 'lucide-react';

interface AmbientCardProps {
  id: 'midnight' | 'gold' | 'silver';
  title: string;
  time: string;
  description: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  activeClass: string;
  inactiveClass: string;
  dataHoverLabel: string;
}

function AmbientCard({
  id,
  title,
  time,
  description,
  active,
  onClick,
  icon,
  activeClass,
  inactiveClass,
  dataHoverLabel,
}: AmbientCardProps) {
  // Use independent motion values to trace relative hover coordinate percentage [0.0, 1.0]
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth transforms mapping mouse positions to tilt degrees
  const rotateX = useTransform(y, [0, 1], [15, -15]);
  const rotateY = useTransform(x, [0, 1], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Scale tracking values between 0 and 1
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseLeave = () => {
    // Graceful return snap to default perspective when mouse departs
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full flex">
      <motion.button
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-hover-label={dataHoverLabel}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{
          scale: 1.03,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        }}
        className={`p-6 rounded-lg border text-left flex flex-col gap-4 cursor-pointer transition-all duration-300 w-full ${
          active ? activeClass : inactiveClass
        }`}
      >
        <div 
          style={{ transform: 'translateZ(30px)' }}
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
            id === 'midnight' 
              ? 'bg-black/80 text-luxury-gold border-white/10' 
              : id === 'gold' 
                ? 'bg-[#1b1502]/85 text-[#E5C158] border-[#e5c158]/10' 
                : 'bg-[#0d1418]/85 text-[#8E929A] border-white/10'
          }`}
        >
          {icon}
        </div>
        <div style={{ transform: 'translateZ(20px)' }} className="flex flex-col gap-1 w-full">
          <span className="font-mono text-[9px] text-[#8E929A] tracking-wider block">{time}</span>
          <h4 className="font-serif text-md text-white font-medium mt-1">{title}</h4>
          <span className="text-[10px] text-[#8E929A] font-sans mt-2 block font-light leading-snug">
            {description}
          </span>
        </div>
      </motion.button>
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [activeUnitForBooking, setActiveUnitForBooking] = useState<string | undefined>(undefined);
  const [activePriceForBooking, setActivePriceForBooking] = useState<string | undefined>(undefined);
  
  // Luxury Theme Customizer State
  const [ambientTone, setAmbientTone] = useState<'midnight' | 'gold' | 'silver'>('midnight');
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);

  // Monitor scroll height to show/hide elegant header and trigger viewport trackers
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Scrolled past 80% viewport
      if (currentScrollY > window.innerHeight * 0.8) {
        setScrolledPastHero(true);
      } else {
        setScrolledPastHero(false);
      }

      // Quick show/hide responsive header logic
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setShowHeader(false); // scrolling down, hideheader
      } else {
        setShowHeader(true); // scrolling up, show header
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleBookingRedirect = (price?: string, lotNum?: string) => {
    if (lotNum) {
      setActiveUnitForBooking(lotNum);
      setActivePriceForBooking(price);
    }
    const element = document.getElementById('booking-section');
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getAmbientToneStyles = () => {
    switch (ambientTone) {
      case 'gold':
        return {
          bgColor: 'bg-gradient-to-tr from-[#141005] via-[#0b0c0e] to-[#0d0a02]',
          accentText: 'text-[#E5C158]',
          glowIcon: 'shadow-[0_0_20px_rgba(229,193,88,0.15)] ring-1 ring-[#e5c158]/20',
          title: 'Imperial Autumn Amber'
        };
      case 'silver':
        return {
          bgColor: 'bg-gradient-to-tr from-[#0b1013] via-[#0b0c0e] to-[#0c0e12]',
          accentText: 'text-[#8E929A]',
          glowIcon: 'shadow-[0_0_20px_rgba(255,255,255,0.08)] ring-1 ring-white/10',
          title: 'Nordic Slate Platinum'
        };
      default:
        return {
          bgColor: 'bg-[#0B0C0E]',
          accentText: 'text-luxury-gold',
          glowIcon: 'shadow-[0_0_20px_rgba(212,175,55,0.1)] ring-1 ring-[#d4af37]/20',
          title: 'Custom Matte Obsidian'
        };
    }
  };

  const activeStyles = getAmbientToneStyles();

  return (
    <>
      {/* Luxury Lag-Softened Cursor */}
      <CustomCursor />

      {/* Full Scenic Asset Counter Preloader */}
      <Preloader onComplete={() => setLoaded(true)} />

      {/* Main Page Canvas wrapped carefully */}
      <AnimatePresence>
        {loaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`min-h-screen text-white relative transition-colors duration-1000 ${activeStyles.bgColor} overflow-hidden`}
          >
            {/* Flexbox Layout with Left Rail Navigation for desktop layout pattern mapping */}
            <div className="flex flex-row min-h-screen relative">
              
              {/* Left Sticky Rail Navigation (from Sophisticated Dark) */}
              <aside className="hidden lg:flex w-20 border-r border-[#1C1E22] flex-col items-center justify-between py-10 h-screen sticky top-0 bg-black/40 backdrop-blur-md z-50 select-none">
                <div className="text-luxury-gold font-serif text-2xl font-bold tracking-widest">Z9</div>
                <div className="rotate-180 [writing-mode:vertical-lr] text-[9px] tracking-[0.5em] text-[#8E929A] uppercase font-mono">
                  Residential Masterpiece // 2026
                </div>
                <div className="flex flex-col gap-4 items-center">
                  <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full shadow-[0_0_8px_#D4AF37]" />
                  <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                </div>
              </aside>

              {/* Main Contents Panel */}
              <main className="flex-1 min-w-0 flex flex-col">
                
                {/* STICKY CINEMATIC HEADER BAR */}
                <motion.header
                  initial={{ y: -100 }}
                  animate={{ y: showHeader ? 0 : -100 }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  className={`fixed top-0 left-0 lg:left-20 right-0 z-40 px-6 md:px-12 py-5 transition-all duration-300 ${
                    scrolledPastHero 
                      ? 'bg-black/90 backdrop-blur-md border-b border-white/5' 
                      : 'bg-transparent'
                  }`}
                >
                  <div className="max-w-7xl mx-auto flex justify-between items-center select-none">
                    {/* Brand Logo anchor */}
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      data-hover-label="GOTO_TOP"
                      className="flex items-center gap-3 text-left cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full border border-luxury-gold/50 flex items-center justify-center text-luxury-gold font-serif text-sm bg-black/40">
                        Z
                      </div>
                      <div className="flex flex-col">
                        <span className="font-serif text-xs font-semibold tracking-widest text-white block">Z9 PENTHOUSES</span>
                        <span className="font-mono text-[7px] text-zinc-500 tracking-[0.2em] -mt-0.5">THE MOSCOW CROWN</span>
                      </div>
                    </button>

                    {/* Main navigation coordinates linking nicely */}
                    <nav className="hidden lg:flex items-center gap-8 font-mono text-[10px] tracking-[0.2em] text-[#8E929A]">
                      <button
                        onClick={() => document.getElementById('structure')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                        data-hover-label="SPECS_01"
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        01/STRUCTURE
                      </button>
                      <button
                        onClick={() => document.getElementById('view')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                        data-hover-label="SPECS_02"
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        02/SANCTUARY
                      </button>
                      <button
                        onClick={() => document.getElementById('spa')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                        data-hover-label="SPECS_03"
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        03/MATERIALS
                      </button>
                      <button
                        onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        data-hover-label="CAD_DWG"
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        04/CAD SCHEMATICS
                      </button>
                    </nav>

                    {/* Anchor CTA */}
                    <button
                      onClick={() => handleBookingRedirect()}
                      data-hover-label="BOOKING"
                      className="font-mono text-[9px] tracking-widest text-[#D4AF37] hover:text-white border border-[#d4af37]/40 py-2 px-4 rounded transition-all duration-300 bg-black/40 cursor-pointer"
                    >
                      SECURE PASSAGE
                    </button>
                  </div>
                </motion.header>

                {/* SECTION 1: IMMERSIVE HERO VIEWPORT */}
                <HeroSection 
                  onTourClick={() => handleBookingRedirect()}
                  onExploreClick={() => {
                    const element = document.getElementById('structure');
                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                />

                {/* MARGIN SPACE DIVIDER WITH DEEP COGNITIVE ACCENT */}
                <div className="w-full flex justify-center py-12 md:py-16 select-none relative bg-black/40">
                  <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                  <div className="relative bg-[#0a0b0d] px-6 py-2 border border-white/10 rounded-full z-10 flex items-center gap-3">
                    <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                    <span className="font-mono text-[9px] tracking-widest text-zinc-400">
                      RECONSTRUCTION SPECIFICATION INDEX
                    </span>
                  </div>
                </div>

                {/* SECTION 2: STICKY SPLIT SCREEN PHILOSOPHY */}
                <SplitScreenSection />

                {/* INTERACTIVE AMBIENT CURATOR MODULE (PENTHOUSE TIMESTEP CUSTOMIZER) */}
                <section className="relative w-full bg-black py-16 border-b border-white/10 z-20 flex flex-col items-center">
                  <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0e1012] p-8 md:p-12 rounded-xl border border-white/10 relative">
                      
                      {/* Absolute decoration vectors */}
                      <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-[#d4af37]/20 m-6 pointer-events-none" />
                      
                      {/* Left Column Description */}
                      <div className="lg:col-span-5 flex flex-col gap-4">
                        <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block">
                          CUSTOM CURATION SYSTEM // TIMESTEP
                        </span>
                        <h3 className="font-serif text-3xl md:text-4xl text-white font-light tracking-tight leading-tight">
                          Adjust curated <br />
                          <span className="italic text-luxury-gold">Ambient Temperature</span>
                        </h3>
                        <p className="font-sans text-xs text-zinc-400 leading-relaxed font-light mt-2">
                          Zorge 9 penthouses utilize state-of-the-art light projection filters. Select an ambient tone profile below to examine how the natural volcanic basalt and Calacatta stone react at different sun timestamps.
                        </p>

                        <div className="flex flex-col gap-2.5 font-sans text-xs mt-4">
                          <div className="flex justify-between py-1.5 border-b border-white/10">
                            <span className="text-zinc-500 font-mono text-[10px]">CURRENT TEMPERATURE SCHEMA</span>
                            <span className="text-white font-medium">{activeStyles.title}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-white/10">
                            <span className="text-zinc-500 font-mono text-[10px]">SPECTRUM COEFFICIENT</span>
                            <span className="text-luxury-gold font-medium">98.2 // HIGH LUMENS</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column Interactive controls representing 3 atmospheric tones */}
                      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full pt-4 lg:pt-0">
                        
                        <AmbientCard
                          id="midnight"
                          title="Obsidian Void"
                          time="TIMESTEP 22:00"
                          description="Deep matte blacks with low-amber contrast light."
                          active={ambientTone === 'midnight'}
                          onClick={() => setAmbientTone('midnight')}
                          icon={<KeyRound className="w-4 h-4" />}
                          activeClass="border-luxury-gold bg-black/60 shadow-[0_0_20px_rgba(212,175,55,0.1)] ring-1 ring-[#d4af37]/20"
                          inactiveClass="border-white/10 bg-black/20 hover:border-white/30"
                          dataHoverLabel="ATMOS_MID"
                        />

                        <AmbientCard
                          id="gold"
                          title="Autumn Amber"
                          time="TIMESTEP 17:30"
                          description="Rich golden reflection wrapping timber panels and brass."
                          active={ambientTone === 'gold'}
                          onClick={() => setAmbientTone('gold')}
                          icon={<SunDim className="w-4 h-4" />}
                          activeClass="border-[#e5c158] bg-[#141005]/60 shadow-[0_0_20px_rgba(229,193,88,0.15)] ring-1 ring-[#e5c158]/20"
                          inactiveClass="border-white/10 bg-black/20 hover:border-white/30"
                          dataHoverLabel="ATMOS_GOLD"
                        />

                        <AmbientCard
                          id="silver"
                          title="Slate Platinum"
                          time="TIMESTEP 08:00"
                          description="High-contrast northern light projecting clean steel lines."
                          active={ambientTone === 'silver'}
                          onClick={() => setAmbientTone('silver')}
                          icon={<Building2 className="w-4 h-4" />}
                          activeClass="border-white bg-[#0b1013]/60 shadow-[0_0_20px_rgba(255,255,255,0.08)] ring-1 ring-white/10"
                          inactiveClass="border-white/10 bg-black/20 hover:border-white/30"
                          dataHoverLabel="ATMOS_PLAT"
                        />

                      </div>

                    </div>
                  </div>
                </section>

                {/* SECTION 3: ARCHITECTURAL PLANNER BOARD */}
                <ArchitecturalPlanner onTourClick={handleBookingRedirect} />

                {/* SECTION 4: PANORAMIC VIEWPORT HARMONIZER */}
                <PanoramicViewer />

                {/* SECTION 5: ACCESS ACCESS REGISTRY BOOKING FILE */}
                <BookingForm 
                  initialLot={activeUnitForBooking}
                  initialPrice={activePriceForBooking}
                />

                {/* LUXURY EDITORIAL SPECIFICATION BRIEF */}
                <section className="relative w-full bg-black py-12 border-t border-white/10 select-none text-zinc-600">
                  <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-mono tracking-widest text-[#8E929A]">
                    
                    <div className="flex flex-col gap-3">
                      <span className="text-white font-semibold">SECURITY PARADIGM</span>
                      <p className="text-zinc-600 font-sans leading-relaxed text-[11px] tracking-wide">
                        Zorge 9 implements automated perimeter protection via secure encrypted facial recognition matrix arrays. Access parameters remain locked to verified passport details.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="text-white font-semibold">CONCIERGE FLIGHTS</span>
                      <p className="text-zinc-600 font-sans leading-relaxed text-[11px] tracking-wide">
                        The crown helipad accommodates custom Augusta Grand or Bell-429 flight operators. Secure VIP ground-to-air transition times can be pre-scheduled under 4 minutes.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="text-white font-semibold">ECO SYSTEM DESIGN</span>
                      <p className="text-zinc-600 font-sans leading-relaxed text-[11px] tracking-wide">
                        Heating and technical cooling circuits run entirely subterranean with geothermal ground heat exchangers. Complete carbon neutral performance is certified till 2035.
                      </p>
                    </div>

                  </div>
                </section>

                {/* PHYSICAL FOOTER */}
                <footer className="w-full bg-[#050607] py-12 border-t border-white/10 select-none">
                  <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    
                    {/* Brand watermark */}
                    <div className="flex items-center gap-3">
                      <span className="font-serif tracking-[0.25em] text-xs text-white font-bold">ZORGE 9</span>
                      <span className="h-3 w-[1px] bg-zinc-800" />
                      <span className="font-mono text-[9px] text-zinc-500 uppercase">THE RECONSTRUCTION SERIES</span>
                    </div>

                    <p className="font-mono text-[9px] text-zinc-600 tracking-wider text-center md:text-right">
                      Curated &amp; Generated for Kent. All rights reserved. MOSCOW // NEW YORK © 2026.
                    </p>

                  </div>
                </footer>

              </main>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
