import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { LiveWindowUI } from './LiveWindowUI';
import { LegacyUI } from './LegacyUI';
import { Reveal } from './Reveal';

export function Section2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const newWorldRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%", // 2 viewport heights
        scrub: true,
        pin: true,
      }
    });

    // Divider moves from 50% to 0%
    tl.to(dividerRef.current, { left: "0%", duration: 1 }, 0);
    
    // New World (Right) expands from 50% to 100% width
    // It starts clipped at 50% from the left: inset(0% 0% 0% 50%)
    // It ends fully visible: inset(0% 0% 0% 0%)
    tl.to(newWorldRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0);

    // Shatter legacy fragments
    const fragments = gsap.utils.toArray('.legacy-fragment');
    fragments.forEach((frag: any, i) => {
      tl.to(frag, {
        x: "-=150",
        y: (i % 2 === 0) ? "+=100" : "-=100",
        rotation: (i % 2 === 0) ? "-=45" : "+=45",
        opacity: 0,
        scale: 0.5,
        duration: 0.6,
        ease: "power2.in"
      }, 0.1 + (i * 0.15));
    });
    
    // Copy appears after split completes
    tl.fromTo(copyRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3 },
      1.1
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#0A192F] overflow-hidden">
      
      {/* Old World (Left) - Base layer */}
      <div className="absolute inset-0 w-full h-full">
        <LegacyUI />
        <div className="absolute top-8 left-8 text-[#8892B0] font-sans text-sm tracking-widest uppercase z-10">
          Before Cornerstone
        </div>
      </div>

      {/* New World (Right) - Top layer, initially clipped to right half */}
      <div 
        ref={newWorldRef} 
        className="absolute inset-0 w-full h-full bg-[#0A192F] z-10"
        style={{ clipPath: "inset(0% 0% 0% 50%)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <LiveWindowUI className="w-full max-w-5xl h-[600px]" />
        </div>
        <div className="absolute top-8 right-8 text-[#8892B0] font-sans text-sm tracking-widest uppercase z-10">
          With Cornerstone
        </div>
      </div>

      {/* Divider Line */}
      <div 
        ref={dividerRef}
        className="absolute top-0 bottom-0 w-[2px] bg-[#64FFDA] shadow-[0_0_15px_rgba(100,255,218,0.5)] z-20"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      />

      {/* Copy */}
      <div 
        ref={copyRef}
        className="absolute bottom-16 left-0 right-0 flex flex-col items-center text-center z-30 opacity-0 pointer-events-none"
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
  );
}
