import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X, ChevronLeft, ChevronRight, Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// TODO: Replace with Google Calendar API integration
// const CALENDAR_URL =
//   'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2eEOUtyaVnNrgyCwVj_5zBnmIYLxtjY1xfkc8nQA_S3CvSQfvzaGxkmkdVg7A6LZuhULIgg9gC';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM',
];

// TODO: Fetch real busy slots from Google Calendar freeBusy API
const MOCK_BUSY_SLOTS: string[] = ['10:00 AM', '2:00 PM'];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

function isWeekend(year: number, month: number, day: number) {
  const d = new Date(year, month, day).getDay();
  return d === 0 || d === 6;
}

function isPast(year: number, month: number, day: number) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(year, month, day) < today;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const isAnimatingOut = useRef(false);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<FormData>({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      isAnimatingOut.current = false;
      setStep(1);
      setSelectedDate(null);
      setSelectedSlot(null);
      setSubmitted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isMounted || !isOpen) return;
    document.body.classList.add('modal-open');
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      gsap.fromTo(containerRef.current,
        { opacity: 0, scale: 0.96, y: 30, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out', delay: 0.1 }
      );
    });
    return () => ctx.revert();
  }, [isMounted, isOpen]);

  const handleClose = () => {
    if (isAnimatingOut.current) return;
    isAnimatingOut.current = true;
    const tl = gsap.timeline({ onComplete: () => { document.body.classList.remove('modal-open'); setIsMounted(false); onClose(); } });
    tl.to(containerRef.current, { opacity: 0, scale: 0.96, y: 20, filter: 'blur(8px)', duration: 0.35, ease: 'power2.in' });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' }, '-=0.15');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isMounted) handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMounted]);

  const calDays = getCalendarDays(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelectedDate(null); setSelectedSlot(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    setSelectedDate(null); setSelectedSlot(null);
  };

  const handleDayClick = (day: number) => {
    if (isPast(viewYear, viewMonth, day) || isWeekend(viewYear, viewMonth, day)) return;
    setSelectedDate(day);
    setSelectedSlot(null);
    setStep(2);
  };

  const handleSlotClick = (slot: string) => {
    if (MOCK_BUSY_SLOTS.includes(slot)) return;
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call Google Calendar API events.insert here
    setSubmitted(true);
    setStep(4);
  };

  const selectedDateStr = selectedDate
    ? `${MONTHS[viewMonth]} ${selectedDate}, ${viewYear}`
    : '';

  if (!isMounted) return null;
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const stepLabels = ['Date', 'Time', 'Details', 'Confirm'];

  return createPortal(
    <div
      ref={overlayRef}
      onMouseDown={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0A192F]/85 backdrop-blur-xl p-4 md:p-6"
    >
      <div
        ref={containerRef}
        onMouseDown={(e) => e.stopPropagation()}
        data-lenis-prevent
        className="relative w-full max-w-4xl bg-[#0A192F] border border-[#8892B0]/20 shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
        style={{ maxHeight: '92vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-[#8892B0]/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 bg-[#64FFDA] shadow-[0_0_10px_#64FFDA]" />
              <div className="absolute inset-0 w-2 h-2 bg-[#64FFDA] animate-ping opacity-40" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8892B0]">
              Booking_Interface · Discovery Call
            </span>
          </div>
          <button
            onClick={handleClose}
            className="group w-9 h-9 flex items-center justify-center border border-[#8892B0]/20 hover:border-[#64FFDA]/40 transition-colors"
          >
            <X size={14} className="text-[#8892B0] group-hover:text-[#64FFDA] transition-colors" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 md:px-10 py-4 border-b border-[#8892B0]/10 shrink-0">
          <div className="flex items-center gap-0">
            {stepLabels.map((label, i) => {
              const stepNum = (i + 1) as 1 | 2 | 3 | 4;
              const isActive = step === stepNum;
              const isDone = step > stepNum;
              return (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${isDone ? 'bg-[#64FFDA] text-[#0A192F]' : isActive ? 'border border-[#64FFDA] text-[#64FFDA]' : 'border border-[#8892B0]/20 text-[#8892B0]/40'}`}>
                      {isDone ? '✓' : i + 1}
                    </div>
                    <span className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${isActive ? 'text-[#64FFDA]' : isDone ? 'text-[#64FFDA]/60' : 'text-[#8892B0]/30'}`}>{label}</span>
                  </div>
                  {i < 3 && (
                    <div className={`flex-1 h-px mx-2 mb-4 transition-colors duration-500 ${isDone ? 'bg-[#64FFDA]/40' : 'bg-[#8892B0]/10'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* STEP 1: Date Picker */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="p-6 md:p-10"
              >
                <div className="flex items-center gap-3 mb-8">
                  <Calendar size={18} className="text-[#64FFDA]" />
                  <h2 className="text-[#F8F9FA] font-display font-bold text-xl md:text-2xl tracking-tight">Select a date</h2>
                </div>

                <div className="max-w-sm mx-auto">
                  {/* Month Nav */}
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center border border-[#8892B0]/20 hover:border-[#64FFDA]/40 text-[#8892B0] hover:text-[#64FFDA] transition-colors">
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[#F8F9FA] font-bold font-display text-sm tracking-wider uppercase">
                      {MONTHS[viewMonth]} {viewYear}
                    </span>
                    <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center border border-[#8892B0]/20 hover:border-[#64FFDA]/40 text-[#8892B0] hover:text-[#64FFDA] transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 mb-2">
                    {DAYS.map(d => (
                      <div key={d} className="text-center text-[9px] font-bold uppercase tracking-widest text-[#8892B0]/40 py-1">{d}</div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calDays.map((day, i) => {
                      if (!day) return <div key={i} />;
                      const past = isPast(viewYear, viewMonth, day);
                      const weekend = isWeekend(viewYear, viewMonth, day);
                      const disabled = past || weekend;
                      const isSelected = selectedDate === day;
                      const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                      return (
                        <button
                          key={i}
                          onClick={() => !disabled && handleDayClick(day)}
                          disabled={disabled}
                          className={`aspect-square flex items-center justify-center text-xs font-bold transition-all duration-200 
                            ${isSelected ? 'bg-[#64FFDA] text-[#0A192F]' : ''}
                            ${isToday && !isSelected ? 'border border-[#64FFDA]/60 text-[#64FFDA]' : ''}
                            ${disabled ? 'text-[#8892B0]/20 cursor-not-allowed' : !isSelected ? 'text-[#CCD6F6] hover:bg-[#64FFDA]/10 hover:text-[#64FFDA]' : ''}
                          `}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-center text-[9px] text-[#8892B0]/40 uppercase tracking-widest mt-6 font-bold">
                    Mon – Fri · 9:00 AM – 5:00 PM PHT
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Time Slots */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="p-6 md:p-10"
              >
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[#8892B0] hover:text-[#64FFDA] transition-colors mb-6 text-xs font-bold uppercase tracking-widest">
                  <ChevronLeft size={14} /> Back
                </button>

                <div className="flex items-center gap-3 mb-2">
                  <Clock size={18} className="text-[#64FFDA]" />
                  <h2 className="text-[#F8F9FA] font-display font-bold text-xl md:text-2xl tracking-tight">Select a time</h2>
                </div>
                <p className="text-[#8892B0] text-sm mb-8 ml-9">{selectedDateStr} · 30 min · PHT (UTC+8)</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-xl mx-auto">
                  {TIME_SLOTS.map(slot => {
                    const busy = MOCK_BUSY_SLOTS.includes(slot);
                    const chosen = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => !busy && handleSlotClick(slot)}
                        disabled={busy}
                        className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border transition-all duration-200
                          ${chosen ? 'bg-[#64FFDA] border-[#64FFDA] text-[#0A192F]' : ''}
                          ${busy ? 'border-[#8892B0]/10 text-[#8892B0]/20 cursor-not-allowed line-through' : !chosen ? 'border-[#8892B0]/20 text-[#CCD6F6] hover:border-[#64FFDA]/50 hover:text-[#64FFDA]' : ''}
                        `}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>

                <p className="text-center text-[9px] text-[#8892B0]/30 uppercase tracking-widest mt-8 font-bold">
                  Greyed slots are unavailable
                </p>
              </motion.div>
            )}

            {/* STEP 3: Contact Form */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="p-6 md:p-10"
              >
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-[#8892B0] hover:text-[#64FFDA] transition-colors mb-6 text-xs font-bold uppercase tracking-widest">
                  <ChevronLeft size={14} /> Back
                </button>

                <div className="flex items-center gap-3 mb-2">
                  <User size={18} className="text-[#64FFDA]" />
                  <h2 className="text-[#F8F9FA] font-display font-bold text-xl md:text-2xl tracking-tight">Your details</h2>
                </div>

                <div className="flex items-center gap-3 mb-8 ml-9 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#64FFDA]/60 bg-[#64FFDA]/5 border border-[#64FFDA]/20 px-3 py-1">{selectedDateStr}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#64FFDA]/60 bg-[#64FFDA]/5 border border-[#64FFDA]/20 px-3 py-1">{selectedSlot}</span>
                </div>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                  {[
                    { field: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Juan dela Cruz' },
                    { field: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'juan@company.com' },
                    { field: 'company', label: 'Company / Organization', type: 'text', required: false, placeholder: 'Acme Corp (optional)' },
                  ].map(({ field, label, type, required, placeholder }) => (
                    <div key={field}>
                      <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-[#8892B0] mb-2">
                        {label}{required && <span className="text-[#64FFDA] ml-1">*</span>}
                      </label>
                      <input
                        type={type}
                        required={required}
                        placeholder={placeholder}
                        value={form[field as keyof FormData]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        className="w-full bg-[#112240] border border-[#8892B0]/20 text-[#F8F9FA] text-sm px-4 py-3 placeholder:text-[#8892B0]/30 focus:outline-none focus:border-[#64FFDA]/50 transition-colors font-sans"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-[#8892B0] mb-2">
                      What would you like to discuss?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brief overview of your workflow challenges..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full bg-[#112240] border border-[#8892B0]/20 text-[#F8F9FA] text-sm px-4 py-3 placeholder:text-[#8892B0]/30 focus:outline-none focus:border-[#64FFDA]/50 transition-colors resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#64FFDA] text-[#0A192F] font-bold text-xs uppercase tracking-[0.25em] hover:bg-[#4dffcc] transition-colors duration-200 mt-2"
                  >
                    Confirm Booking
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: Confirmation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="p-10 md:p-16 flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-16 h-16 bg-[#64FFDA]/10 border border-[#64FFDA]/30 flex items-center justify-center mb-8"
                >
                  <CheckCircle size={32} className="text-[#64FFDA]" />
                </motion.div>

                <h2 className="text-[#F8F9FA] font-display font-bold text-2xl md:text-3xl tracking-tight mb-3">
                  You're booked.
                </h2>
                <p className="text-[#8892B0] text-sm mb-8 max-w-sm leading-relaxed">
                  We'll send a calendar invite to <span className="text-[#F8F9FA] font-bold">{form.email}</span>. See you on {selectedDateStr} at {selectedSlot}.
                </p>

                <div className="border border-[#64FFDA]/20 bg-[#64FFDA]/5 px-8 py-5 mb-10 text-left w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8892B0] uppercase tracking-widest font-bold">Date</span>
                    <span className="text-[#F8F9FA] font-bold">{selectedDateStr}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8892B0] uppercase tracking-widest font-bold">Time</span>
                    <span className="text-[#F8F9FA] font-bold">{selectedSlot} PHT</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8892B0] uppercase tracking-widest font-bold">Duration</span>
                    <span className="text-[#F8F9FA] font-bold">30 min</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8892B0] uppercase tracking-widest font-bold">Name</span>
                    <span className="text-[#F8F9FA] font-bold">{form.name}</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="px-8 py-3 border border-[#8892B0]/30 text-[#8892B0] hover:border-[#F8F9FA]/50 hover:text-[#F8F9FA] transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  Close
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-2 border-t border-[#8892B0]/10 flex justify-between items-center shrink-0">
          <span className="text-[8px] text-[#8892B0]/30 uppercase tracking-[0.2em] font-bold">System.Status: Active</span>
          <span className="text-[8px] text-[#8892B0]/30 uppercase tracking-[0.2em] font-bold">Encrypted_Layer_09</span>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
