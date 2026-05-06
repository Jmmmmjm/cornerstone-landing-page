/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Reveal } from './Reveal';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import Grainient from './Grainient';

const stats = [
  {
    value: '90',
    suffix: '+',
    label: 'Successful projects in our portfolio',
    description: 'Each project is a unique solution tailored to the specific needs of the client, ensuring maximum efficiency and effectiveness.'
  },
  {
    value: '4',
    suffix: '+',
    label: 'Years of experience in Web3',
    description: 'Our extensive experience in Web3 enables us to consider multiple factors in negotiations and decision-making.'
  },
  {
    prefix: '$',
    value: '8',
    suffix: 'M',
    label: 'Raised for our clients',
    description: 'With strong relationships and active collaboration with VCs and angel investors, our clients secure investment rounds swiftly and stress-free.'
  },
  {
    prefix: '$',
    value: '6.5',
    suffix: 'M',
    label: 'Saved for our clients on services',
    description: 'Leveraging our expertise in process optimization, we’ve helped our clients save substantial amounts on services we deliver more profitably.'
  },
  {
    value: '50',
    suffix: '+',
    label: 'Partners and collaborators have trusted us',
    description: 'Each project is a unique solution tailored to the specific needs of the client, ensuring maximum efficiency and effectiveness.'
  },
  {
    value: '3',
    suffix: 'X',
    label: 'Accelerated process with us',
    description: 'We provide efficient solutions and tailored approaches to resolve issues swiftly and effectively, cutting out unnecessary bureaucracy and the hassle of finding the right contacts.'
  }
];

export function NumbersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Section scale from 0.9 to 1.0 as it enters
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.8], [0.9, 0.9, 1]);
  
  // Horizontal scroll for the track
  const x = useTransform(scrollYProgress, [0.4, 0.9], ["0%", "-100%"]);

  return (
    <section ref={sectionRef} className="relative h-[350vh] bg-transparent">
      {/* Sticky Container (div-block-20) */}
      <motion.div 
        className="sticky top-0 h-screen w-full bg-[#F8F9FA] flex flex-col justify-between overflow-hidden border-t border-black/10 relative"
      >
        <div className="absolute inset-0 pointer-events-none z-0">
          <Grainient
            color1="#299682ff"
            color2="#70d1bb"
            color3="#5a9ea3"
            timeSpeed={0.12}
            grainAmount={0.05}
            grainScale={2.0}
            grainAnimated
            warpStrength={0.4}
            warpFrequency={1.8}
            zoom={1.1}
            contrast={1.1}
          />
        </div>

        {/* Header - Moved to Top Right as requested */}
        <div className="pt-24 px-6 md:px-12 text-left md:text-right relative z-10">
          <Reveal>
            <div className="font-mono text-xs md:text-sm text-[#0A192F]/40 tracking-widest uppercase mb-4">
              Numbers that matter
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl md:text-5xl lg:text-[4.4vw] font-display font-bold uppercase tracking-tight text-[#0A192F] leading-[1.1] md:ml-auto max-w-2xl">
              Facts and figures that define us
            </h2>
          </Reveal>
        </div>

        {/* Track Container (div-block-22) */}
        <div className="flex-1 flex items-center px-6 md:px-12 relative z-10 overflow-hidden">
          <motion.div style={{ x }} className="flex">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="w-[85vw] md:w-[30vw] min-w-[280px] md:min-w-[350px] h-[40vh] md:h-[45vh] bg-transparent p-6 md:p-10 flex flex-col justify-between border-r border-black/10 last:border-r-0"
              >
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    {stat.prefix && <span className="text-2xl md:text-6xl font-display font-bold text-[#0A192F]">{stat.prefix}</span>}
                    <h2 className="text-5xl md:text-[8vw] font-display font-bold text-[#0A192F] leading-none tracking-tighter">
                      {stat.value}
                    </h2>
                    {stat.suffix && <span className="text-2xl md:text-6xl font-display font-bold text-[#0A192F]">{stat.suffix}</span>}
                  </div>
                  <div className="font-sans text-base md:text-lg font-bold text-[#0A192F] mt-4 md:mt-6 leading-tight">
                    {stat.label}
                  </div>
                </div>
                <p className="text-xs md:text-base text-[#0A192F]/70 leading-relaxed max-w-[240px] md:max-w-[280px]">
                  {stat.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
