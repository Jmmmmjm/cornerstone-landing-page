import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { WindowUI } from './WindowUI';
import { BarChart3, Laptop, TrendingUp, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    title: 'Live Analytics',
    subtitle: 'Real-time Operations',
    description: 'Monitor every metric that matters in a single, unified dashboard. From production throughput to logistics efficiency, Cornerstone gives you the pulse of your business in real-time.',
    Icon: BarChart3,
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
    title: 'Works Anywhere',
    subtitle: 'Cloud Native',
    description: 'Access your workflows from the shop floor or the boardroom. Our secure, browser-based platform requires zero IT overhead for deployment and works on any device.',
    Icon: Laptop,
  },
  {
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80',
    title: 'Scale Forever',
    subtitle: 'Built for Growth',
    description: 'Start with a single workflow and expand to automate your entire supply chain. Cornerstone is built on a foundation of performance that scales with your ambition.',
    Icon: TrendingUp,
  },
];

export function HorizontalScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Pinning the whole section
    const mainST = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${STEPS.length * 100}%`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const index = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
        
        if (index !== activeIndexRef.current) {
          activeIndexRef.current = index;
          setActiveIndex(index);
        }
      },
    });

    // Animate content fades based on index
    STEPS.forEach((_, i) => {
      gsap.fromTo(`.step-text-${i}`,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: `${(i / STEPS.length) * 100}% top`,
            end: `${((i + 1) / STEPS.length) * 100}% top`,
            scrub: true,
          }
        }
      );
    });

    return () => {
      mainST.kill();
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#F8F9FA] dark:bg-[#0A192F] overflow-hidden">
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 md:gap-20">
        
        {/* Left Side: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center py-20">
          <div className="relative h-[300px]">
            {STEPS.map((step, i) => (
              <div 
                key={i}
                className={`step-text-${i} absolute inset-0 flex flex-col justify-center transition-opacity duration-300 ${activeIndex === i ? 'pointer-events-auto' : 'pointer-events-none opacity-0'}`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-500/10 dark:bg-[#64FFDA]/10 flex items-center justify-center border border-teal-500/20 dark:border-[#64FFDA]/20">
                    <step.Icon size={20} className="text-teal-600 dark:text-[#64FFDA]" />
                  </div>
                  <span className="text-teal-600 dark:text-[#64FFDA] font-sans text-[10px] font-bold tracking-[0.3em] uppercase">
                    {step.subtitle}
                  </span>
                </div>
                
                <h2 className="text-[#0A192F] dark:text-[#F8F9FA] font-display font-bold text-3xl md:text-5xl tracking-tight mb-6">
                  {step.title}
                </h2>
                
                <p className="text-[#0A192F]/70 dark:text-[#8892B0] text-lg leading-relaxed mb-8 max-w-md">
                  {step.description}
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {STEPS.map((_, dotIndex) => (
                      <div 
                        key={dotIndex}
                        className={`h-1 transition-all duration-300 ${activeIndex === dotIndex ? 'w-8 bg-teal-500 dark:bg-[#64FFDA]' : 'w-2 bg-slate-300 dark:bg-[#8892B0]/20'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Pinned Window */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-2xl relative aspect-[16/10]">
             <WindowUI className="w-full h-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-slate-300 dark:border-[#8892B0]/20">
               <div className="relative w-full h-full bg-slate-100 dark:bg-[#0D1B2A] overflow-hidden">
                 {STEPS.map((step, i) => (
                   <img 
                    key={i}
                    src={step.url}
                    alt={step.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${activeIndex === i ? 'opacity-100' : 'opacity-0'}`}
                   />
                 ))}
                 <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent dark:from-[#0A192F]/20" />
               </div>
             </WindowUI>
          </div>
        </div>

      </div>
    </section>
  );
}
