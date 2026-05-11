import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ConversationUI } from '../ui/ConversationUI';
import { SystemMapUI } from '../ui/SystemMapUI';
import { LiveWindowUI } from '../ui/LiveWindowUI';

export function Section3() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(() => {
    if (!containerRef.current || !sliderRef.current) return;

    const panels = gsap.utils.toArray('.process-panel');

    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%",
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          const step = Math.round(self.progress * 2);
          setActiveStep(step);
        }
      }
    });
  }, { scope: containerRef });

  return (
    <section id="process" ref={containerRef} data-scroll-anim className="relative h-screen bg-gradient-noise overflow-hidden">
      
      {/* Progress Bar */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        {[0, 1, 2].map((step) => (
          <div 
            key={step} 
            className={`h-1 w-12 rounded-none transition-colors duration-300 ${activeStep === step ? 'bg-[#F8F9FA]' : 'bg-[#8892B0]/30'}`}
          />
        ))}
      </div>

      <div ref={sliderRef} className="flex w-[300vw] h-full">
        
        {/* Step 1 */}
        <div className="process-panel w-screen h-full flex items-center justify-center px-12 md:px-24">
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-baseline gap-6 mb-6">
                <span className="text-6xl md:text-8xl font-display font-bold text-[#8892B0]/10 select-none">01</span>
                <h3 className="text-3xl md:text-4xl font-display font-medium text-[#F8F9FA]">Discovery Call</h3>
              </div>
              <p className="text-[#8892B0] text-lg leading-relaxed mb-10">
                We start by understanding your current workflows, your pain points, and your scale. No sales pitch, just a deep dive into how your operation runs today.
              </p>
              <a href="https://calendar.google.com" target="_blank" rel="noreferrer" className="inline-block border border-[#F8F9FA] text-[#F8F9FA] hover:bg-[#F8F9FA] hover:text-[#0A192F] px-6 py-3 text-sm font-medium transition-colors rounded-none">
                Book your Discovery Call
              </a>
            </div>
            <div className="flex justify-center">
              <ConversationUI />
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="process-panel w-screen h-full flex items-center justify-center px-12 md:px-24">
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-baseline gap-6 mb-6">
                <span className="text-6xl md:text-8xl font-display font-bold text-[#8892B0]/10 select-none">02</span>
                <h3 className="text-3xl md:text-4xl font-display font-medium text-[#F8F9FA]">Follow Up Call</h3>
              </div>
              <p className="text-[#8892B0] text-lg leading-relaxed mb-10">
                We come back with a mapped solution. We show you exactly what gets automated, what gets integrated, and what the system looks like for your specific operation.
              </p>
            </div>
            <div className="flex justify-center">
              <SystemMapUI />
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="process-panel w-screen h-full flex items-center justify-center px-12 md:px-24 relative">
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-baseline gap-6 mb-6">
                <span className="text-6xl md:text-8xl font-display font-bold text-[#8892B0]/10 select-none">03</span>
                <h3 className="text-3xl md:text-4xl font-display font-medium text-[#F8F9FA]">Kick-off Call</h3>
              </div>
              <p className="text-[#8892B0] text-lg leading-relaxed mb-10">
                We align on pricing, implementation timeline, and go-live planning. By this point, the foundation is set and we're ready to build.
              </p>
            </div>
            <div className="flex justify-center">
              {/* Removed LiveWindowUI as it's now shared and handled globally */}
              <div className="w-full max-w-md h-[300px] border border-[#8892B0]/20 rounded-none bg-[#112240]/50 flex items-center justify-center">
                 <p className="text-[#8892B0] text-sm italic">System Ready</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Fixed Bottom Summary */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center z-20">
        <p className="text-[#8892B0] font-sans text-sm tracking-widest uppercase mb-4">
          Three conversations. Then we build.
        </p>
        <a href="https://calendar.google.com" target="_blank" rel="noreferrer" className="inline-block border border-[#F8F9FA] text-[#F8F9FA] hover:bg-[#F8F9FA] hover:text-[#0A192F] px-6 py-3 text-sm font-medium transition-colors rounded-none">
          Book a Call
        </a>
      </div>

    </section>
  );
}
