import { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { FileSpreadsheet, Mail, Database, FileText, LayoutDashboard, MessageSquare, PieChart, FolderOpen, Calendar, Briefcase } from 'lucide-react';
import { BreathingGrid } from '../effects/BreathingGrid';
import { Logo } from '../ui/Logo';

gsap.registerPlugin(ScrollTrigger);

const ICONS = [FileSpreadsheet, Mail, Database, FileText, LayoutDashboard, MessageSquare, PieChart, FolderOpen, Calendar, Briefcase];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);
  const magneticRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerIconsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const centeredLogoRef = useRef<HTMLDivElement>(null);

  const scatterPositions = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return ICONS.map((_, i) => {
      const angle = (i / ICONS.length) * Math.PI * 2;
      const rx = isMobile ? (25 + Math.random() * 10) : (35 + Math.random() * 15); // Reduced for mobile
      const ry = isMobile ? (20 + Math.random() * 10) : (30 + Math.random() * 15); // Reduced for mobile
      return {
        x: Math.cos(angle) * rx,
        y: Math.sin(angle) * ry,
        rotation: Math.random() * 180 - 90
      };
    });
  }, []);

  const idleTweens = useRef<gsap.core.Tween[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Magnetic Repel Logic - Only for Desktop
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const { clientX, clientY } = e;

      magneticRefs.current.forEach((ref) => {
        if (!ref) return;

        const rect = ref.getBoundingClientRect();
        const iconX = rect.left + rect.width / 2;
        const iconY = rect.top + rect.height / 2;

        const dist = Math.hypot(clientX - iconX, clientY - iconY);
        const threshold = 150;

        if (dist < threshold) {
          const angle = Math.atan2(iconY - clientY, iconX - clientX);
          const force = (threshold - dist) / threshold;
          const moveX = Math.cos(angle) * force * 35;
          const moveY = Math.sin(angle) * force * 35;

          gsap.to(ref, {
            x: moveX,
            y: moveY,
            duration: 0.8,
            ease: "power2.out"
          });
        } else {
          gsap.to(ref, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Idle animation for floating icons
    innerIconsRef.current.forEach((icon, i) => {
      if (!icon) return;
      const isMobile = window.innerWidth < 768;
      const tween = gsap.to(icon, {
        y: isMobile ? 8 : 15,
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
        end: "+=150%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        refreshPriority: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          idleTweens.current.forEach(tween => {
            tween.timeScale(Math.max(0, 1 - progress * 2));
          });

          if (progress > 0.1) {
            magneticRefs.current.forEach(ref => {
              if (ref) gsap.to(ref, { x: 0, y: 0, duration: 0.3 });
            });
          }
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

    // Phase 1: Icons converge
    iconsRef.current.forEach((icon, i) => {
      if (!icon) return;
      const pos = scatterPositions[i];
      const isMobile = window.innerWidth < 768;
      gsap.set(icon, {
        x: isMobile ? `${pos.x * 1.5}vw` : `${pos.x}vw`,
        y: isMobile ? `${pos.y * 1.5}vh` : `${pos.y}vh`,
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

    // Logo Formation
    const sharedObj = centeredLogoRef.current;
    if (sharedObj) {
      const paths = sharedObj.querySelectorAll('path');
      tl.set([...Array.from(paths)], { opacity: 0 }, 0);

      paths.forEach((path, i) => {
        if (i === 2) return;
        const p = path as SVGPathElement;
        const length = p.getTotalLength();

        tl.set(p, {
          strokeDasharray: length,
          strokeDashoffset: length,
          stroke: 'currentColor',
          strokeWidth: 2,
          fillOpacity: 0,
          opacity: 1
        }, 0.1);

        tl.to(p, {
          strokeDashoffset: 0,
          duration: 0.5,
          ease: "power1.inOut"
        }, 0.1 + (i * 0.05));

        tl.to(p, {
          fillOpacity: 1,
          strokeWidth: 0,
          duration: 0.3,
          ease: "power1.out"
        }, 0.4 + (i * 0.05));
      });

      const trianglePath = paths[2];
      if (trianglePath) {
        tl.fromTo(trianglePath,
          { opacity: 0, x: -15, y: 15 },
          { opacity: 1, x: 0, y: 0, duration: 0.4, ease: "back.out(1.5)" },
          0.5
        );
      }
    }

    // Phase 2: Text appears
    tl.fromTo(textRef.current,
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power2.out" },
      0.6
    );

    // Phase 3: Text stays visible but scrolls up
    tl.to(textRef.current, {
      y: -20,
      scale: 1.02,
      duration: 0.8,
      ease: "power2.out"
    }, 1.3);

    tl.to({}, { duration: 1.5 }, 1.7);
    tl.addLabel("end");

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-transparent overflow-hidden flex items-center justify-center">
      <BreathingGrid />

      <div ref={questionRef} className="absolute z-30 text-center px-6">
        <h2 className="text-[#8892B0] font-display font-light text-xl md:text-3xl tracking-[0.2em] uppercase max-w-2xl">
          Tired of manual work holding you back?
        </h2>
      </div>

      <div className="absolute inset-0 pointer-events-none flex justify-center pt-[40vh]">
        <div className="relative">
          {ICONS.map((Icon, i) => (
            <div
              key={i}
              ref={el => { iconsRef.current[i] = el; }}
              className="absolute text-[#8892B0] will-change-transform"
            >
              <div ref={el => { magneticRefs.current[i] = el; }}>
                <div ref={el => { innerIconsRef.current[i] = el; }}>
                  <Icon size={24} className="md:w-8 md:h-8" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={centeredLogoRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] w-[100px] h-[100px] md:w-[180px] md:h-[180px] pointer-events-none flex items-center justify-center -mt-[10vh]"
      >
        <Logo className="absolute w-full h-full text-[#F8F9FA]" />
      </div>

      <div ref={textRef} className="absolute z-50 flex flex-col items-center justify-center text-center opacity-0 top-[65%] left-1/2 -translate-x-1/2 w-full px-4">
        <h1 className="text-[#F8F9FA] font-display font-bold text-3xl md:text-6xl lg:text-7xl tracking-[0.1em] md:tracking-[0.15em] uppercase drop-shadow-lg leading-tight">
          Save 200k+ Minutes <br className="md:hidden" /> a Year
        </h1>
        <p className="text-[#8892B0] font-display font-light text-base md:text-xl lg:text-2xl mt-4 tracking-normal drop-shadow-md max-w-md md:max-w-none">
          We Build Stunning Platforms That Save Time and Make Money.
        </p>

        <div id="hero-scroll-anchor" className="mt-12 md:mt-16 flex flex-col items-center gap-3">
          <span className="text-[#8892B0]/50 font-sans font-bold tracking-[0.4em] uppercase text-[10px]">
            Scroll
          </span>
          <div id="hero-scroll-line" className="w-[1px] h-10 md:h-12 bg-gradient-to-b from-teal-500/50 to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-teal-500 animate-scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
