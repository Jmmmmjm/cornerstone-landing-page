/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Reveal } from './Reveal';

const team = [
  { name: 'Marcus', role: 'Architect', bio: 'Specialising in distributed systems and high-scale infrastructure.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
  { name: 'Sarah', role: 'Operations', bio: 'Expert in workflow automation and strategic agency scaling.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600' },
  { name: 'David', role: 'Engineering', bio: 'Full-stack developer focused on performance and reliability.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600' },
  { name: 'Elena', role: 'Design', bio: 'Creating cohesive digital experiences and design systems.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600' }
];

export function AboutSection() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: marqueeRef,
    offset: ["start end", "end start"]
  });

  const xMarquee = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <section className="relative w-full bg-transparent py-24 md:py-32 select-none font-sans overflow-hidden">
      
      {/* Intro Header */}
      <div className="px-4 md:px-8 w-full mb-20 md:mb-32">
        <Reveal>
          <div className="font-mono text-xs md:text-sm text-teal-600 dark:text-[#64FFDA] tracking-[0.2em] uppercase mb-6">
            Who we are
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-5xl md:text-7xl lg:text-[8rem] font-display font-bold text-[#0A192F] dark:text-[#F8F9FA] tracking-tighter leading-[0.85] uppercase max-w-5xl">
            Thinkers. Engineers. <span className="text-teal-600 dark:text-[#64FFDA]">Foundations.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-12 text-xl md:text-3xl text-[#0A192F]/70 dark:text-white/60 max-w-3xl leading-relaxed">
            We build the systems that support modern agencies. Not just websites, but the complete operational infrastructure required to scale with absolute confidence.
          </p>
        </Reveal>
      </div>

      {/* Team Image Marquee - Parallax effect */}
      <div ref={marqueeRef} className="relative w-full mb-32 overflow-hidden border-y border-slate-200 dark:border-white/10 py-12">
        <motion.div 
          style={{ x: xMarquee }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8">
              {[
                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800'
              ].map((url, index) => (
                <div key={index} className="w-[300px] md:w-[500px] aspect-[4/3] bg-slate-200 dark:bg-[#112240] overflow-hidden">
                  <img src={url} alt="Office life" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Philosophy Section */}
      <div className="px-4 md:px-8 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
        <div className="flex flex-col justify-center">
          <Reveal>
            <h3 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight mb-8">
              Reliability is the New Innovation
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg md:text-xl text-[#0A192F]/70 dark:text-white/60 leading-relaxed mb-12">
              Most agencies scale until they break. We ensure your growth is supported by architectural precision. From automated workflows to high-performance platforms, every decision is intentional.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-white/10">
             <div>
                <div className="text-4xl md:text-6xl font-display font-bold text-teal-600 dark:text-[#64FFDA] mb-2">15+</div>
                <div className="font-mono text-xs uppercase tracking-widest opacity-50">Years Experience</div>
             </div>
             <div>
                <div className="text-4xl md:text-6xl font-display font-bold text-teal-600 dark:text-[#64FFDA] mb-2">100%</div>
                <div className="font-mono text-xs uppercase tracking-widest opacity-50">Reliability Rate</div>
             </div>
          </div>
        </div>
        <div className="aspect-square bg-slate-200 dark:bg-[#112240] overflow-hidden border border-slate-200 dark:border-white/10">
          <img 
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200" 
            alt="Workplace" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Team Grid */}
      <div className="px-4 md:px-8 max-w-[1400px] mx-auto mb-32">
        <Reveal>
           <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight mb-16 border-b border-slate-200 dark:border-white/10 pb-8">
             Meet the Team
           </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-px bg-slate-200/20 dark:bg-white/10 border border-slate-200 dark:border-white/10">
          {team.map((member, i) => (
            <div key={i} className="bg-transparent p-8 group">
              <div className="aspect-[3/4] mb-8 overflow-hidden bg-slate-100 dark:bg-[#112240]">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              </div>
              <h4 className="text-2xl font-display font-bold uppercase mb-1">{member.name}</h4>
              <p className="font-mono text-xs text-teal-600 dark:text-[#64FFDA] uppercase tracking-widest mb-4">{member.role}</p>
              <p className="text-sm text-[#0A192F]/60 dark:text-white/40 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
