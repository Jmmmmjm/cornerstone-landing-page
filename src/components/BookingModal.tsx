import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X } from 'lucide-react';

const CALENDAR_URL =
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2eEOUtyaVnNrgyCwVj_5zBnmIYLxtjY1xfkc8nQA_S3CvSQfvzaGxkmkdVg7A6LZuhULIgg9gC';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeWrapperRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const isAnimatingOut = useRef(false);

  // Handle open → mount then animate in
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIframeLoaded(false);
      isAnimatingOut.current = false;
    }
  }, [isOpen]);

  // Animate in after mount
  useEffect(() => {
    if (!isMounted || !isOpen) return;

    // Lock body scroll and interactions
    document.body.classList.add('modal-open');

    const overlay = overlayRef.current;
    const container = containerRef.current;
    if (!overlay || !container) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.inOut' }
      );
      
      gsap.fromTo(
        container,
        { 
          opacity: 0, 
          scale: 0.95, 
          y: 40,
          filter: 'blur(10px)'
        },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          filter: 'blur(0px)',
          duration: 0.8, 
          ease: 'expo.out',
          delay: 0.1 
        }
      );

      gsap.fromTo(
        '.modal-header',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.4, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, [isMounted, isOpen]);

  // Animate out → then unmount
  const handleClose = () => {
    if (isAnimatingOut.current) return;
    isAnimatingOut.current = true;

    const overlay = overlayRef.current;
    const container = containerRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('modal-open');
        setIsMounted(false);
        onClose();
      },
    });

    if (container) {
      tl.to(container, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        filter: 'blur(10px)',
        duration: 0.4,
        ease: 'power2.in',
      });
    }
    if (overlay) {
      tl.to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.2');
    }
  };

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMounted) handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMounted]);

  // On mobile, open externally instead of iframe
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (!isMounted) return null;

  if (isMobile) {
    window.open(CALENDAR_URL, '_blank', 'noreferrer');
    handleClose();
    return null;
  }

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0A192F]/80 backdrop-blur-xl p-6 overflow-hidden"
      style={{ touchAction: 'none', pointerEvents: 'auto' }}
    >
      {/* Modal container */}
      <div
        ref={containerRef}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        className="relative w-[95vw] max-w-7xl h-[90vh] max-h-[900px] bg-brand-bg shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden pointer-events-auto"
      >
        {/* Technical Header */}
        <div className="modal-header flex items-center justify-between px-10 py-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-[#64FFDA] shadow-[0_0_10px_#64FFDA]" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#64FFDA] animate-ping opacity-40" />
            </div>
            <span className="font-display text-[10px] uppercase tracking-[0.3em] text-brand-accent">
              Terminal: Booking_Interface_v1.0.4
            </span>
          </div>

          <button
            onClick={handleClose}
            className="group relative w-10 h-10 flex items-center justify-center border border-[#64FFDA]/10 hover:border-[#64FFDA]/40 transition-colors duration-300"
          >
            <X size={16} className="text-brand-accent group-hover:text-[#64FFDA] transition-colors duration-300" />
            <div className="absolute inset-0 bg-[#64FFDA]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Iframe area */}
        <div ref={iframeWrapperRef} className="relative flex-1 overflow-hidden bg-[#0A192F] px-12 pb-10">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#0A192F] z-10">
               <div className="flex gap-2">
                 {[0, 1, 2].map((i) => (
                   <div 
                     key={i}
                     className="w-1 h-8 bg-[#64FFDA]/20 relative overflow-hidden"
                   >
                     <div 
                       className="absolute inset-0 bg-[#64FFDA] animate-[scroll-line_1.5s_infinite]"
                       style={{ animationDelay: `${i * 0.2}s` }}
                     />
                   </div>
                 ))}
               </div>
              <span className="font-display text-[9px] uppercase tracking-[0.4em] text-[#64FFDA]/40">
                Establishing Secure Connection...
              </span>
            </div>
          )}

          <iframe
            src={CALENDAR_URL}
            title="Book a Discovery Call with Cornerstone"
            allow="fullscreen"
            loading="lazy"
            onLoad={() => setIframeLoaded(true)}
            className={`w-full h-full border-none transition-all duration-700 ease-in-out ${
              iframeLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
            }`}
            style={{
              filter: 'invert(0.9) hue-rotate(180deg) brightness(1.1) contrast(1.1)',
              background: '#fff'
            }}
          />
          
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] opacity-20" />
        </div>
        
        {/* Footer Detail */}
        <div className="px-6 py-2 border-t border-[#64FFDA]/10 bg-[#0A192F]/50 flex justify-between items-center">
           <span className="text-[8px] text-brand-accent/30 uppercase tracking-[0.2em]">
             System.Status: Active
           </span>
           <span className="text-[8px] text-brand-accent/30 uppercase tracking-[0.2em]">
             Encrypted_Layer_09
           </span>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
