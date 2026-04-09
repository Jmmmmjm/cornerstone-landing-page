import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function WindowUI({ className = "", partial = false, buildAnimation = false }: { className?: string, partial?: boolean, buildAnimation?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!buildAnimation || !containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
      }
    });

    tl.fromTo(titleBarRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out", transformOrigin: "left" })
      .fromTo(sidebarRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" })
      .fromTo(mainRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2")
      .fromTo(contentRefs.current, 
        { opacity: 0, scale: 0.95 }, 
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: "back.out(1.2)" },
        "-=0.2"
      );

  }, { scope: containerRef, dependencies: [buildAnimation] });

  return (
    <div ref={containerRef} className={`flex flex-col bg-[#0A192F] border border-[#8892B0]/30 rounded-xl overflow-hidden shadow-2xl ${className}`}>
      {/* Title bar */}
      <div ref={titleBarRef} className="h-10 bg-[#112240] flex items-center px-4 gap-2 border-b border-[#8892B0]/20">
        <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
        <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
      </div>
      {/* Content */}
      <div className="flex-1 flex p-6 gap-6 bg-[#0A192F]">
        {/* Sidebar */}
        <div ref={sidebarRef} className="w-48 flex flex-col gap-4 border-r border-[#8892B0]/10 pr-6">
          <div className="h-6 bg-[#8892B0]/20 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-[#8892B0]/10 rounded w-full"></div>
          <div className="h-4 bg-[#8892B0]/10 rounded w-5/6"></div>
          <div className="h-4 bg-[#8892B0]/10 rounded w-full"></div>
          <div className="h-4 bg-[#8892B0]/10 rounded w-4/5"></div>
        </div>
        {/* Main */}
        <div ref={mainRef} className="flex-1 flex flex-col gap-6">
          <div ref={el => { contentRefs.current[0] = el; }} className={`h-32 rounded-lg border flex items-center justify-center transition-all duration-1000 ${partial ? 'bg-transparent border-dashed border-[#8892B0]/30' : 'bg-[#112240] border-[#8892B0]/20'}`}>
            {!partial && <div className="w-16 h-16 rounded-full border-4 border-[#8892B0]/30 border-t-[#64FFDA]"></div>}
          </div>
          <div className="flex gap-6 flex-1">
            <div ref={el => { contentRefs.current[1] = el; }} className={`flex-1 rounded-lg border p-4 flex flex-col gap-3 transition-all duration-1000 ${partial ? 'bg-transparent border-dashed border-[#8892B0]/30' : 'bg-[#112240] border-[#8892B0]/20'}`}>
               {!partial && (
                 <>
                   <div className="h-4 bg-[#8892B0]/20 rounded w-1/2"></div>
                   <div className="h-full bg-[#8892B0]/10 rounded"></div>
                 </>
               )}
            </div>
            <div ref={el => { contentRefs.current[2] = el; }} className={`flex-1 rounded-lg border p-4 flex flex-col gap-3 transition-all duration-1000 ${partial ? 'bg-transparent border-dashed border-[#8892B0]/30' : 'bg-[#112240] border-[#8892B0]/20'}`}>
               {!partial && (
                 <>
                   <div className="h-4 bg-[#8892B0]/20 rounded w-1/3"></div>
                   <div className="h-full bg-[#8892B0]/10 rounded"></div>
                 </>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
