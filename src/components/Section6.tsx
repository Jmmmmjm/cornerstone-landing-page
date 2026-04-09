import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ActiveGrid } from './ActiveGrid';
import { Reveal } from './Reveal';

export function Section6() {
  const containerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const summaryRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
      }
    });

    // Wordmark blur reveal
    if (wordmarkRef.current) {
      const letters = wordmarkRef.current.querySelectorAll('span');
      tl.fromTo(letters,
        { opacity: 0, filter: "blur(10px)", y: 20 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.8, stagger: 0.05, ease: "power2.out" }
      );
    }

    // Sequential summary
    tl.fromTo(summaryRefs.current,
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.2, ease: "power2.out" },
      "-=0.4"
    );

    // CTA pulse
    if (ctaRef.current) {
      gsap.to(ctaRef.current, {
        scale: 1.02,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen bg-[#0A192F] flex items-center justify-center overflow-hidden border-t border-[#8892B0]/10">
      <ActiveGrid />
      
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div ref={wordmarkRef} className="text-[#8892B0] font-display font-medium tracking-widest uppercase text-2xl md:text-4xl mb-6 flex">
          {"CORNERSTONE".split('').map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </div>
        
        <Reveal delay={0.2}>
          <h2 className="text-[#F8F9FA] font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-[0.15em] uppercase whitespace-nowrap drop-shadow-lg mb-6">
            Scale On Stability
          </h2>
        </Reveal>
        
        <Reveal delay={0.3}>
          <p className="text-[#8892B0] font-display font-light text-xl md:text-2xl mb-16">
            Built for industries that can't afford to fail.
          </p>
        </Reveal>
        
        <div className="flex items-center gap-4 text-[#8892B0] font-sans text-sm tracking-widest uppercase mb-12">
          <span ref={el => { summaryRefs.current[0] = el; }}>Discovery Call</span>
          <span ref={el => { summaryRefs.current[1] = el; }}>&rarr;</span>
          <span ref={el => { summaryRefs.current[2] = el; }}>Draft Solution</span>
          <span ref={el => { summaryRefs.current[3] = el; }}>&rarr;</span>
          <span ref={el => { summaryRefs.current[4] = el; }}>Kick-off</span>
        </div>
        
        <a 
          ref={ctaRef}
          href="https://calendar.google.com" 
          target="_blank" 
          rel="noreferrer"
          className="bg-[#F8F9FA] text-[#0A192F] hover:bg-[#8892B0] px-8 py-4 text-base font-medium transition-colors rounded inline-block"
        >
          Book your Discovery Call
        </a>
      </div>
    </section>
  );
}
