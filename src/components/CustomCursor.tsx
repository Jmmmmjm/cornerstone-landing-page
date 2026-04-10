import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const tipRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const tip = tipRef.current;
    const mid = midRef.current;
    const bot = botRef.current;
    if (!tip || !mid || !bot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    let tipX = mouseX;
    let tipY = mouseY;
    let midX = mouseX;
    let midY = mouseY;
    let botX = mouseX;
    let botY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mouseover', handleMouseOver);

    let animationFrameId: number;
    const render = () => {
      // The tip of the logo locks tightly to the mouse
      tipX += (mouseX - tipX) * 0.8;
      tipY += (mouseY - tipY) * 0.8;
      
      // The middle magnetically trails behind
      midX += (mouseX - midX) * 0.55;
      midY += (mouseY - midY) * 0.55;

      // The bottom magnetically trails furthest behind
      botX += (mouseX - botX) * 0.35;
      botY += (mouseY - botY) * 0.35;

      gsap.set(tip, { x: tipX, y: tipY });
      gsap.set(mid, { x: midX, y: midY });
      gsap.set(bot, { x: botX, y: botY });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (isHovering) {
      gsap.to([botRef.current, midRef.current, tipRef.current], { 
        scale: 1.25, 
        duration: 0.4, 
        ease: "back.out(2)",
        stagger: 0.05
      });
    } else {
      gsap.to([botRef.current, midRef.current, tipRef.current], { 
        scale: 1, 
        duration: 0.4, 
        ease: "back.out(1.5)",
        stagger: 0.02
      });
    }
  }, [isHovering]);

  return (
    <>
      <div 
        ref={botRef} 
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9997] drop-shadow-sm origin-top-left"
      >
         <svg className="w-full h-full" style={{ transform: 'rotate(-75deg)' }} viewBox="0 0 100 100">
           <path d="M 0 60 H 40 V 100 Z" fill="currentColor" className="text-slate-400 dark:text-[#8892B0]" />
         </svg>
      </div>

      <div 
        ref={midRef} 
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9998] drop-shadow-sm origin-top-left"
      >
         <svg className="w-full h-full" style={{ transform: 'rotate(-75deg)' }} viewBox="0 0 100 100">
           <path d="M 0 30 H 70 V 100 H 50 V 50 H 0 Z" fill="currentColor" className="text-[#0A192F] dark:text-[#F8F9FA]" />
         </svg>
      </div>

      <div 
        ref={tipRef} 
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] drop-shadow-md origin-top-left"
      >
         <svg className="w-full h-full" style={{ transform: 'rotate(-75deg)' }} viewBox="0 0 100 100">
           <path d="M 0 0 H 100 V 100 H 80 V 20 H 0 Z" fill="currentColor" className="text-[#0A192F] dark:text-[#F8F9FA]" />
         </svg>
      </div>
    </>
  );
}
