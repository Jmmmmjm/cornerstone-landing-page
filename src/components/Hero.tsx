import { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { FileSpreadsheet, Mail, Database, FileText, LayoutDashboard, MessageSquare, PieChart, FolderOpen, Calendar, Briefcase } from 'lucide-react';
import { BreathingGrid } from './BreathingGrid';

gsap.registerPlugin(ScrollTrigger);

const ICONS = [FileSpreadsheet, Mail, Database, FileText, LayoutDashboard, MessageSquare, PieChart, FolderOpen, Calendar, Briefcase];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);

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
  const idleTweens = useRef<gsap.core.Tween[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Idle animation for floating icons
    innerIconsRef.current.forEach((icon, i) => {
      if (!icon) return;
      const tween = gsap.to(icon, {
        y: 15,
        rotation: 10,
        duration: 2 + (i % 3),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      idleTweens.current.push(tween);
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%", // Reduced from 200% to make the section feel faster
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // As we scroll, gradually stop the idle floating
          const progress = self.progress;
          idleTweens.current.forEach(tween => {
            tween.timeScale(Math.max(0, 1 - progress * 2));
          });
        }
      }
    });

    tl.addLabel("start");

    // Phase 0: Question fades out
    tl.to(questionRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.inOut"
    }, 0);

    // Phase 1: Icons converge and meet at center (logo position)
    iconsRef.current.forEach((icon, i) => {
      if (!icon) return;

      // Initial state to ensure they start from their scatter positions
      const pos = scatterPositions[i];
      gsap.set(icon, {
        x: `${pos.x}vw`,
        y: `${pos.y}vh`,
        xPercent: -50,
        yPercent: -50,
        rotation: pos.rotation
      });

      tl.to(icon, {
        filter: "drop-shadow(0px 0px 12px rgba(100, 255, 218, 0.8)) blur(2px)",
        duration: 0.1,
        overwrite: 'auto'
      }, i * 0.02);

      tl.to(icon, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 0.1,
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut"
      }, i * 0.02);
    });

    // Fade in and FORM the global shared logo AS icons merge
    // Icons finish merging around 0.8s, so we make logo fully done by then
    const sharedObj = document.getElementById('shared-global-object');
    if (sharedObj) {
      tl.set(sharedObj, { opacity: 1, scale: 1 }, 0.1);

      const paths = sharedObj.querySelectorAll('path');
      paths.forEach((path, i) => {
        const p = path as SVGPathElement;
        const length = p.getTotalLength();
        
        // Start drawing as icons fly in
        tl.set(p, { 
          strokeDasharray: length, 
          strokeDashoffset: length,
          stroke: '#F8F9FA',
          strokeWidth: 2,
          fill: 'rgba(248, 249, 250, 0)',
          opacity: 1 
        }, 0.1);

        // Draw the lines quickly to finish by the merge point
        tl.to(p, { 
          strokeDashoffset: 0, 
          duration: 0.5, 
          ease: "power1.inOut" 
        }, 0.1 + (i * 0.05));
        
        // Fade the fill in so it's solid by 0.8s
        tl.to(p, { 
          fill: 'rgba(248, 249, 250, 1)', 
          strokeWidth: 0, 
          duration: 0.3,
          ease: "power1.out"
        }, 0.4 + (i * 0.05));
      });

      // Triangle pops in at the very end of the merge
      const poly = sharedObj.querySelector('polygon');
      if (poly) {
        tl.fromTo(poly, 
          { opacity: 0, scale: 0 }, 
          { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.5)" }, 
          0.6
        );
      }
    }

    // Phase 2: Text appears below the fully formed logo
    tl.fromTo(textRef.current,
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power2.out" },
      0.6
    );

    // Phase 3: Text fades out, THEN the logo morphs into the line
    tl.to(textRef.current, {
      opacity: 0,
      y: 30,
      scale: 1.05,
      duration: 0.4,
      ease: "power2.in"
    }, 1.3);

    // Increase dummy duration significantly to delay the start of the morphing in App.tsx
    // Total duration becomes 3.2. Title finishes fading at 1.7.
    // 1.7 / 3.2 = ~53% of the pin progress.
    tl.to({}, { duration: 1.5 }, 1.7);

    tl.addLabel("end");

  }, { scope: containerRef });

  return (
    <section ref={containerRef} data-hero data-scroll-anim className="relative w-full h-screen bg-[#0A192F] overflow-hidden flex items-center justify-center">
      
      <BreathingGrid />

      {/* Initial Question */}
      <div 
        ref={questionRef}
        className="absolute z-30 text-center px-6"
      >
        <h2 className="text-[#8892B0] font-display font-light text-2xl md:text-4xl tracking-[0.2em] uppercase">
          Are you ready to scale?
        </h2>
      </div>

      {/* Scattered Icons */}
      <div className="absolute inset-0 pointer-events-none flex justify-center pt-[40vh]">
        <div className="relative">
          {ICONS.map((Icon, i) => {
            return (
              <div
                key={i}
                ref={el => { iconsRef.current[i] = el; }}
                className="absolute text-[#8892B0] will-change-transform"
              >
                <div ref={el => { innerIconsRef.current[i] = el; }}>
                  <Icon size={32} strokeWidth={1.5} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Window is now handled by App.tsx sharedWindowRef */}

      {/* Text Content - Positioned lower (top: 60%) */}
      <div ref={textRef} className="absolute z-50 flex flex-col items-center justify-center text-center opacity-0 top-[60%] left-1/2 -translate-x-1/2">
        <h1 className="text-[#F8F9FA] font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[0.15em] uppercase whitespace-nowrap drop-shadow-lg">
          Cornerstone
        </h1>
        <p className="text-[#F8F9FA] font-display font-light text-lg md:text-xl lg:text-2xl mt-4 tracking-normal drop-shadow-md">
          Scale On Stability
        </p>
        <button className="mt-8 px-8 py-3 bg-[#F8F9FA] text-[#0A192F] font-sans font-medium rounded hover:bg-[#8892B0] transition-colors pointer-events-auto">
          Get Started
        </button>
      </div>

    </section>
  );
}
