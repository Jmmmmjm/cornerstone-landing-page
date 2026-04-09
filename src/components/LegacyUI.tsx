import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function LegacyUI() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const fragments = gsap.utils.toArray('.legacy-fragment');
    
    fragments.forEach((frag: any) => {
      gsap.to(frag, {
        x: () => `+=${Math.random() * 20 - 10}`,
        y: () => `+=${Math.random() * 20 - 10}`,
        rotation: () => `+=${Math.random() * 4 - 2}`,
        duration: () => 2 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-[#020813]">
      {/* Spreadsheet */}
      <div className="legacy-fragment absolute top-[10%] left-[5%] w-[300px] h-[200px] bg-white text-black p-3 shadow-lg rotate-[-3deg] opacity-80">
        <div className="border-b border-gray-300 pb-2 mb-3 font-bold text-sm">Q3 Financials.xlsx</div>
        <div className="grid grid-cols-4 gap-2 text-[10px]">
          <div className="bg-gray-200 h-4"></div><div className="bg-gray-100 h-4"></div><div className="bg-gray-100 h-4"></div><div className="bg-gray-100 h-4"></div>
          <div className="bg-gray-200 h-4"></div><div className="bg-gray-100 h-4"></div><div className="bg-gray-100 h-4"></div><div className="bg-gray-100 h-4"></div>
          <div className="bg-gray-200 h-4"></div><div className="bg-gray-100 h-4"></div><div className="bg-gray-100 h-4"></div><div className="bg-gray-100 h-4"></div>
          <div className="bg-gray-200 h-4"></div><div className="bg-gray-100 h-4"></div><div className="bg-gray-100 h-4"></div><div className="bg-gray-100 h-4"></div>
        </div>
      </div>
      
      {/* Email */}
      <div className="legacy-fragment absolute top-[40%] left-[20%] w-[350px] h-[180px] bg-[#f0f0f0] text-black p-4 shadow-xl rotate-[2deg] opacity-90 border border-gray-300">
        <div className="text-xs font-bold mb-2">Fwd: URGENT: Data mismatch</div>
        <div className="text-[10px] text-gray-600 mb-3 border-b border-gray-300 pb-2">From: boss@company.com</div>
        <div className="text-[11px] leading-relaxed">Can someone please consolidate these reports? We have 4 different numbers for the same metric. This is unacceptable.</div>
      </div>
      
      {/* Error Dialog */}
      <div className="legacy-fragment absolute bottom-[20%] left-[10%] w-[280px] h-[120px] bg-gray-100 text-black shadow-2xl border-t-4 border-red-500 p-4 z-10">
        <div className="text-sm font-bold text-red-600 mb-2">System Error</div>
        <div className="text-[11px] text-gray-700">ERP Sync failed. Please manually export CSV and upload to the portal.</div>
        <div className="mt-4 flex justify-end"><div className="bg-gray-300 px-4 py-1 text-[10px] font-bold cursor-pointer">OK</div></div>
      </div>
      
      {/* Paper Form */}
      <div className="legacy-fragment absolute top-[15%] left-[35%] w-[250px] h-[350px] bg-[#fdfdfd] shadow-md rotate-[6deg] opacity-70 p-6 border border-gray-200">
        <div className="text-center text-xs font-bold mb-6 uppercase tracking-widest border-b border-black pb-2">Intake Form</div>
        <div className="border-b border-gray-400 h-6 mb-4"></div>
        <div className="border-b border-gray-400 h-6 mb-4"></div>
        <div className="border-b border-gray-400 h-6 mb-4"></div>
        <div className="border-b border-gray-400 h-6 mb-4"></div>
      </div>
    </div>
  )
}
