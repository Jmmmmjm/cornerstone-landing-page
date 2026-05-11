/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Reveal } from '../ui/Reveal';
import { ServicesSection } from './ServicesSection';
import { NumbersSection } from './NumbersSection';

export function AboutSection() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: marqueeRef,
    offset: ["start end", "end start"]
  });

  const xMarquee = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <section className="relative w-full bg-transparent py-24 md:py-32 select-none font-sans overflow-x-clip">
      
      {/* Intro Header */}
      <div className="px-6 md:px-12 w-full mb-16 md:mb-32">
        <Reveal>
          <div className="font-mono text-xs md:text-sm text-[#64FFDA] tracking-[0.2em] uppercase mb-6">
            Who we are
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-4xl md:text-7xl lg:text-[8rem] font-display font-bold text-[#F8F9FA] tracking-tighter leading-[0.85] uppercase max-w-5xl">
            Work <span className="text-[#64FFDA]">faster.</span> <br className="md:hidden" /> Scale <span className="text-[#64FFDA]">smarter.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 md:mt-12 text-lg md:text-3xl text-white/60 max-w-3xl leading-relaxed">
            We help teams save 10+ hours per week by automating workflows and building systems that let you focus on what matters.
          </p>
        </Reveal>
      </div>

      {/* Team Image Marquee - Parallax effect */}
      <div ref={marqueeRef} className="relative w-full mb-32 overflow-hidden border-y border-white/10 py-12">
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
                <div key={index} className="w-[300px] md:w-[500px] aspect-[4/3] bg-[#112240] overflow-hidden">
                  <img src={url} alt="Office life" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Stacked Layout Container */}
      <div className="relative w-full">
        {/* Services Section - Stays sticky so Numbers can slide over it */}
        <div className="relative z-10">
           <ServicesSection />
        </div>

        {/* Numbers Section - Higher Z-index to cover Services */}
        <div className="relative z-20 -mt-[100vh]">
           <NumbersSection />
        </div>
      </div>

    </section>
  );
}
