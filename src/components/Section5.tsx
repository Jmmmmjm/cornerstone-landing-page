import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CountUp } from './CountUp';
import { Reveal } from './Reveal';

const CASE_STUDIES = [
  {
    industry: "Heavy Manufacturing",
    outcome: "Reduced reporting time by 80%.",
    context: "A mid-size steel fabricator replaced seven disconnected tools with one Cornerstone workflow.",
    stat: 80,
    suffix: "%",
    barWidth: "80%"
  },
  {
    industry: "Logistics",
    outcome: "Eliminated manual dispatch errors.",
    context: "A regional freight carrier automated their entire routing and driver assignment process.",
    stat: 100,
    suffix: "%",
    barWidth: "100%"
  },
  {
    industry: "Commercial Real Estate",
    outcome: "Accelerated lease approvals by 3x.",
    context: "A property management firm unified their tenant screening, document signing, and onboarding.",
    stat: 3,
    suffix: "x",
    barWidth: "66%"
  }
];

export function Section5() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const linesRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
      }
    });

    // Perspective landing
    tl.fromTo(cardsRef.current,
      { y: 80, opacity: 0, rotationX: 45, transformPerspective: 1000 },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      }
    );

    // Connecting lines
    if (linesRef.current) {
      const paths = linesRef.current.querySelectorAll('path');
      tl.fromTo(paths,
        { strokeDasharray: "0 1000" },
        { strokeDasharray: "1000 1000", duration: 1, ease: "power2.inOut" },
        "-=0.2"
      );
    }
  }, { scope: containerRef });

  return (
    <section id="results" ref={containerRef} className="py-32 bg-[#0A192F] border-t border-[#8892B0]/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="text-center mb-20">
          <Reveal delay={0}>
            <span className="text-[#8892B0] font-sans text-sm tracking-widest uppercase mb-4 block">Results</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-[#F8F9FA]">What stability looks like in practice.</h2>
          </Reveal>
        </div>

        <div className="relative">
          {/* Connecting lines between cards (desktop only) */}
          <svg ref={linesRef} className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 hidden md:block pointer-events-none z-0" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path d="M 150 50 L 500 50" stroke="#8892B0" strokeWidth="1" fill="none" opacity="0.3" />
            <path d="M 500 50 L 850 50" stroke="#8892B0" strokeWidth="1" fill="none" opacity="0.3" />
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {CASE_STUDIES.map((study, i) => (
              <div 
                key={i}
                ref={el => { cardsRef.current[i] = el; }}
                className="bg-[#112240] p-8 rounded-xl flex flex-col border border-[#8892B0]/10 shadow-xl"
              >
                <div className="text-[#8892B0] text-xs font-bold tracking-widest uppercase mb-6">
                  {study.industry}
                </div>
                
                <div className="mb-6">
                  <CountUp end={study.stat} suffix={study.suffix} />
                  <div className="w-full h-1 bg-[#0A192F] rounded mt-2">
                    <div className="h-full bg-[#64FFDA] rounded" style={{ width: study.barWidth }}></div>
                  </div>
                </div>

                <h3 className="text-[#F8F9FA] font-display font-medium text-xl leading-tight mb-4">
                  {study.outcome}
                </h3>
                <p className="text-[#8892B0] text-sm leading-relaxed mb-8 flex-1">
                  {study.context}
                </p>
                <div className="border-t border-[#8892B0]/20 pt-6 mt-auto">
                  <a href="#" className="text-[#F8F9FA] text-sm font-medium hover:text-[#64FFDA] transition-colors inline-flex items-center gap-2">
                    Read more <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
