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
        start: "top 85%",
      }
    });

    tl.fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1, ease: "power2.inOut" }
    );
    
    tl.fromTo(shapeRef.current,
      { rotation: 0, scale: 0, opacity: 0 },
      { rotation: 90, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" },
      "-=0.5"
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full h-px relative flex items-center justify-center my-12 z-20">
      <div ref={lineRef} className="absolute w-full h-px bg-[#8892B0]/20 origin-center" />
      <div ref={shapeRef} className="absolute w-3 h-3 border border-[#8892B0]/50 bg-[#0A192F]" />
    </div>
  );
}
