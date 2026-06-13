import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, Phone, Mail, FileText, CheckCircle2, Ticket, QrCode } from 'lucide-react';
import { PENTHOUSE_LOTS } from '../data';

interface BookingFormProps {
  initialPrice?: string;
  initialLot?: string;
  onClose?: () => void;
}

export default function BookingForm({ initialPrice, initialLot, onClose }: BookingFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    lotSelection: initialLot || PENTHOUSE_LOTS[0].lotNumber,
    viewingDate: '',
    viewingTime: '14:00',
    mode: 'in-person', // 'in-person' or 'digital'
    specialRequests: ''
  });

  const [bookingPass, setBookingPass] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate luxury API verification delay
    setTimeout(() => {
      const generatedPassCode = `Z9-VIP-${Math.floor(1000 + Math.random() * 9000)}-${formData.lotSelection.split(' ')[1] || 'GP'}`;
      const mockPass = {
        code: generatedPassCode,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        lot: formData.lotSelection,
        date: formData.viewingDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        time: formData.viewingTime,
        mode: formData.mode,
        hash: Array.from({ length: 16 }, () => Math.round(Math.random() * 15).toString(16)).join('').toUpperCase()
      };

      setBookingPass(mockPass);
      setIsSubmitting(false);

      // Persist in local storage
      try {
        const existing = JSON.parse(localStorage.getItem('zorge9_bookings') || '[]');
        localStorage.setItem('zorge9_bookings', JSON.stringify([...existing, mockPass]));
      } catch (err) {
        console.error('Error saving booking in storage:', err);
      }
    }, 1200);
  };

  return (
    <div id="booking-section" className="w-full bg-[#0B0C0E] py-16 md:py-24 border-t border-white/10 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        
        {/* Title block */}
        <div className="text-center mb-12 flex flex-col items-center select-none">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
            <span className="font-mono text-[9px] tracking-widest text-[#8E929A] uppercase">
              VIP SERVICE PORTAL / ACCESS REGISTRY
            </span>
            <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-5xl font-light text-white tracking-tight">
            Schedule a Private <br />
            <span className="italic text-luxury-gold">Zorge 9 Viewing</span>
          </h2>
          <p className="font-sans text-xs text-zinc-500 max-w-md mt-4 leading-relaxed font-light">
            Due to strict privacy parameters, all physical visits require a digital verification pass. Fill out the registry below to generate your private access pass.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!bookingPass ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#0e1012] border border-white/10 rounded-xl p-6 md:p-10 shadow-2xl relative"
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Mode Selector Option */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mode: 'in-person' })}
                    className={`py-3 px-4 border rounded font-mono text-xs tracking-widest uppercase text-center cursor-pointer duration-300 ${
                      formData.mode === 'in-person' 
                        ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold font-medium' 
                        : 'border-white/10 bg-black/40 text-zinc-500 hover:text-white'
                    }`}
                  >
                    IN-PERSON VIP VISIT
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mode: 'digital' })}
                    className={`py-3 px-4 border rounded font-mono text-xs tracking-widest uppercase text-center cursor-pointer duration-300 ${
                      formData.mode === 'digital' 
                        ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold font-medium' 
                        : 'border-white/10 bg-black/40 text-zinc-500 hover:text-white'
                    }`}
                  >
                    DIGITAL VIDEO WALKTHROUGH
                  </button>
                </div>

                {/* Main 2-column input grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[9px] tracking-widest text-[#8E929A] uppercase">Full Legal Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sterling Hunt"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 py-3 pl-10 pr-4 rounded text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-luxury-gold"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[9px] tracking-widest text-[#8E929A] uppercase">Confidential Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. sterling@huntportfolio.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 py-3 pl-10 pr-4 rounded text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-luxury-gold"
                      />
                    </div>
                  </div>

                  {/* Telephone */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[9px] tracking-widest text-[#8E929A] uppercase">Secure Telephone Line</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +1 (555) 0192-321"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 py-3 pl-10 pr-4 rounded text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-luxury-gold"
                      />
                    </div>
                  </div>

                  {/* Lot selection dropdown */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[9px] tracking-widest text-[#8E929A] uppercase">Penthouse Residence Suite</label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                      <select
                        value={formData.lotSelection}
                        onChange={(e) => setFormData({ ...formData, lotSelection: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 py-3 pl-10 pr-4 rounded text-sm text-white focus:outline-none focus:border-luxury-gold appearance-none cursor-pointer"
                      >
                        {PENTHOUSE_LOTS.map(lot => (
                          <option key={lot.id} value={lot.lotNumber} className="bg-[#0e1012] text-white">
                            {lot.lotNumber} ({lot.name} - {lot.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Viewing Date */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[9px] tracking-widest text-[#8E929A] uppercase">Registry Visit Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                      <input
                        type="date"
                        required
                        value={formData.viewingDate}
                        onChange={(e) => setFormData({ ...formData, viewingDate: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 py-3 pl-10 pr-4 rounded text-sm text-white focus:outline-none focus:border-luxury-gold cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Viewing Time */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[9px] tracking-widest text-[#8E929A] uppercase">Preferable Slot</label>
                    <div className="relative">
                      <select
                        value={formData.viewingTime}
                        onChange={(e) => setFormData({ ...formData, viewingTime: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 py-3 px-4 rounded text-sm text-white focus:outline-none focus:border-luxury-gold appearance-none cursor-pointer"
                      >
                        <option value="10:00" className="bg-[#0e1012] text-white">10:00 AM - MORNING VISUALS</option>
                        <option value="14:00" className="bg-[#0e1012] text-white">14:00 PM - HELI CONCIERGE SLOT</option>
                        <option value="17:00" className="bg-[#0e1012] text-white">17:00 PM - ACTIVE SUNSET HOURS</option>
                        <option value="20:00" className="bg-[#0e1012] text-white">20:00 PM - TWILIGHT SKYLINE OVERLOOK</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Special Requests */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] tracking-widest text-[#8E929A] uppercase">Specific Concierge requests (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Champagne preference, transport requests (helipad), or confidentiality parameters required."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 py-3 px-4 rounded text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-luxury-gold resize-none"
                  />
                </div>

                {/* Disclaimer Footnote info */}
                <p className="font-sans text-[10px] text-zinc-600 leading-relaxed italic select-none">
                  By clicking below, you acknowledge Zorge 9 Penthouses implements real biometric and estate clearance. Any details provided will be held under high-security guidelines in local client storage and deleted after view options close.
                </p>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-hover-label="VERIFY_PASS"
                  className="w-full font-sans text-sm tracking-widest uppercase py-4 bg-luxury-gold text-black hover:bg-luxury-gold-light font-medium transition-all duration-300 rounded shadow-[0_0_15px_rgba(212,175,55,0.15)] flex justify-center items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping" />
                      REGISTERING DIGITAL CRYPTO ACCESS SHAFT...
                    </span>
                  ) : (
                    <span>GENERATE VIP VERIFIED PASS</span>
                  )}
                </button>

              </form>
            </motion.div>
          ) : (
            
            /* SENSATIONAL PHYSICAL ACCESS TOUR PASS VOUCHER CARD! */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Outer voucher boarding container */}
              <div className="w-full bg-[#111215] border border-luxury-gold/30 rounded-xl overflow-hidden shadow-[0_0_35px_rgba(212,175,55,0.08)] flex flex-col relative p-6 md:p-8 max-w-2xl font-sans text-white">
                
                {/* Champagne luxury gold trim framing */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold" />
                
                {/* Pass header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-5">
                  <div className="flex flex-col">
                    <span className="font-serif tracking-[0.2em] text-md text-white uppercase font-bold">
                      ZORGE 9 ESTATE
                    </span>
                    <span className="font-mono text-[8px] text-luxury-gold tracking-widest uppercase">
                      VERIFIED RECONSTRUCTION REGISTRY
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="bg-luxury-gold/10 text-luxury-gold text-[9px] font-mono tracking-widest py-1 px-3 rounded border border-luxury-gold/20 font-bold uppercase">
                      VIP CONFIRMED
                    </span>
                    <span className="font-mono text-[9px] text-zinc-600 mt-1">PASS CODE: {bookingPass.code}</span>
                  </div>
                </div>

                {/* Ticket main slots */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 py-8 border-b border-dashed border-zinc-800">
                  
                  <div>
                    <span className="font-mono text-[9px] text-zinc-500 uppercase block">HOLDER REPRESENTATIVE</span>
                    <span className="font-serif text-lg font-light text-white">{bookingPass.fullName}</span>
                  </div>
                  
                  <div>
                    <span className="font-mono text-[9px] text-zinc-500 uppercase block">LOT SPEC ZONE</span>
                    <span className="font-serif text-lg font-light text-luxury-gold">{bookingPass.lot} UNIT</span>
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-zinc-500 uppercase block">RESERVATION DATE &amp; SLOT</span>
                    <span className="font-sans text-sm text-zinc-300 font-medium">{bookingPass.date} AT {bookingPass.time}</span>
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-zinc-500 uppercase block">WALKTHROUGH TYPE</span>
                    <span className="font-sans text-sm text-zinc-300 font-medium uppercase">{bookingPass.mode === 'in-person' ? '🏛️ PHYSICAL PRIVATE LIFT' : '📹 ENCRYPTED STREAM LINK'}</span>
                  </div>

                </div>

                {/* Voucher Bottom Sector with QR Code placeholder and credentials */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-6">
                  
                  <div className="flex flex-col gap-1.5 items-center sm:items-start text-center sm:text-left">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold uppercase">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Registry Option Locked
                    </div>
                    <p className="text-[10px] text-zinc-500 max-w-sm">
                      Present this generated pass card directly to the helipad lift master or provide the cryptographic serial key to the private concierge panel for secure routing. We have dispatched a formal letter to <strong>{bookingPass.email}</strong>.
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-1 bg-black p-3 rounded border border-white/10">
                    <QrCode className="w-16 h-16 text-luxury-gold-light" />
                    <span className="font-mono text-[8px] text-zinc-500 tracking-[0.1em]">KEY: {bookingPass.hash.slice(0, 10)}</span>
                  </div>

                </div>

              </div>

              {/* Reset to request another schedule */}
              <div className="flex gap-4">
                <button
                  onClick={() => setBookingPass(null)}
                  data-hover-label="BOOK_MORE"
                  className="font-mono text-xs tracking-widest text-zinc-500 hover:text-white uppercase py-2 px-4 transition-colors"
                >
                  Create Another Access Option
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="font-mono text-xs tracking-widest text-[#D4AF37] hover:text-white uppercase py-2 px-4 transition-colors"
                  >
                    Return to Blueprint
                  </button>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
