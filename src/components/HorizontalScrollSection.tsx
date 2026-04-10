import { useRef, useState, useEffect, forwardRef } from 'react';
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

const DockIcon = forwardRef<HTMLButtonElement, {
  Icon: typeof BarChart3;
  label: string;
  isActive: boolean;
  onClick: () => void;
}>(({ Icon, label, isActive, onClick }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className="relative flex flex-col items-center gap-1.5 group focus:outline-none"
    >
      <div
        className="absolute -top-3 w-1.5 h-1.5 rounded-none bg-teal-500 dark:bg-[#64FFDA]"
        style={{
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'scale(1)' : 'scale(0)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
      <div
        className="w-12 h-12 rounded-none flex items-center justify-center border transition-all duration-300"
        style={{
          background: isActive ? 'rgba(20, 184, 166, 0.15)' : 'rgba(136, 145, 176, 0.1)',
          borderColor: isActive ? '#14b8a6' : 'rgba(136, 145, 176, 0.3)',
          boxShadow: isActive ? '0 0 20px rgba(20, 184, 166, 0.25)' : 'none',
          transform: isActive ? 'scale(1.15)' : 'scale(1)',
        }}
      >
        <Icon
          size={24}
          className={isActive ? 'text-teal-600 dark:text-[#64FFDA]' : 'text-[#0A192F]/70 dark:text-[#8892B0]'}
          strokeWidth={1.5}
        />
      </div>
      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="text-xs text-white dark:text-[#F8F9FA] bg-[#0A192F] dark:bg-[#112240] px-2 py-1 rounded whitespace-nowrap border border-[#0A192F]/30 dark:border-[#8892B0]/20">
          {label}
        </span>
      </div>
    </button>
  );
});

export function HorizontalScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const windowRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [content, setContent] = useState(TABS[0]);
  const activeIndexRef = useRef(0);
  const isAnimating = useRef(false);

  // Responsive window sizing
  const [winSize, setWinSize] = useState({ w: 800, h: 500 });
  const winSizeRef = useRef({ w: 800, h: 500 });

  useEffect(() => {
    const handleResize = () => {
      const size = {
        w: Math.min(window.innerWidth * 0.85, 900),
        h: Math.min(window.innerHeight * 0.65, 600)
      };
      setWinSize(size);
      winSizeRef.current = size;
      ScrollTrigger.refresh();
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openWindow = (index: number) => {
    const wrap = windowRef.current;
    if (!wrap || !containerRef.current) return;
    const btn = iconRefs.current[index];
    if (!btn) return;
    
    const r = btn.getBoundingClientRect();
    const sectionRect = containerRef.current.getBoundingClientRect();
    
    const iconCenterX = r.left - sectionRect.left + r.width / 2;
    const iconCenterY = r.top - sectionRect.top + r.height / 2;

    gsap.killTweensOf(wrap);
    
    // Set current size from ref
    gsap.set(wrap, { 
      width: winSizeRef.current.w,
      height: winSizeRef.current.h,
      visibility: 'visible',
      pointerEvents: 'auto',
      opacity: 0,
      scale: 0.1,
      left: iconCenterX,
      top: iconCenterY,
      xPercent: -50,
      yPercent: -50,
    });

    // Animate to screen center
    gsap.to(wrap, {
      opacity: 1,
      scale: 1,
      left: '50%',
      top: '50%',
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const closeWindow = (index: number, cb?: () => void) => {
    const wrap = windowRef.current;
    if (!wrap || !containerRef.current) return;
    const btn = iconRefs.current[index];
    
    gsap.killTweensOf(wrap);

    if (btn) {
      const r = btn.getBoundingClientRect();
      const sectionRect = containerRef.current.getBoundingClientRect();
      
      const iconCenterX = r.left - sectionRect.left + r.width / 2;
      const iconCenterY = r.top - sectionRect.top + r.height / 2;

      gsap.to(wrap, {
        opacity: 0,
        scale: 0.1,
        left: iconCenterX,
        top: iconCenterY,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(wrap, { visibility: 'hidden', pointerEvents: 'none' });
          cb?.();
        }
      });
    } else {
      gsap.to(wrap, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          gsap.set(wrap, { visibility: 'hidden', pointerEvents: 'none' });
          cb?.();
        }
      });
    }
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    // Initial reveal of section header and dock — use gsap.set first so
    // if they're already visible (e.g. after a resize re-run) we don't flash back to opacity 0.
    const revealST = gsap.fromTo(
      [textRef.current, dockRef.current],
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        immediateRender: false,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );

    // Pinning and window lifecycle.
    const mainST = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=300%",
      pin: true,
      pinSpacing: true,
      pinType: "transform",
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => {
        openWindow(activeIndexRef.current);
      },
      onLeave: () => {
        closeWindow(activeIndexRef.current);
      },
      onEnterBack: () => {
        openWindow(activeIndexRef.current);
      },
      onUpdate: (self) => {
        const progress = self.progress;
        const index = Math.min(TABS.length - 1, Math.floor(progress * TABS.length));

        if (index !== activeIndexRef.current) {
          const oldIndex = activeIndexRef.current;
          activeIndexRef.current = index;
          
          closeWindow(oldIndex, () => {
            setActiveIndex(index);
            setContent(TABS[index]);
            openWindow(index);
          });
        }
      },
    });

    return () => {
      mainST.kill();
      revealST.scrollTrigger?.kill();
    };
  }, []); // Remove winSize dependency for stability

  const handleTabChange = (index: number) => {
    if (index === activeIndex || isAnimating.current) return;
    const oldIndex = activeIndex;
    setActiveIndex(index);
    activeIndexRef.current = index;
    isAnimating.current = true;
    
    closeWindow(oldIndex, () => {
      setContent(TABS[index]);
      openWindow(index);
      isAnimating.current = false;
    });
  };

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-white dark:bg-[#0A192F] z-30 will-change-transform">
      {/* Header */}
      <div ref={textRef} className="absolute top-16 left-0 right-0 z-[150] text-center opacity-0">
        <p className="text-teal-600 dark:text-[#64FFDA] font-sans text-sm tracking-[0.3em] uppercase mb-2">See it in action</p>
        <h2 className="text-[#0A192F] dark:text-[#F8F9FA] font-display font-bold text-3xl md:text-5xl tracking-wide">Built for the way you work</h2>
      </div>

      {/* Main Window — initially centered so it never bleeds outside section bounds before openWindow sets its position */}
      <div
        ref={windowRef}
        className="absolute z-[200] pointer-events-none invisible"
        style={{
          width: winSize.w,
          height: winSize.h,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <WindowUI className="w-full h-full shadow-2xl">
          <div className="relative w-full h-full overflow-hidden bg-slate-100 dark:bg-[#0D1B2A]">
            <img 
              src={content.url} 
              alt={content.label} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent dark:from-[#0A192F]/90 dark:via-[#0A192F]/20 dark:to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-left">
              <h3 className="text-[#0A192F] dark:text-[#F8F9FA] font-display font-bold text-2xl md:text-3xl tracking-wide">{content.label}</h3>
              <p className="text-teal-600 dark:text-[#64FFDA] font-sans text-sm mt-2 tracking-widest uppercase">{content.sublabel}</p>
            </div>
          </div>
        </WindowUI>
      </div>

      <div ref={dockRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[110] opacity-0">
        <div className="flex items-center gap-5 px-7 py-4 bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-[#0A192F]/10 dark:border-[#8892B0]/20 rounded-none shadow-xl">
          {TABS.map((tab, i) => (
            <DockIcon
              key={i}
              ref={el => { iconRefs.current[i] = el; }}
              Icon={tab.Icon}
              label={tab.label}
              isActive={i === activeIndex}
              onClick={() => handleTabChange(i)}
            />
          ))}
        </div>
        <div className="text-center mt-3">
          <p className="text-[#0A192F]/60 dark:text-[#8892B0] font-sans text-xs tracking-wider uppercase font-bold">{TABS[activeIndex]?.label}</p>
        </div>
      </div>
    </section>
  );
}
