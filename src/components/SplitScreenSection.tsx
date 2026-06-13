import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Layers, Eye, Compass, CompassIcon, ArrowUpRight } from 'lucide-react';

interface ContentSection {
  id: string;
  num: string;
  title: string;
  metric: string;
  metricLabel: string;
  description: string;
  detailedSpecs: { label: string; value: string }[];
  image: string;
  imageAlt: string;
}

const SECTIONS: ContentSection[] = [
  {
    id: 'structure',
    num: '01',
    title: 'THE VERTICAL MASS',
    metric: '4.8M',
    metricLabel: 'UNBROKEN CEILING CLEARANCE',
    description: 'Every penthouse unit displays a rare structural verticality. Reaching heights of up to 4.8 meters, the galleries represent complete volumetric freedom, allowing architectural scales and light volume unparalleled in standard structural flats.',
    detailedSpecs: [
      { label: 'Standard Height comparison', value: '2.8m vs Zorge 9\'s 4.8m' },
      { label: 'Window integration', value: 'Double-glazed solar tempered glass' },
      { label: 'Structural layout', value: 'Column-free structural spans of up to 12 meters' }
    ],
    image: '/src/assets/images/master_suite_1781316163910.jpg',
    imageAlt: 'High ceiling master suite showing natural sunset illumination'
  },
  {
    id: 'view',
    num: '02',
    title: 'THE 360° SKYLINE BELT',
    metric: '100%',
    metricLabel: 'PERIMETER GLASS EMBED',
    description: 'A seamless custom panoramic structural ring encloses the penthouses. Continuous glass sweeps run completely from floor to ceiling, with non-reflective structural frames that vanish when viewed from the interior salon.',
    detailedSpecs: [
      { label: 'Panoramic sweep', value: '360° unimpeded urban horizons' },
      { label: 'Terrace footprint', value: 'Stretching up to 140 square meters of timber decking' },
      { label: 'Dynamic dimming', value: 'Curated electrochromic light comfort controls' }
    ],
    image: '/src/assets/images/hero_penthouse_1781316127919.jpg',
    imageAlt: 'Panoramic high ceiling living area overlook'
  },
  {
    id: 'spa',
    num: '03',
    title: 'THE STONE SANCTUARY',
    metric: '100% / Carrara',
    metricLabel: 'BOOK-MATCHED MARBLE SLABS',
    description: 'Baths feature solid-slab Calacatta Gold and volcanic basalt, custom-quarried from Carrara, Italy. Each marble block is paired and installed hand-to-hand in absolute symmetry, creating organic art installations behind matte-white circular fixtures.',
    detailedSpecs: [
      { label: 'Slab pairing', value: 'Flawlessly hand-aligned book-matching' },
      { label: 'Fixture coating', value: 'Brushed gold champagne custom finish' },
      { label: 'Ambient heating', value: 'Integrated silent geothermal radiant floor' }
    ],
    image: '/src/assets/images/marble_bathroom_1781316152303.jpg',
    imageAlt: 'Calacatta marble luxury high-end master bath'
  }
];

