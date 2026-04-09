import { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { FileSpreadsheet, Mail, Database, FileText, LayoutDashboard, MessageSquare, PieChart, FolderOpen, Calendar, Briefcase } from 'lucide-react';
import { WindowUI } from './WindowUI';
import { BreathingGrid } from './BreathingGrid';

gsap.registerPlugin(ScrollTrigger);

const ICONS = [FileSpreadsheet, Mail, Database, FileText, LayoutDashboard, MessageSquare, PieChart, FolderOpen, Calendar, Briefcase];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);
  const windowRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const scatterPositions = useMemo(() => {
    return ICONS.map((_, i) => {
      const angle = (i / ICONS.length) * Math.PI * 2;
      // Push to edges: use an ellipse
      const rx = 35 + Math.random() * 15; // vw
      const ry = 30 + Math.random() * 15; // vh
      return {
        x: Math.cos(angle) * rx,
        y: Math.sin(angle) * ry,
        rotation: Math.random() * 180 - 90
      };
    });
  }, []);

  const innerIconsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Idle animation
    innerIconsRef.current.forEach((icon, i) => {
      if (!icon) return;
      gsap.to(icon, {
        y: 15,
        rotation: 10,
        duration: 2 + (i % 3),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", // 3 viewport heights
        scrub: true,
        pin: true,
      }
    });

    // Phase 1: Icons converge
    iconsRef.current.forEach((icon, i) => {
      if (!icon) return;
      
      // Comet tail effect
      tl.to(icon, {
        filter: "drop-shadow(0px 0px 12px rgba(136, 146, 176, 0.8)) blur(1px)",
        duration: 0.1
      }, i * 0.02);

      tl.to(icon, {
        x: 0, // center
        y: 0, // center
        rotation: 0,
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: "power2.inOut"
      }, i * 0.02); // slight stagger
    });

    // Phase 2: Window frame appears
    tl.fromTo(windowRef.current, 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)" },
      0.6 // overlap with icon convergence
    );

    // Phase 3: Words appear
    tl.to(windowRef.current, { y: -80, duration: 0.5, ease: "power2.inOut" }, 1.2);
    tl.fromTo(textRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      1.2
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#0A192F] overflow-hidden flex items-center justify-center">
      
      <BreathingGrid />

      {/* Scattered Icons */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {ICONS.map((Icon, i) => {
          const pos = scatterPositions[i];
          return (
            <div
              key={i}
              ref={el => { iconsRef.current[i] = el; }}
              className="absolute text-[#8892B0]"
              style={{
                transform: `translate(${pos.x}vw, ${pos.y}vh) rotate(${pos.rotation}deg)`,
              }}
            >
              <div ref={el => { innerIconsRef.current[i] = el; }}>
                <Icon size={32} strokeWidth={1.5} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Window Frame */}
      <div ref={windowRef} className="absolute z-10 w-full max-w-3xl px-6 opacity-0 scale-0">
        <WindowUI className="w-full h-[400px]" buildAnimation={true} />
      </div>

      {/* Text Content */}
      <div ref={textRef} className="absolute z-20 flex flex-col items-center justify-center text-center opacity-0 mt-[450px]">
        <h1 className="text-[#F8F9FA] font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[0.15em] uppercase whitespace-nowrap drop-shadow-lg">
          Scale On Stability
        </h1>
        <p className="text-[#F8F9FA] font-display font-light text-lg md:text-xl lg:text-2xl mt-4 tracking-normal drop-shadow-md">
          The foundation for the next generation of builders.
        </p>
        <button className="mt-8 px-8 py-3 bg-[#F8F9FA] text-[#0A192F] font-sans font-medium rounded hover:bg-[#8892B0] transition-colors pointer-events-auto">
          Get Started
        </button>
      </div>

    </div>
  );
}
