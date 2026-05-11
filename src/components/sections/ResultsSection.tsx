import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Reveal } from '../ui/Reveal';

gsap.registerPlugin(ScrollTrigger);

const Counter = ({ value, prefix = '', suffix = '', duration = 2.5 }: { value: number, prefix?: string, suffix?: string, duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obj = { val: 0 };

    gsap.to(obj, {
      val: value,
      duration: duration,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        toggleActions: "restart reset restart reset"
      },
      onUpdate: () => {
        if (ref.current) {
          ref.current.innerText = `${prefix}${Math.floor(obj.val)}${suffix}`;
        }
      }
    });
  }, [value, prefix, suffix, duration]);

  return <span ref={ref} className="tabular-nums">{prefix}0{suffix}</span>;
}

export function ResultsSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-[#0A192F] text-[#F8F9FA] overflow-hidden border-t border-white/10">
      <div className="container mx-auto px-6 md:px-12 py-24 flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">

        {/* Headline */}
        <div className="lg:w-5/12 relative z-10 w-full shrink-0">
          <Reveal>
            <div className="font-mono text-xs md:text-sm text-[#64FFDA] tracking-[0.2em] uppercase mb-6">
              System Telemetry // Performance
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-6xl md:text-7xl lg:text-[6vw] font-display font-bold uppercase tracking-tighter leading-[0.85] text-[#F8F9FA]">
              Real <br className="hidden md:block" /> Results
            </h2>
          </Reveal>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-24 w-full relative z-10">

          <div className="flex flex-col border-l-2 border-[#8892B0]/20 pl-6 md:pl-10">
            <Reveal delay={0.3}>
              <div className="font-mono text-[10px] md:text-xs text-[#8892B0] tracking-widest uppercase mb-4">
                [Metric_02] Domain Authority
              </div>
              <div className="text-5xl md:text-7xl lg:text-[5vw] font-display font-bold tracking-tighter text-[#64FFDA] leading-none mb-4">
                <Counter value={5} suffix="+" duration={1.2} />
              </div>
              <div className="font-sans text-xl md:text-2xl font-bold text-[#F8F9FA]">
                Years Experience
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col border-l-2 border-[#8892B0]/20 pl-6 md:pl-10">
            <Reveal delay={0.2}>
              <div className="font-mono text-[10px] md:text-xs text-[#8892B0] tracking-widest uppercase mb-4">
                [Metric_01] Time Efficiency
              </div>
              <div className="text-5xl md:text-7xl lg:text-[5vw] font-display font-bold tracking-tighter text-[#64FFDA] leading-none mb-4">
                <Counter value={216} suffix="k" />
              </div>
              <div className="font-sans text-xl md:text-2xl font-bold text-[#F8F9FA]">
                Minutes Saved
              </div>
            </Reveal>
          </div>

        </div>
      </div>

      {/* Industrial Aesthetic Background Elements */}
      <div className="absolute top-0 right-[10%] w-[1px] h-full bg-[#8892B0]/10 pointer-events-none" />
      <div className="absolute top-[60%] left-0 w-full h-[1px] bg-[#8892B0]/10 pointer-events-none" />

      {/* Decorative Plus symbols at intersections */}
      <div className="absolute top-[60%] right-[10%] w-4 h-4 -mt-2 -mr-2 text-[#64FFDA] opacity-50 flex items-center justify-center font-mono text-sm pointer-events-none">
        +
      </div>

    </section>
  );
}
