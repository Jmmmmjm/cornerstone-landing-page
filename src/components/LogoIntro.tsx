import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function LogoIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const path3Ref = useRef<SVGPathElement>(null);
  const triangleRef = useRef<SVGPolygonElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.inOut",
          onComplete
        });
      }
    });

    tl.fromTo([path1Ref.current, path2Ref.current, path3Ref.current],
      { opacity: 0, x: -20, y: 20 },
      { opacity: 1, x: 0, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );

    tl.fromTo(triangleRef.current,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)", transformOrigin: "bottom left" },
      "-=0.3"
    );

    tl.to({}, { duration: 0.5 });

  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[10000] bg-[#0A192F] flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <path ref={path1Ref} d="M 0 0 H 100 V 100 H 80 V 20 H 0 Z" fill="#F8F9FA" />
        <path ref={path2Ref} d="M 0 30 H 70 V 100 H 50 V 50 H 0 Z" fill="#F8F9FA" />
        <path ref={path3Ref} d="M 0 60 H 40 V 100 H 20 V 80 H 0 Z" fill="#F8F9FA" />
        <polygon ref={triangleRef} points="0,100 20,100 0,80" fill="#64FFDA" />
      </svg>
    </div>
  );
}
