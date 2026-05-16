import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Factory, Truck, Building2, ArrowRight } from 'lucide-react';
import { CountUp } from '../ui/CountUp';
import { Reveal } from '../ui/Reveal';

const CASE_STUDIES = [
  {
    industry: "Heavy Manufacturing",
    outcome: "Lightning Fast",
    context: "Reduced reporting time by 80%. A mid-size steel fabricator unified seven tools into one.",
    stat: 80,
    suffix: "%",
    barWidth: "80%",
    Icon: Factory,
  },
  {
    industry: "Logistics",
    outcome: "Secure Vaults",
    context: "Eliminated manual dispatch errors. A regional freight carrier automated their entire routing process.",
    stat: 100,
    suffix: "%",
    barWidth: "100%",
    Icon: Truck,
  },
  {
    industry: "AI Automation",
    outcome: "AI Automation",
    context: "Intelligent automation that learns from your workflow. Let AI handle the repetitive tasks.",
    stat: 3,
    suffix: "x",
    barWidth: "66%",
    Icon: Building2,
  },
  {
    industry: "Scale Forever",
    outcome: "Scale Forever",
    context: "A property management firm unified tenant screening and onboarding for 3x growth.",
    stat: 3,
    suffix: "x",
    barWidth: "66%",
    Icon: ArrowRight,
  }
];

export function Section5() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0); // First card preloaded

  return (
    <section id="results" className="py-24 md:py-32 bg-gradient-noise overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="relative z-10 w-full flex flex-col items-center">
        
        <div className="text-center mb-16 px-6 md:px-12">
          <Reveal delay={0}>
            <span className="text-[#64FFDA] font-sans text-sm tracking-[0.3em] uppercase mb-4 block">Success Stories</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-[#F8F9FA]">Results that matter.</h2>
          </Reveal>
        </div>

        <div className="flex flex-col md:flex-row gap-0 w-full h-[70vh] border-y border-[#8892B0]/20">
          {CASE_STUDIES.map((study, i) => {
            const isExpanded = hoveredIndex === i;
            const Icon = study.Icon;

            return (
              <motion.div
                key={i}
                layout
                onMouseEnter={() => setHoveredIndex(i)}
                className={`relative cursor-pointer overflow-hidden transition-all duration-500 ease-out p-8 md:p-10 flex flex-col border-r last:border-r-0 border-[#8892B0]/20
                  ${isExpanded 
                    ? 'flex-[3] bg-[#112240]' 
                    : 'flex-1 bg-[#0A192F] hover:bg-[#112240]/30'}`}
              >
                {/* Icon Box - Brand Teal */}
                <div 
                  className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-12 shrink-0 bg-[#64FFDA]"
                >
                  <Icon size={24} className="text-[#0A192F]" strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <motion.h3 
                    layout="position"
                    className={`font-display font-bold text-[#F8F9FA] leading-tight mb-6 uppercase tracking-wider
                      ${isExpanded ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl mt-auto'}`}
                  >
                    {study.outcome}
                  </motion.h3>

                  <AnimatePresence mode="wait">
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col"
                      >
                        <p className="text-[#8892B0] text-lg leading-relaxed mb-12 max-w-md font-sans">
                          {study.context}
                        </p>

                        <div className="flex items-center gap-10 mb-8">
                           <div className="flex flex-col">
                             <CountUp end={study.stat} suffix={study.suffix} className="text-4xl text-[#F8F9FA]" />
                             <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#64FFDA] mt-1">{study.industry}</span>
                           </div>
                        </div>

                        <button className="w-fit px-8 py-3 bg-[#64FFDA] text-[#0A192F] font-bold text-[10px] tracking-[0.2em] uppercase hover:opacity-90 transition-opacity">
                          Learn More
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Vertical Text for Collapsed State */}
                {!isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-10 left-10 md:left-12 origin-left whitespace-nowrap"
                  >
                    <span className="text-[#8892B0]/30 font-display font-bold text-[10px] tracking-[0.3em] uppercase block -rotate-90 origin-left translate-x-4">
                      {study.industry}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
