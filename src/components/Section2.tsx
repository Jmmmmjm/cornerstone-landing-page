import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { LiveWindowUIOverlay } from './LiveWindowUIOverlay';
import { LegacyUI } from './LegacyUI';
import { Reveal } from './Reveal';
import { WindowUI } from './WindowUI';

export function Section2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const legacyLayerRef = useRef<HTMLDivElement>(null);
  const newWorldRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Timeline for the slider and content reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%",
        scrub: 1,
        pin: true,
      }
    });

    tl.addLabel("start");

    // Phase 1: Content fades in only after the line is in place (handled by global scroll)
    // We assume the line arrives at top: 50%, left: 50% when Section 2 starts.
    tl.fromTo(contentWrapperRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      0
    );

    // Phase 2: Slider starts at 50% and moves to 0% (revealing the window)
    tl.fromTo(legacyLayerRef.current, 
      { clipPath: 'inset(0% 50% 0% 0%)' },
      { clipPath: 'inset(0% 100% 0% 0%)', duration: 2, ease: "none" },
      0.5
    );

    // Copy appears
    tl.fromTo(copyRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      1.5
    );

    // Special: Move the global shared object (the line) along with the clipPath
    const sharedObject = document.getElementById('shared-global-object');
    if (sharedObject) {
      tl.fromTo(sharedObject, 
        { left: '50%' },
        { left: '0%', duration: 2, ease: "none" },
        0.5
      );
    }

    tl.addLabel("end");

    // Cleanup: Fade out shared object when leaving
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "bottom top",
      onEnter: () => {
        const obj = document.getElementById('shared-global-object');
        if (obj) gsap.to(obj, { opacity: 0, duration: 0.3 });
      },
      onLeaveBack: () => {
        const obj = document.getElementById('shared-global-object');
        if (obj) gsap.to(obj, { opacity: 1, duration: 0.3 });
      },
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-transparent overflow-hidden z-[10]">
      
      <div ref={contentWrapperRef} className="absolute inset-0 opacity-0">
        
        {/* New World (After) - The background and the WindowUI */}
        <div 
          ref={newWorldRef} 
          className="absolute inset-0 w-full h-full bg-[#0A192F] z-0"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-7xl px-6 md:px-12">
               <WindowUI className="w-full h-[500px]" />
            </div>
          </div>
          <div className="absolute top-8 right-8 text-[#8892B0] font-sans text-sm tracking-widest uppercase z-10">
            With Cornerstone
          </div>
        </div>

        {/* Old World (Before) - Clipped by the slider */}
        <div ref={legacyLayerRef} className="absolute inset-0 w-full h-full z-[45]">
          <LegacyUI />
          <div className="absolute top-8 left-8 text-[#8892B0] font-sans text-sm tracking-widest uppercase z-[46]">
            Before Cornerstone
          </div>
        </div>

        {/* Copy */}
        <div 
          ref={copyRef}
          className="absolute bottom-12 left-0 right-0 flex flex-col items-center text-center z-[60] opacity-0 pointer-events-none"
        >
          <Reveal delay={0}>
            <h2 className="text-[#F8F9FA] font-display font-medium text-3xl md:text-4xl tracking-wide">
              One platform. Every workflow.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[#8892B0] font-sans text-lg mt-2">
              Cornerstone replaces the stack you've been managing around.
            </p>
          </Reveal>
        </div>
      </div>

    </section>
  );
}
