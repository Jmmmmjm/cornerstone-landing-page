import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    let outerX = mouseX;
    let outerY = mouseY;
    let innerX = mouseX;
    let innerY = mouseY;

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
      outerX += (mouseX - outerX) * 0.15;
      outerY += (mouseY - outerY) * 0.15;
      
      innerX += (mouseX - innerX) * 0.3;
      innerY += (mouseY - innerY) * 0.3;

      gsap.set(outer, { x: outerX, y: outerY });
      gsap.set(inner, { x: innerX, y: innerY });

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
      gsap.to(outerRef.current, { scale: 2, rotation: 45, duration: 0.3, ease: "back.out(1.5)" });
      gsap.to(innerRef.current, { opacity: 0, scale: 0, duration: 0.2 });
    } else {
      gsap.to(outerRef.current, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(1.5)" });
      gsap.to(innerRef.current, { opacity: 1, scale: 1, duration: 0.2 });
    }
  }, [isHovering]);

  return (
    <>
      <div 
        ref={outerRef} 
        className="fixed top-0 left-0 w-8 h-8 border border-[#64FFDA] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference" 
      />
      <div 
        ref={innerRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-[#64FFDA] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference" 
      />
    </>
  );
}
