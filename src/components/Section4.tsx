import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { WorkflowDiagramUI } from './WorkflowDiagramUI';
import { CustomCanvasUI } from './CustomCanvasUI';
import { Reveal } from './Reveal';

export function Section4() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const introLeftRef = useRef<HTMLDivElement>(null);
  const introRightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      }
    });

    // Intro full-width moment
    tl.fromTo([introLeftRef.current, introRightRef.current],
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
    );
    
    // Collapse intro
    tl.to([introLeftRef.current, introRightRef.current],
      { opacity: 0, scale: 0.8, duration: 0.5, ease: "power2.in" }
    );

    // Cards slide in
    tl.fromTo(leftCardRef.current, 
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.2"
    );

    tl.fromTo(rightCardRef.current, 
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
      "-=1"
    );

    tl.fromTo(dividerRef.current,
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.2"
    );

  }, { scope: containerRef });

  return (
    <section id="solutions" ref={containerRef} className="relative py-32 bg-white dark:bg-[#0A192F] overflow-hidden">
      
      {/* Full-width Intro Moment */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 z-0">
        <div ref={introLeftRef} className="flex-1 h-64 border-r border-slate-300 dark:border-[#8892B0]/20 flex items-center justify-center opacity-0">
           <div className="w-full max-w-lg opacity-30"><WorkflowDiagramUI /></div>
        </div>
        <div ref={introRightRef} className="flex-1 h-64 flex items-center justify-center opacity-0">
           <div className="w-full max-w-lg opacity-30"><CustomCanvasUI /></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="relative flex flex-col md:flex-row items-stretch justify-center gap-12 md:gap-24">
          
          {/* Left Card */}
          <div 
            ref={leftCardRef}
            className="flex-1 flex flex-col bg-slate-50 dark:bg-[#112240] border border-slate-300 dark:border-[#8892B0]/20 rounded-none p-10 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:border-[#8892B0]/50"
          >
            <Reveal delay={0}><h3 className="text-3xl font-display font-medium text-[#0A192F] dark:text-[#F8F9FA] mb-2">Standard</h3></Reveal>
            <Reveal delay={0.1}><p className="text-[#0A192F]/70 dark:text-[#8892B0] text-sm mb-8 h-10">Pre-built automation workflows for your industry. Ready to deploy.</p></Reveal>
            
            <WorkflowDiagramUI />
            
            <div className="flex flex-col gap-4 flex-1 mb-10">
              <div className="border-t border-slate-300 dark:border-[#8892B0]/20 pt-4 text-[#0A192F] dark:text-[#F8F9FA] text-sm">Automated reporting & dashboards</div>
              <div className="border-t border-slate-300 dark:border-[#8892B0]/20 pt-4 text-[#0A192F] dark:text-[#F8F9FA] text-sm">Standard ERP/CRM integrations</div>
              <div className="border-t border-slate-300 dark:border-[#8892B0]/20 pt-4 text-[#0A192F] dark:text-[#F8F9FA] text-sm">Role-based access control</div>
              <div className="border-t border-slate-300 dark:border-[#8892B0]/20 pt-4 text-[#0A192F] dark:text-[#F8F9FA] text-sm">Email & Slack notifications</div>
            </div>

            <button className="w-full bg-[#0A192F] dark:bg-transparent border border-[#0A192F] dark:border-[#8892B0]/50 text-white dark:text-[#F8F9FA] hover:bg-[#0A192F]/80 dark:hover:bg-[#F8F9FA] dark:hover:text-[#0A192F] px-6 py-3 text-sm font-medium transition-colors rounded-none">
              See what's included
            </button>
          </div>

          {/* Divider */}
          <div className="hidden md:flex flex-col items-center justify-center relative w-px">
            <div ref={dividerRef} className="absolute top-0 bottom-0 w-px bg-[#8892B0]/30 origin-top"></div>
            <div className="bg-white dark:bg-[#0A192F] py-4 z-10 text-[#0A192F]/70 dark:text-[#8892B0] text-sm italic">or</div>
          </div>

          {/* Right Card */}
          <div 
            ref={rightCardRef}
            className="flex-1 flex flex-col bg-slate-50 dark:bg-[#112240] border border-slate-300 dark:border-[#8892B0]/20 rounded-none p-10 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:border-[#8892B0]/50"
          >
            <Reveal delay={0}><h3 className="text-3xl font-display font-medium text-[#0A192F] dark:text-[#F8F9FA] mb-2">Custom</h3></Reveal>
            <Reveal delay={0.1}><p className="text-[#0A192F]/70 dark:text-[#8892B0] text-sm mb-8 h-10">Built from the ground up around your specific workflows. No compromises.</p></Reveal>
            
            <CustomCanvasUI />
            
            <div className="flex flex-col gap-4 flex-1 mb-10">
              <div className="border-t border-slate-300 dark:border-[#8892B0]/20 pt-4 text-[#0A192F] dark:text-[#F8F9FA] text-sm">Bespoke system architecture</div>
              <div className="border-t border-slate-300 dark:border-[#8892B0]/20 pt-4 text-[#0A192F] dark:text-[#F8F9FA] text-sm">Legacy database migration</div>
              <div className="border-t border-slate-300 dark:border-[#8892B0]/20 pt-4 text-[#0A192F] dark:text-[#F8F9FA] text-sm">Custom AI model fine-tuning</div>
              <div className="border-t border-slate-300 dark:border-[#8892B0]/20 pt-4 text-[#0A192F] dark:text-[#F8F9FA] text-sm">Dedicated support SLA</div>
            </div>

            <button className="w-full bg-[#0A192F] dark:bg-[#F8F9FA] text-white dark:text-[#0A192F] hover:bg-[#8892B0] px-6 py-3 text-sm font-medium transition-colors rounded-none">
              Talk to us about your operation
            </button>
          </div>

        </div>

        <div className="text-center mt-16">
          <Reveal delay={0.2}><p className="text-[#0A192F]/70 dark:text-[#8892B0] text-sm">Not sure which fits? The Discovery Call will tell us.</p></Reveal>
        </div>

      </div>
    </section>
  );
}
