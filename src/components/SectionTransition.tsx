import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

export function SectionTransition() {
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!lineRef.current || !containerRef.current || !shapeRef.current) return;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 95%",
      }
    });

    tl.fromTo(lineRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.inOut" }
    );
    
    tl.fromTo(shapeRef.current,
      { rotation: 0, scale: 0, opacity: 0 },
      { rotation: 45, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full relative flex items-center justify-center py-12 z-20">
      <div ref={lineRef} className="absolute w-full h-px bg-[#0A192F]/20 dark:bg-[#64FFDA]/40 origin-center" />
      <div ref={shapeRef} className="absolute w-2 h-2 border border-[#0A192F]/40 dark:border-[#64FFDA] bg-white dark:bg-[#0A192F] rotate-45" />
    </div>
  );
}