export default function SplitScreenSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftStickyRef = useRef<HTMLDivElement>(null);

  // Setup intersection observer to track right-side scrolling
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -50% 0px', // Trigger when section occupies the mid-viewport
      threshold: 0.15
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          const index = SECTIONS.findIndex(sec => sec.id === id);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = containerRef.current?.querySelectorAll('.design-section-block');
    sections?.forEach(sec => observer.observe(sec));

    return () => {
      sections?.forEach(sec => observer.unobserve(sec));
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-[#0B0C0E] border-t border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          
          {/* LEFT SIDE: FIXED / STICKY SPECIFICATIONS ZONE (Columns: 5) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 h-fit self-start py-4">
            <div ref={leftStickyRef} className="flex flex-col gap-8 md:gap-12">
              
              {/* Category Breadcrumb */}
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
                <span className="font-mono text-[10px] tracking-widest text-[#8E929A] uppercase">
                  MANHATTAN PHILOSOPHY / THE RECONSTRUCTION
                </span>
              </div>

              {/* Dynamic Titles */}
              <div className="min-h-[140px] flex flex-col justify-end">
                <span className="font-mono text-xs text-luxury-gold/70 tracking-widest block mb-2 font-light">
                  SPEC_ZONE_REF_{SECTIONS[activeIndex].num}
                </span>
                
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-light tracking-tight leading-tight">
                  {SECTIONS[activeIndex].title}
                </h2>
              </div>

              {/* Huge High-Fashion Custom Metric Indicator */}
              <div className="border-t border-b border-white/10 py-6 flex flex-col relative overflow-hidden bg-[#0e1012] p-6 rounded border border-white/10">
                {/* Background glow shadow */}
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-luxury-gold/5 blur-[50px] rounded-full pointer-events-none" />
                
                <span className="font-serif text-5xl md:text-6xl text-luxury-gold font-light tracking-widest">
                  {SECTIONS[activeIndex].metric}
                </span>
                <span className="font-mono text-[9px] text-[#8E929A] tracking-widest uppercase mt-2">
                  {SECTIONS[activeIndex].metricLabel}
                </span>
              </div>

              {/* Dynamic Description Copy */}
              <p className="font-sans text-sm md:text-base text-zinc-400 leading-relaxed font-light">
                {SECTIONS[activeIndex].description}
              </p>

              {/* Live Mini Specs */}
              <div className="flex flex-col gap-3 font-sans text-xs">
                {SECTIONS[activeIndex].detailedSpecs.map((spec, sIdx) => (
                  <div key={sIdx} className="flex justify-between py-2 border-b border-white/10 text-zinc-400">
                    <span className="text-[#8E929A] tracking-wider uppercase font-mono text-[10px]">{spec.label}</span>
                    <span className="text-white font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Elegant Index Dot Tracker */}
              <div className="flex items-center gap-4 mt-4 font-mono text-[10px]">
                {SECTIONS.map((sec, idx) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      const element = document.getElementById(sec.id);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    data-hover-label={`GOTO_${sec.num}`}
                    className="flex items-center gap-2 text-left py-1 cursor-pointer"
                  >
                    <span className={`w-2 h-2 rounded-full duration-300 ${activeIndex === idx ? 'bg-luxury-gold scale-125' : 'bg-zinc-700 hover:bg-zinc-500'}`} />
                    <span className={`hidden md:inline transition-colors duration-300 ${activeIndex === idx ? 'text-white' : 'text-zinc-600'}`}>{sec.num}</span>
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* RIGHT SIDE: SCROLLABLE LUXURIOUS PICTURE CARDS CANVAS (Columns: 7) */}
          <div className="lg:col-span-7 flex flex-col gap-20 md:gap-32">
            {SECTIONS.map((sec, idx) => {
              return (
                <div
                  key={sec.id}
                  id={sec.id}
                  className="design-section-block relative flex flex-col gap-6"
                >
                  {/* Luxury Layout Framed Container */}
                  <div className="group relative overflow-hidden aspect-[4/3] md:aspect-[16/10] bg-zinc-900 border border-white/10 rounded">
                    {/* Visual Hover Scale and subtle color filters */}
                    <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none group-hover:bg-transparent duration-500" />
                    
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                      className="w-full h-full relative"
                    >
                      <img
                        src={sec.image}
                        alt={sec.imageAlt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-[0%] transition-all duration-700"
                      />
                    </motion.div>

                    {/* Left overlay card detail */}
                    <div className="absolute bottom-4 left-4 z-20 bg-black/85 backdrop-blur-md px-4 py-2 border border-white/10 rounded">
                      <span className="font-mono text-[9px] text-luxury-gold/90 tracking-widest uppercase">
                        EXHIBIT_ {sec.num}
                      </span>
                    </div>

                    {/* Vector technical overlay line on hot corner */}
                    <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-luxury-gold/40 m-4 pointer-events-none group-hover:scale-110 duration-300" />
                  </div>

                  {/* Micro label details below images */}
                  <div className="flex justify-between items-center px-2 select-none">
                    <span className="font-mono text-[10px] text-zinc-600 tracking-wider">
                      Z_9 // PHOTO MASTER: AMBIENT SHOWER
                    </span>
                    <span className="font-mono text-[10px] text-luxury-gold tracking-widest flex items-center gap-1.5 uppercase">
                      REF CODE: LOT_{sec.num} <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
