import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CustomCanvasUI() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const cursor = containerRef.current.querySelector('.blinking-cursor');
    const shapes = containerRef.current.querySelectorAll('.custom-shape');
    
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    
    // Cursor blinks
    tl.to(cursor, { opacity: 0, duration: 0.1, repeat: 5, yoyo: true });
    
    // Shapes draw in
    tl.fromTo(shapes, 
      { scale: 0, opacity: 0, rotation: -45 }, 
      { scale: 1, opacity: 1, rotation: 0, duration: 0.5, stagger: 0.3, ease: "back.out(1.5)" }
    );
    
    // Cursor moves around
    tl.to(cursor, { x: 100, y: 20, duration: 0.5, ease: "power2.inOut" }, "-=1");
    tl.to(cursor, { x: 50, y: 60, duration: 0.5, ease: "power2.inOut" }, "-=0.5");
    
    // Fade out to loop
    tl.to(shapes, { opacity: 0, duration: 0.5, delay: 1 });
    tl.to(cursor, { x: 0, y: 0, duration: 0.5 }, "-=0.5");

  }, []);

  return (
    <div ref={containerRef} className="w-full h-32 bg-white dark:bg-[#0A192F] rounded-none border border-slate-300 dark:border-[#8892B0]/20 mb-6 flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 p-4">
        <div className="blinking-cursor w-2 h-4 bg-teal-500 dark:bg-[#64FFDA] absolute top-4 left-4"></div>
        
        <div className="custom-shape absolute top-6 left-12 w-16 h-16 border-2 border-slate-300 dark:border-[#8892B0] rounded-none"></div>
        <div className="custom-shape absolute top-12 left-32 w-12 h-12 border-2 border-teal-500 dark:border-[#64FFDA] rounded-none"></div>
        <div className="custom-shape absolute top-4 left-48 w-20 h-8 border-2 border-slate-300 dark:border-[#8892B0] rounded-none"></div>
      </div>
    </div>
  );
}
