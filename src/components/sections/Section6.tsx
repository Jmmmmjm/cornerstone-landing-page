"use client"
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ActiveGrid } from '../effects/ActiveGrid';
import { Reveal } from '../ui/Reveal';

import React from "react"

export function Section6({ onBookClick }: { onBookClick: () => void }) {
  const containerRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
      }
    });

    // Badge drops in
    tl.fromTo(badgeRef.current,
      { opacity: 0, y: -30, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)" }
    );

    // Heading reveal
    if (headingRef.current) {
      const words = headingRef.current.querySelectorAll('.word');
      tl.fromTo(words,
        { opacity: 0, y: 40, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.1, ease: "power2.out" },
        "-=0.3"
      );
    }

    // CTA breathe
    if (ctaRef.current) {
      gsap.to(ctaRef.current, {
        scale: 1.03,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Glow pulse
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.6,
        scale: 1.2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-screen bg-transparent flex items-center justify-center overflow-hidden py-24 md:py-32">
      <ActiveGrid />
      
      {/* Ambient glow behind the CTA */}
      <div ref={glowRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#64FFDA]/[0.04] blur-[120px] pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 max-w-4xl mx-auto">

        {/* FREE badge — large and impossible to miss */}
        <div ref={badgeRef} className="mb-8">
          <div className="relative inline-flex items-center gap-3 border border-[#64FFDA]/30 bg-[#64FFDA]/[0.06] px-6 py-3">
            <div className="relative shrink-0">
              <div className="w-2.5 h-2.5 bg-[#64FFDA] shadow-[0_0_12px_#64FFDA]" />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-[#64FFDA] animate-ping opacity-40" />
            </div>
            <span className="font-display text-[#64FFDA] text-xs md:text-sm font-bold tracking-[0.3em] uppercase">
              100% Free — No Commitment
            </span>
          </div>
        </div>

        {/* Main heading with "FREE" highlighted */}
        <Reveal delay={0.1}>
          <div ref={headingRef}>
            <h2 className="text-[#F8F9FA] font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight uppercase leading-[1.05] mb-4">
              <span className="word inline-block">Book Your</span>{' '}
              <span className="word inline-block text-[#64FFDA] drop-shadow-[0_0_20px_rgba(100,255,218,0.4)]">Free</span><br />
              <span className="word inline-block">Discovery Call</span>
            </h2>
          </div>
        </Reveal>

        {/* Subheading */}
        <Reveal delay={0.3}>
          <p className="text-[#8892B0] font-sans text-lg md:text-xl max-w-xl leading-relaxed mb-10">
            30 minutes. No sales pitch. We'll map out exactly how automation 
            can save your team <span className="text-[#F8F9FA] font-bold">15+ hours every week</span>.
          </p>
        </Reveal>

        {/* What you get — 3-column value props */}
        <Reveal delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14 w-full max-w-2xl">
            {[
              { num: '01', label: 'Workflow Audit', desc: 'We identify your biggest time sinks' },
              { num: '02', label: 'Custom Roadmap', desc: 'A plan tailored to your operation' },
              { num: '03', label: 'ROI Estimate', desc: 'See your projected time savings' },
            ].map((item) => (
              <div key={item.num} className="border border-[#8892B0]/10 bg-[#112240]/30 p-5 text-left group hover:border-[#64FFDA]/20 transition-colors duration-300">
                <span className="text-[#64FFDA]/40 font-display font-bold text-xs tracking-widest">{item.num}</span>
                <h4 className="text-[#F8F9FA] font-display font-bold text-sm uppercase tracking-wider mt-2 mb-1">{item.label}</h4>
                <p className="text-[#8892B0] text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTA — large, glowing, unmissable */}
        <Reveal delay={0.5}>
          <div className="flex flex-col items-center gap-5">
            <button
              ref={ctaRef}
              onClick={onBookClick}
              id="cta-book-discovery-call"
              className="relative bg-[#64FFDA] text-[#0A192F] px-12 py-5 text-sm md:text-base font-bold tracking-[0.25em] uppercase transition-all duration-300 rounded-none shadow-[0_0_30px_rgba(100,255,218,0.35),0_0_60px_rgba(100,255,218,0.15)] hover:shadow-[0_0_40px_rgba(100,255,218,0.5),0_0_80px_rgba(100,255,218,0.25)] cursor-none border-none"
            >
              Book Your Free Call
            </button>
            <span className="text-[#8892B0]/50 font-mono text-[10px] uppercase tracking-[0.3em]">
              No credit card · No obligation · Just clarity
            </span>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
