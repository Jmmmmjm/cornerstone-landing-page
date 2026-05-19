"use client"
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Reveal } from '../ui/Reveal';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

import React from "react"

const services = [
  {
    number: '(01)',
    title: 'Discovery & Strategic Blueprint',
    description: 'We conduct an in-depth discovery call to audit your needs. We then provide a live demo design and a comprehensive Project Handbook detailing business improvements, precise timelines, and technical requirements.'
  },
  {
    number: '(02)',
    title: 'Systemic Execution',
    description: 'Our team executes the blueprints established in the Project Handbook. We maintain complete transparency through bi-weekly synchronization meetings, ensuring the build aligns perfectly with your operational goals.'
  },
  {
    number: '(03)',
    title: 'Delivery & Perpetual Support',
    description: 'Following the final deployment, we provide ongoing technical support and optimization. Our continued partnership ensures your system remains robust and scales effectively based on your chosen service plan.'
  }
];

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Finish the animation early at 0.55 to create a "dwell" period.
  // The next section starts sliding up at ~0.66 (since container is 400vh and next section is -100vh mt).
  // Translating by -1200 perfectly centers the 3rd card vertically before the next section appears.
  const y = useTransform(scrollYProgress, [0, 0.55], [0, -1200]);
  const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-transparent">
      {/* Sticky Wrapper */}
      <motion.section 
        style={{ opacity }}
        className="sticky top-0 h-screen w-full flex flex-col lg:flex-row-reverse items-start bg-transparent overflow-hidden"
      >
        {/* Right Column - Fixed Header */}
        <div className="w-full lg:w-1/2 h-auto lg:h-full flex flex-col justify-start pt-24 lg:pt-32 px-6 lg:px-12 z-10 text-left lg:text-right bg-transparent shrink-0">
          <Reveal>
            <div className="font-mono text-xs md:text-sm text-[#64FFDA] tracking-widest uppercase mb-6">
              How we work
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-5xl md:text-8xl lg:text-[7rem] font-display font-bold uppercase tracking-tighter text-[#F8F9FA] leading-[0.85] lg:ml-auto max-w-2xl">
              Our <br /> 3-Step <br /> Process
            </h2>
          </Reveal>
        </div>
        {/* Left Column - Animated Cards */}
        <div className="w-full lg:w-[44%] h-full flex flex-col justify-start mr-auto relative overflow-hidden">
          <motion.div 
            style={{ y }}
            className="flex flex-col gap-6 md:gap-12 pt-12 lg:pt-24 pb-32 px-6 md:px-12"
          >
            {services.map((service, i) => (
              <div key={i} className="flex flex-col w-full">
                {i > 0 && (
                  <div className="w-full h-px bg-[#F8F9FA]/10 mb-8 md:mb-12" />
                )}
                <div className="bg-transparent min-h-[450px] md:min-h-[550px] flex flex-col justify-between group">
                  <div className="flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 md:mb-10">
                      <span className="font-display text-2xl md:text-4xl font-bold text-[#64FFDA]">{service.number}</span>
                      <h4 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold uppercase text-[#F8F9FA] tracking-tight">
                        {service.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-center py-6 md:py-10">
                      <div className="w-24 h-24 md:w-40 md:h-40 border border-teal-500/20 flex items-center justify-center">
                        <div className="w-16 h-16 md:w-28 md:h-28 border-2 border-dashed border-teal-500/40 animate-[spin_20s_linear_infinite]" />
                      </div>
                    </div>
                  </div>

                  <p className="text-lg md:text-xl lg:text-2xl text-[#F8F9FA]/70 leading-relaxed font-sans max-w-3xl">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
