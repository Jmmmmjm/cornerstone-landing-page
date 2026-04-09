import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { WindowUI } from './WindowUI';
import { BarChart3, Laptop, TrendingUp } from 'lucide-react';

const TABS = [
  {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    label: 'Live Analytics',
    sublabel: 'Real-time data visualization',
    Icon: BarChart3,
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
    label: 'Works From Anywhere',
    sublabel: 'Browser-based, no install needed',
    Icon: Laptop,
  },
  {
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80',
    label: 'Scales With You',
    sublabel: 'From startup to enterprise',
    Icon: TrendingUp,
  },
];

function DockIcon({
  Icon,
  label,
  isActive,
  onClick,
}: {
  Icon: typeof BarChart3;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-1.5 group focus:outline-none"
    >
      {/* Active dot */}
      <div
        className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-[#64FFDA]"
        style={{
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'scale(1)' : 'scale(0)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
      {/* Icon box */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300"
        style={{
          background: isActive ? 'rgba(100, 255, 218, 0.15)' : 'rgba(17, 34, 64, 0.8)',
          borderColor: isActive ? '#64FFDA' : 'rgba(136, 145, 176, 0.3)',
          boxShadow: isActive ? '0 0 20px rgba(100, 255, 218, 0.35)' : 'none',
          transform: isActive ? 'scale(1.15)' : 'scale(1)',
        }}
      >
        <Icon
          size={24}
          style={{ color: isActive ? '#64FFDA' : '#8892B0' }}
          strokeWidth={1.5}
        />
      </div>
      {/* Tooltip */}
      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="text-xs text-[#F8F9FA] bg-[#112240] px-2 py-1 rounded whitespace-nowrap border border-[#8892B0]/20">
          {label}
        </span>
      </div>
    </button>
  );
}

export function HorizontalScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const windowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevIndexRef = useRef(0);
  const activeIndexRef = useRef(0);
  const dockPositions = useRef<DOMRect[]>([]);
  const hasInitialized = useRef(false);

  // Capture dock icon positions after mount
  useEffect(() => {
    if (!dockRef.current) return;
    const buttons = dockRef.current.querySelectorAll('button');
    dockPositions.current = Array.from(buttons).map((btn) =>
      btn.getBoundingClientRect()
    );
  }, []);

  useGSAP(() => {
    const section = containerRef.current;
    if (!section) return;

    // Header entrance
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Dock entrance
    gsap.fromTo(
      dockRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // All windows start hidden
    windowRefs.current.forEach((win) => {
      if (!win) return;
      gsap.set(win, { opacity: 0, scale: 0.08, autoAlpha: 0 });
    });

    // Open initial window (tab 0) expanding from dock icon 0
    const initWin = windowRefs.current[0];
    if (initWin && dockPositions.current[0]) {
      const dockRect = dockPositions.current[0];
      const winRect = initWin.getBoundingClientRect();
      const ox = dockRect.left + dockRect.width / 2 - winRect.left - winRect.width / 2;
      const oy = dockRect.top + dockRect.height / 2 - winRect.top - winRect.height / 2;

      gsap.set(initWin, { transformOrigin: `${ox}px ${oy}px`, scale: 0.08, autoAlpha: 0 });
      gsap.to(initWin, {
        opacity: 1,
        scale: 1,
        autoAlpha: 1,
        duration: 0.75,
        ease: 'power3.out',
      });
      hasInitialized.current = true;
    }

    // Scroll-driven tab switching
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const newIndex = Math.round(progress * (TABS.length - 1));
        const clampedIndex = Math.max(0, Math.min(TABS.length - 1, newIndex));

        if (clampedIndex !== activeIndexRef.current) {
          const prevIndex = activeIndexRef.current;
          activeIndexRef.current = clampedIndex;
          prevIndexRef.current = prevIndex;
          setActiveIndex(clampedIndex);

          // Animate the transition
          animateTabChange(prevIndex, clampedIndex);
        }
      },
    });
  }, { scope: containerRef });

  const animateTabChange = (fromIdx: number, toIdx: number) => {
    if (!dockPositions.current[toIdx]) return;

    const fromWin = windowRefs.current[fromIdx];
    const toWin = windowRefs.current[toIdx];
    if (!fromWin || !toWin) return;

    const dockRect = dockPositions.current[toIdx];
    const winRect = toWin.getBoundingClientRect();
    const ox = dockRect.left + dockRect.width / 2 - winRect.left - winRect.width / 2;
    const oy = dockRect.top + dockRect.height / 2 - winRect.top - winRect.height / 2;

    // Collapse old to the new dock icon
    gsap.set(fromWin, { transformOrigin: `${ox}px ${oy}px` });
    gsap.to(fromWin, {
      opacity: 0,
      scale: 0.08,
      duration: 0.4,
      ease: 'power3.in',
    });

    // Expand new from the dock icon
    gsap.set(toWin, {
      transformOrigin: `${ox}px ${oy}px`,
      opacity: 0,
      scale: 0.08,
      autoAlpha: 0,
    });
    gsap.to(toWin, {
      opacity: 1,
      scale: 1,
      autoAlpha: 1,
      duration: 0.55,
      ease: 'power3.out',
      delay: 0.1,
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#0A192F]"
    >
      {/* Header */}
      <div
        ref={textRef}
        className="absolute top-16 left-0 right-0 z-20 text-center opacity-0 pointer-events-none"
      >
        <p className="text-[#64FFDA] font-sans text-sm tracking-[0.3em] uppercase mb-2">
          See it in action
        </p>
        <h2 className="text-[#F8F9FA] font-display font-bold text-3xl md:text-5xl tracking-wide">
          Built for the way you work
        </h2>
      </div>

      {/* Stacked windows — all centered, overlapping */}
      <div className="absolute inset-0 flex items-center justify-center px-16">
        {TABS.map((tab, i) => (
          <div
            key={i}
            ref={(el) => { windowRefs.current[i] = el; }}
            className="absolute w-full max-w-4xl pointer-events-none"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <WindowUI className="w-full">
              <div className="relative w-full h-[480px] overflow-hidden bg-[#0D1B2A]">
                <img
                  src={tab.url}
                  alt={tab.label}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-[#F8F9FA] font-display font-bold text-2xl md:text-3xl tracking-wide">
                    {tab.label}
                  </h3>
                  <p className="text-[#64FFDA] font-sans text-sm mt-2 tracking-widest uppercase">
                    {tab.sublabel}
                  </p>
                </div>
              </div>
            </WindowUI>
          </div>
        ))}
      </div>

      {/* Dock */}
      <div
        ref={dockRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 opacity-0"
      >
        <div className="flex items-center gap-5 px-7 py-4 bg-[#112240]/85 backdrop-blur-2xl border border-[#8892B0]/20 rounded-2xl shadow-2xl">
          {TABS.map((tab, i) => (
            <DockIcon
              key={i}
              Icon={tab.Icon}
              label={tab.label}
              isActive={i === activeIndex}
              onClick={() => {}}
            />
          ))}
        </div>
        <div className="text-center mt-3">
          <p className="text-[#8892B0] font-sans text-xs tracking-wider">
            {TABS[activeIndex]?.label}
          </p>
        </div>
      </div>
    </section>
  );
}
