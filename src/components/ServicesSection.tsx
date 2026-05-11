/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Reveal } from './Reveal';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const services = [
  {
    number: '(01)',
    title: 'Architecture & Systems',
    description: 'We architect robust, scalable systems that serve as the bedrock for your growth. Our engineering approach ensures stability under extreme load and seamless integration with existing infrastructures.'
  },
  {
    number: '(02)',
    title: 'Scaling & Optimization',
    description: 'Our optimization protocols identify bottlenecks and eliminate friction. We scale your operations through intelligent resource allocation and performance tuning that delivers measurable results.'
  },
  {
    number: '(03)',
    title: 'Workflow Automation',
    description: 'We eliminate manual overhead by engineering custom automation pipelines. Our solutions reclaim thousands of operational hours, allowing your team to focus on high-leverage strategic initiatives.'
  },
  {
    number: '(04)',
    title: 'Strategic Implementation',
    description: 'From concept to deployment, we guide the implementation of complex technical strategies. Our long-standing industry relationships ensure faster approvals and market-leading terms for your launch.'
  }
];

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Translate cards from 0 to -1200px. 
  // By finishing at 0.55, we create a "delay" (from 0.55 to 0.66) where the section 
  // remains completely static before the next section begins sliding up at 0.66.
  const y = useTransform(scrollYProgress, [0, 0.55], [0, -1200]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-transparent">
      {/* Sticky Wrapper */}
      <motion.section 
        style={{ opacity }}
        className="sticky top-0 h-screen w-full flex flex-col lg:flex-row-reverse items-start bg-transparent overflow-hidden"
      >
        {/* Right Column - Fixed Header */}
        <div className="w-full lg:w-1/2 h-auto lg:h-full flex flex-col justify-center pt-24 lg:pt-0 px-6 lg:px-12 z-10 text-left lg:text-right bg-transparent shrink-0">
          <Reveal>
            <div className="font-mono text-xs md:text-sm text-[#F8F9FA]/40 tracking-widest uppercase mb-4">
              Our Core Expertise
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="text-3xl md:text-5xl lg:text-[4.4vw] font-display font-bold uppercase tracking-tight text-[#F8F9FA] leading-[1.1] lg:ml-auto max-w-2xl">
              Customer-centric services focused on exceptional client experience
            </h3>
          </Reveal>
        </div>

        {/* Left Column - Animated Cards */}
        <div className="w-full lg:w-[44%] h-full flex flex-col justify-start mr-auto relative overflow-hidden">
          <motion.div 
            style={{ y }}
            className="flex flex-col gap-6 md:gap-12 pt-12 lg:pt-24 pb-24 px-6 md:px-12"
          >
            {services.map((service, i) => (
              <div key={i} className="flex flex-col w-full">
                {i > 0 && (
                  <div className="w-full h-px bg-[#F8F9FA]/10 mb-8 md:mb-12" />
                )}
                <div className="bg-transparent min-h-[400px] md:min-h-[480px] flex flex-col justify-between group">
                  <div className="flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-6 md:mb-8">
                       <span className="font-display text-xl md:text-2xl font-bold text-[#64FFDA]">{service.number}</span>
                       <h4 className="text-xl md:text-3xl font-display font-bold uppercase text-[#F8F9FA]">
                         {service.title}
                       </h4>
                    </div>
                    
                    <div className="flex items-center justify-center py-4 md:py-6">
                       <div className="w-24 h-24 md:w-32 md:h-32 border border-teal-500/20 flex items-center justify-center">
                          <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-dashed border-teal-500/40 animate-[spin_20s_linear_infinite]" />
                       </div>
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-[#F8F9FA]/60 leading-relaxed font-sans">
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
