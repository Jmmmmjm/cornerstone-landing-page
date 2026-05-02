import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Shield, Zap, Rocket } from 'lucide-react';
import { CornerstoneIcon, KeystoneIcon, BlockIcon } from './ArchitecturalIcons';

gsap.registerPlugin(ScrollTrigger);

const solutionCards = [
  {
    id: "efficiency",
    title: "Digital Efficiency",
    subtitle: "Modern Workflows",
    description: "Reclaim 90% of your day. Your agency moves from 'old school' manual habits to a fast operation that matches the digital age.",
    Icon: KeystoneIcon,
    metrics: ["90/10 Rule", "Zero Errors", "Runs 24/7"]
  },
  {
    id: "reliability",
    title: "Reliability & Stability",
    subtitle: "Crash-Proof Systems",
    description: "Built for industries that can't afford to fail. Your platform stays stable even during traffic spikes, ensuring you never lose progress.",
    Icon: CornerstoneIcon,
    metrics: ["99.9% Uptime", "Zero Downtime", "Data Safety"]
  },
  {
    id: "scale",
    title: "Infinite Scale",
    subtitle: "Work Smarter",
    description: "Handle more clients without needing more staff. Turn 'wasted' admin money into a budget for scaling and marketing.",
    Icon: BlockIcon,
    metrics: ["Max ROI", "Easy Scaling", "No VA Needed"]
  }
];

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const paths = gsap.utils.toArray('.js-line-junction');
    const cards = gsap.utils.toArray('.js-solution-card');
    
    // Master Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });

    // 1. Initial State: Lines drawing toward the center
    tl.fromTo(paths, 
      { strokeDashoffset: 1000, strokeDasharray: 1000 },
      { strokeDashoffset: 0, duration: 2, ease: "none" }
    );

    // 2. Converge: Junction point glows
    tl.to('.junction-core', { scale: 1.2, opacity: 1, filter: 'blur(0px)', duration: 1 }, "-=0.5");

    // 3. The Transition: SVG Container blurs and solution header rises
    tl.to('.svg-junction-container', { scale: 1.5, opacity: 0.1, filter: 'blur(40px)', duration: 2 });
    tl.to('.solution-main-header', { y: 0, opacity: 1, duration: 1.5 }, "-=1.5");

    // 4. THE MINDJOIN CLIMAX: Cards slide in from the bottom in 3D stack
    tl.fromTo(cards, 
      { y: 800, opacity: 0, rotationX: 45, scale: 0.8 },
      { 
        y: 0, 
        opacity: 1, 
        rotationX: 0, 
        scale: 1, 
        stagger: 0.4, 
        duration: 3, 
        ease: "power4.out" 
      }, 
      "-=1"
    );

    // 5. Finishing touch: Background grid illumination
    tl.to('.bg-grid-glow', { opacity: 0.05, duration: 2 }, "-=2");

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#F8F9FA] dark:bg-[#0A192F] overflow-hidden">
      
      {/* 3D Perspective Grid Background */}
      <div className="bg-grid-glow absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-1000" 
        style={{ 
            backgroundImage: 'linear-gradient(to right, #64FFDA 1px, transparent 1px), linear-gradient(to bottom, #64FFDA 1px, transparent 1px)', 
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
        }} />

      {/* 1. Junction Phase (SVG Lines) */}
      <div className="svg-junction-container absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 1800 656" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-teal-500/40 dark:text-[#64FFDA]/30 max-w-7xl">
            {/* Replicating the exact path architecture from reference */}
            <path d="M1619.74 426.043L1619.74 242.5L1815.24 242.5" stroke="currentColor" strokeWidth="1.5" className="js-line-junction" />
            <path d="M1379.24 162.5L1815.24 162.5" stroke="currentColor" strokeWidth="1.5" className="js-line-junction" />
            <path d="M1139.64 655.766C1139.64 473.471 1139.64 263.795 1139.64 81.5L1819.64 81.5" stroke="currentColor" strokeWidth="1.5" className="js-line-junction" />
            <path d="M900.235 83.0166L900.235 0.500137L1815.23 0.500112" stroke="currentColor" strokeWidth="1.5" className="js-line-junction" />
            <path d="M900.235 83.0168L900.235 0.50032L-14.7644 0.500295" stroke="currentColor" strokeWidth="1.5" className="js-line-junction" />
            <path d="M181.206 426.043L181.205 242.5L-14.2951 242.5" stroke="currentColor" strokeWidth="1.5" className="js-line-junction" />
            <path d="M421.704 162.5L-14.2952 162.5" stroke="currentColor" strokeWidth="1.5" className="js-line-junction" />
            <path d="M661.303 655.766C661.303 473.471 661.298 263.795 661.298 81.5L-18.7033 81.5" stroke="currentColor" strokeWidth="1.5" className="js-line-junction" />
            
            {/* The Convergence Point */}
            <g className="junction-core opacity-0 scale-50" style={{ transformOrigin: '900px 328px' }}>
                <circle cx="900" cy="328" r="40" fill="#64FFDA" className="blur-xl opacity-20" />
                <foreignObject x="840" y="268" width="120" height="120">
                    <KeystoneIcon className="w-full h-full text-teal-500" isHovered={true} />
                </foreignObject>
            </g>
        </svg>

      </div>

      {/* 2. Solution Phase (Stacked Cards) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-24">
        
        <div className="solution-main-header opacity-0 translate-y-20 text-center mb-16 max-w-3xl">
            <span className="text-teal-500 font-mono text-xs tracking-[0.5em] uppercase mb-6 block">Foundation for Scale</span>
            <h2 className="text-6xl md:text-8xl font-display font-bold text-[#0A192F] dark:text-[#F8F9FA] tracking-tighter uppercase leading-none">
                About Us
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl perspective-1000">
            {solutionCards.map((card, i) => (
                <div key={card.id} className="js-solution-card group bg-white dark:bg-[#112240] p-10 border border-slate-200 dark:border-[#8892B0]/10 shadow-2xl relative overflow-hidden h-[480px] flex flex-col">
                    
                    {/* Background Trace Icon */}
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 pointer-events-none group-hover:opacity-20 transition-opacity duration-700">
                        <card.Icon className="w-full h-full" />
                    </div>

                    <div className="flex justify-between items-start mb-12">
                        <span className="font-mono text-[10px] text-[#8892B0] tracking-[0.4em] uppercase">Cornerstone_OS // 0{i + 1}</span>
                        <card.Icon className="w-6 h-6 text-teal-500" isHovered={true} />
                    </div>

                    <h3 className="text-3xl font-display font-bold text-[#0A192F] dark:text-[#F8F9FA] uppercase mb-4 leading-tight">{card.title}</h3>
                    <p className="text-teal-500 dark:text-[#64FFDA] text-xs font-bold uppercase tracking-[0.2em] mb-8">{card.subtitle}</p>
                    
                    <p className="text-[#0A192F]/70 dark:text-[#8892B0] text-base leading-relaxed mb-10 font-sans">
                        {card.description}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2 pt-8 border-t border-slate-50 dark:border-white/5">
                        {card.metrics.map((m, j) => (
                            <div key={j} className="px-3 py-1 border border-teal-500/20 rounded-full font-mono text-[9px] text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                                {m}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>

    </section>
  );
}
