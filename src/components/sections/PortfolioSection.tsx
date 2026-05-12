/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';
import { useMotionValueEvent } from 'motion/react';
import { motion, useScroll, useTransform } from 'motion/react';

const projects = [
  {
    id: 'creativevision',
    client: 'CREATIVEVISION',
    type: 'CONTENT AGENCY',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '4six-creative',
    client: '4SIX CREATIVE',
    type: 'SOCIAL AGENCY',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
  }
];

export function PortfolioSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    (window as any).__PORTFOLIO_PROGRESS = v;
    if (v > 0.8) {
      console.log('PORTFOLIO scrollYProgress:', v);
    }
  });

  // Title: explicitly at full opacity from 0 → 0.45, then fades out by 0.75
  const titleOpacity = useTransform(scrollYProgress, [0, 0.45, 0.75, 1], [1, 1, 0, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.45, 0.75, 1], [1, 1, 0.92, 0.92]);

  // Images slide up simultaneously as title fades
  const projectsY = useTransform(scrollYProgress, [0.15, 0.55, 1], [900, 0, 0]);
  const projectsOpacity = useTransform(scrollYProgress, [0.15, 0.55, 1], [0, 1, 1]);

  console.log('PORTFOLIO: titleOpacity at current scroll =', titleOpacity.get());

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full bg-transparent">
      
      {/* Sticky Reveal Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden isolate">
        
        {/* Background Layer: FEATURED PROJECTS - fades out */}
        <motion.div 
          style={{ opacity: titleOpacity, scale: titleScale }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none px-6 md:px-12 z-0"
        >
           <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-12 lg:gap-20 w-full">
              <h2 className="text-4xl md:text-8xl lg:text-[10rem] font-display font-bold text-[#F8F9FA] tracking-tighter leading-none uppercase">
                 FEATURED
              </h2>

              {/* Invisible spacer matching CURATED column width */}
              <div className="hidden md:block w-[60px] md:w-[100px] lg:w-[140px] shrink-0 invisible" />

              <h2 className="text-4xl md:text-8xl lg:text-[10rem] font-display font-bold text-[#F8F9FA] tracking-tighter leading-none uppercase">
                 PROJECTS
              </h2>
           </div>
        </motion.div>

        {/* OUTPUT column - hidden or simplified on mobile to save space */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="flex flex-col items-center shrink-0 opacity-20 md:opacity-100">
            <div className="w-6 md:w-12 lg:w-16 h-3 md:h-5 border-t-[2px] md:border-t-[3px] border-x-[2px] md:border-x-[3px] border-teal-500/90" />
            <div className="flex flex-col items-center gap-2 md:gap-4 py-4 md:py-8">
               {['O','U','T','P','U','T'].map((char, i) => (
                  <span 
                    key={i} 
                    className="text-lg md:text-4xl lg:text-5xl font-display font-black text-[#64FFDA] leading-none"
                    style={{ 
                      WebkitTextStroke: '1px md:1.5px currentColor',
                      paintOrder: 'stroke fill',
                      strokeLinejoin: 'round'
                    }}
                  >
                     {char}
                  </span>
               ))}
            </div>
            <div className="w-6 md:w-12 lg:w-16 h-3 md:h-5 border-b-[2px] md:border-b-[3px] border-x-[2px] md:border-x-[3px] border-teal-500/90" />
          </div>
        </div>

        {/* MAIN INTERACTIVE LAYER - Projects slide up at FULL opacity */}
        <motion.div 
           style={{ y: projectsY, opacity: projectsOpacity }}
           className="relative z-10 w-full max-w-[1800px] px-6 md:px-12 lg:px-24 flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center gap-12 md:gap-16 lg:gap-32"
        >
           {/* Left Project */}
           <div className="flex justify-center md:justify-end w-full">
              <ProjectCard project={projects[0]} side="left" />
           </div>

           {/* Central Spacer (Matches CURATED column width) */}
           <div className="hidden md:block w-[60px] md:w-[100px] lg:w-[140px] invisible" />

           {/* Right Project */}
           <div className="flex justify-center md:justify-start w-full">
              <ProjectCard project={projects[1]} side="right" />
           </div>
        </motion.div>
      </div>

      <div className="h-screen" />
    </div>
  );
}

function ProjectCard({ project, side }: { project: typeof projects[0], side: 'left' | 'right' }) {
  return (
    <div className={`w-full max-w-[400px] md:max-w-[550px] flex flex-col group cursor-pointer ${side === 'right' ? 'md:translate-y-16' : 'md:-translate-y-16'}`}>
      <div className="relative aspect-[16/11] overflow-hidden bg-[#112240] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5">
         <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            src={project.img} 
            alt={project.client}
            className="w-full h-full object-cover transition-all duration-700" 
         />
      </div>
      
      <div className={`mt-8 flex flex-col ${side === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
         <h3 className="font-mono text-[10px] md:text-xs tracking-widest text-[#F8F9FA]/40 uppercase mb-2">
            {project.type}
         </h3>
         <span className="font-display text-2xl md:text-4xl font-bold text-[#64FFDA] tracking-tighter uppercase leading-none">
            {project.client}
         </span>
      </div>
    </div>
  );
}
