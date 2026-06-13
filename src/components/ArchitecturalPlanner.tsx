import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PENTHOUSE_LOTS } from '../data';
import { PenthouseLot } from '../types';
import { Ruler, Maximize2, Compass, LayoutGrid, Layers } from 'lucide-react';

interface ArchitecturalPlannerProps {
  onTourClick: (lotPrice: string, lotNum: string) => void;
}

export default function ArchitecturalPlanner({ onTourClick }: ArchitecturalPlannerProps) {
  const [selectedLot, setSelectedLot] = useState<PenthouseLot>(PENTHOUSE_LOTS[0]);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [measurementUnit, setMeasurementUnit] = useState<'metric' | 'imperial'>('metric');

  const convertSize = (sizeInSqM: number) => {
    if (measurementUnit === 'imperial') {
      return `${Math.round(sizeInSqM * 10.7639)} sq ft`;
    }
    return `${sizeInSqM} sq m`;
  };

  // Mock blueprint room targets for interactive SVG outline layering
  const LOT_ROOMS: Record<string, { name: string; id: string; coords: string; desc: string }[]> = {
    'lot-17': [
      { id: 'l17-bed1', name: 'Master Suite Sanctuary', coords: "top-[18%] left-[10%] w-[35%] h-[32%]", desc: 'Reaching 4.2m with custom cedar panels' },
      { id: 'l17-living', name: 'Panoramic Grand Salon', coords: "top-[15%] left-[50%] w-[42%] h-[45%]", desc: 'Vast double-height overlooking Hudson' },
      { id: 'l17-bath', name: 'Carrara Marble Spa Bath', coords: "top-[55%] left-[12%] w-[25%].4 h-[28%]", desc: 'Stand-alone oval tub, gold fixtures' },
      { id: 'l17-kitchen', name: 'Sleek Obsidian Kitchen', coords: "top-[64%] left-[45%] w-[48%] h-[24%]", desc: 'Sub-Zero custom integrated cabinetry' }
    ],
    'lot-19': [
      { id: 'l19-terrace', name: 'Stainless Sky-Pool Deck', coords: "top-[8%] left-[8%] w-[84%] h-[25%]", desc: 'Cantilevered heated stainless pool' },
      { id: 'l19-living', name: 'Central Atrium Salon', coords: "top-[38%] left-[20%] w-[55%] h-[35%]", desc: 'Vast space with floating spiral stairs' },
      { id: 'l19-master', name: 'Zen Sleeping Deck', coords: "top-[75%] left-[15%] w-[38%] h-[20%]", desc: 'Floating king platform bed overlooking west' },
      { id: 'l19-wellness', name: 'Private Hammam Bath', coords: "top-[75%] left-[58%] w-[28%] h-[21%]", desc: 'Steam sauna lined in volcanic basalt' }
    ],
    'lot-21': [
      { id: 'l21-perimeter', name: '360° Infinite Deck', coords: "top-[4%] left-[4%] w-[92%] h-[12%]", desc: 'Perimeter timber-deck panoramic belt' },
      { id: 'l21-banquet', name: '24-Seat Banquet Gallery', coords: "top-[20%] left-[15%] w-[70%] h-[24%]", desc: 'Splendid room curated for private catering' },
      { id: 'l21-master', name: 'The Throne Suite', coords: "top-[48%] left-[12%] w-[40%] h-[35%]", desc: 'Private master block with safe room' },
      { id: 'l21-cave', name: 'Obsidian Wine Cave', coords: "top-[48%] left-[56%] w-[32%] h-[35%]", desc: 'State-of-the-art temperature controlled cellar' }
    ]
  };

  return (
    <section id="structure" className="relative w-full bg-[#0B0C0E] py-16 md:py-28 text-white border-b border-white/10 flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-luxury-gold animate-spin-slow" />
              <span className="font-mono text-[10px] tracking-widest text-[#8E929A] uppercase">
                PORTFOLIO GRID / SECTION 03
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-none">
              The Plan &amp; <br />
              <span className="font-sans italic text-luxury-gold">Architectural Blueprint</span>
            </h2>
          </div>
          
          {/* Unit Toggle and Metrics */}
          <div className="flex items-center gap-4 bg-[#0e1012] border border-white/10 p-1 rounded backdrop-blur-md self-start text-xs">
            <button
              onClick={() => setMeasurementUnit('metric')}
              className={`px-3 py-1.5 font-mono tracking-widest rounded transition-colors cursor-pointer ${measurementUnit === 'metric' ? 'bg-luxury-gold text-black font-semibold' : 'text-[#8E929A] hover:text-white'}`}
            >
              METRIC (M²)
            </button>
            <button
              onClick={() => setMeasurementUnit('imperial')}
              className={`px-3 py-1.5 font-mono tracking-widest rounded transition-colors cursor-pointer ${measurementUnit === 'imperial' ? 'bg-luxury-gold text-black font-semibold' : 'text-[#8E929A] hover:text-white'}`}
            >
              IMPERIAL (FT²)
            </button>
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* LEFT COLUMN: THE LOT NAVIGATION & PENTHOUSE SPEC FILE (4 Columns) */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6 w-full">
            
            <div className="flex flex-col border border-white/10 bg-[#0e1012] p-4 rounded-lg">
              <span className="font-mono text-[9px] text-[#8E929A] tracking-widest uppercase mb-4 block">
                SELECT RESIDENCE UNIT:
              </span>
              
              {/* Vertical Lots Selector list */}
              <div className="flex flex-col gap-3">
                {PENTHOUSE_LOTS.map((lot) => {
                  const isSelected = selectedLot.id === lot.id;
                  return (
                    <button
                      key={lot.id}
                      onClick={() => setSelectedLot(lot)}
                      data-hover-label={`LOT_${lot.id.toUpperCase()}`}
                      className={`relative w-full text-left py-4 px-6 rounded border transition-all duration-300 flex justify-between items-center group cursor-pointer ${
                        isSelected 
                          ? 'bg-luxury-gold/5 border-luxury-gold-light' 
                          : 'bg-black/30 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {/* Active Left Indicator line */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-luxury-gold" />
                      )}

                      <div className="flex flex-col gap-1">
                        <span className={`font-mono text-xs tracking-wider transition-colors ${isSelected ? 'text-luxury-gold' : 'text-zinc-500'}`}>
                          {lot.lotNumber} // LEVEL {lot.floor}
                        </span>
                        <h3 className="font-serif text-xl font-light text-white tracking-wide">
                          {lot.name}
                        </h3>
                      </div>

                      <div className="flex flex-col items-end gap-1 select-none">
                        <span className="font-mono text-xs text-white font-medium">
                          {convertSize(lot.sizeSqM)}
                        </span>
                        <span className={`text-[9px] uppercase font-mono tracking-widest py-0.5 px-2 rounded-full font-semibold border ${
                          lot.status === 'available' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {lot.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Penthouse Spec Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLot.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="bg-[#0e1012] border border-white/10 rounded-lg p-6 flex flex-col gap-6"
              >
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="font-mono text-[9px] text-[#8E929A] tracking-widest uppercase">
                    LOT PARTICULARS:
                  </span>
                  <span className="font-serif text-2xl text-luxury-gold font-light">
                    {selectedLot.price}
                  </span>
                </div>

                <p className="font-sans text-xs text-zinc-400 leading-relaxed font-light">
                  {selectedLot.description}
                </p>

                {/* Grid Attributes */}
                <div className="grid grid-cols-2 gap-4 my-2">
                  <div className="bg-black/40 p-4 border border-white/10 rounded flex-col">
                    <span className="text-[#8E929A] font-mono text-[9px] tracking-wider uppercase block">CEILING CLEAR</span>
                    <span className="text-white text-md font-serif font-light">{selectedLot.ceilingHeight}</span>
                  </div>
                  <div className="bg-black/40 p-4 border border-white/10 rounded flex-col">
                    <span className="text-[#8E929A] font-mono text-[9px] tracking-wider uppercase block">ROOM DESIGN</span>
                    <span className="text-white text-md font-serif font-light">{selectedLot.bedrooms} Bed / {selectedLot.bathrooms} Bath</span>
                  </div>
                </div>

                {/* Highlights List with interactive Room Outline Hover bindings! */}
                <div>
                  <span className="font-mono text-[9px] text-[#8E929A] tracking-widest uppercase mb-3 block">
                    EXCLUSIVE FEATURES (HOVER TO ILLUME BLUEPRINT):
                  </span>
                  <div className="flex flex-col gap-2">
                    {LOT_ROOMS[selectedLot.id]?.map((room, rIdx) => (
                      <div
                        key={room.id}
                        onMouseEnter={() => setHoveredRoom(room.id)}
                        onMouseLeave={() => setHoveredRoom(null)}
                        className={`p-3 rounded border text-left transition-all duration-300 flex flex-col gap-1 cursor-crosshair ${
                          hoveredRoom === room.id 
                            ? 'bg-luxury-gold/5 border-luxury-gold text-white' 
                            : 'bg-black/20 border-white/10 hover:border-white/30 text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`${hoveredRoom === room.id ? 'text-luxury-gold-light font-medium' : 'text-zinc-200'} font-sans text-xs duration-300`}>
                            {room.name}
                          </span>
                          <span className="font-mono text-[8px] text-zinc-600">[ZONE_0{rIdx + 1}]</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono italic">
                          {room.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <button
                  onClick={() => onTourClick(selectedLot.price, selectedLot.lotNumber)}
                  data-hover-label="VIP_BOOKING"
                  className="w-full font-mono text-center text-xs tracking-widest uppercase py-3 border border-luxury-gold/50 bg-black hover:bg-luxury-gold hover:text-black duration-300 rounded cursor-pointer"
                >
                  ACQUIRE RESERVATION OPTION
                </button>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* RIGHT COLUMN: DYNAMIC BLUEPRINT INTERACTIVE CANVAS (8 Columns) */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-4 w-full">
            
            {/* Legend Header */}
            <div className="flex justify-between items-center bg-[#0e1012] px-6 py-4 border border-white/10 rounded-t-lg select-none text-xs font-mono tracking-widest text-[#8E929A]">
              <span className="flex items-center gap-2 text-white font-medium">
                <Compass className="w-4 h-4 text-luxury-gold animate-spin-slow" />
                NORTH ORIENTED SCHEME
              </span>
              <span className="hidden sm:inline">REF: ARCH_DWG_RECONSTRUCTION_2026</span>
            </div>

            {/* Big Map Board Frame */}
            <div className="relative aspect-[4/3] w-full bg-[#0B0C0E] border-l border-r border-b border-white/10 rounded-b-lg overflow-hidden flex items-center justify-center">
              
              {/* Background blueprint grid system lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

              {/* Blueprint Image Vector and animated rooms */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedLot.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="relative w-full h-full p-4 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={selectedLot.blueprintImg}
                    alt={`${selectedLot.name} Floorplan Architectural Dwg`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter invert opacity-75 brightness-125"
                  />

                  {/* Overlaid Hover Outline Zones */}
                  {LOT_ROOMS[selectedLot.id]?.map((room) => {
                    const isHovered = hoveredRoom === room.id;
                    return (
                      <div
                        key={room.id}
                        onMouseEnter={() => setHoveredRoom(room.id)}
                        onMouseLeave={() => setHoveredRoom(null)}
                        className={`absolute rounded transition-all duration-500 cursor-crosshair flex items-center justify-center ${room.coords} ${
                          isHovered 
                            ? 'bg-luxury-gold/15 border-2 border-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.25)]' 
                            : 'bg-white/[0.01] border border-white/10 hover:bg-white/[0.04]'
                        }`}
                      >
                        {/* Dynamic Floating Label when active */}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              className="absolute bg-black/95 text-white border border-luxury-gold py-1.5 px-3 rounded shadow-2xl z-30 pointer-events-none text-center min-w-[200px]"
                            >
                              <span className="font-sans text-xs font-semibold text-luxury-gold block">
                                {room.name}
                              </span>
                              <span className="font-mono text-[9px] text-[#8E929A]">
                                {room.desc}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Status watermarks inside architecture box */}
              <div className="absolute top-4 left-4 font-mono text-[9px] text-zinc-600 pointer-events-none tracking-widest uppercase flex flex-col gap-1">
                <span>ZORGE_9_CORE_ENGINE</span>
                <span>BLUEPRINT CAD FILE V3.21</span>
              </div>
              
              <div className="absolute bottom-4 right-4 font-mono text-[9px] text-zinc-600 pointer-events-none tracking-widest uppercase flex items-center gap-1">
                <LayoutGrid className="w-3.5 h-3.5" /> HOVER OVER LABELS OR AREAS TO DETECT
              </div>

            </div>

            {/* Instruction footnote below board */}
            <div className="flex items-center gap-2.5 px-2 py-1 bg-black/30 border border-white/10 rounded-md p-3">
              <Ruler className="w-4 h-4 text-luxury-gold/80" />
              <p className="font-sans text-[11px] text-[#8E929A] leading-relaxed select-none">
                Interactive smart CAD matrix: Placing mouse cursor over rooms highlights their physical footprint in real elevation. Ceiling vents and technical channels have been routed through subterranean shafts for absolute clean sightlines.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
