import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function LegacyUI() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const windows = gsap.utils.toArray('.legacy-window');
    
    windows.forEach((win: any) => {
      gsap.to(win, {
        x: () => `+=${Math.random() * 15 - 7.5}`,
        y: () => `+=${Math.random() * 15 - 7.5}`,
        rotation: () => `+=${Math.random() * 2 - 1}`,
        duration: () => 4 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }, { scope: containerRef });

  const LegacyWindow = ({ className = "", title = "Legacy System", children }: { className?: string, title?: string, children?: React.ReactNode }) => (
    <div className={`legacy-window bg-white border border-gray-400 rounded-lg overflow-hidden shadow-2xl flex flex-col pointer-events-none ${className}`}>
      <div className="h-8 bg-[#D1D5DB] flex items-center justify-between px-3 border-b border-gray-400">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
        </div>
        <div className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">{title}</div>
        <div className="w-8"></div>
      </div>
      <div className="flex-1 bg-white p-4">
        {children}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="absolute inset-0 bg-[#0A192F] overflow-hidden">
      {/* Background noise grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      {/* Clutter Windows - Scattered in background */}
      <LegacyWindow title="Internal Mail" className="absolute top-[5%] left-[2%] w-[300px] h-[250px] opacity-40 -rotate-3">
        <div className="space-y-3">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
          <div className="h-2 bg-gray-200 rounded w-5/6"></div>
          <div className="h-2 bg-gray-100 rounded w-4/6"></div>
          <div className="h-12 bg-blue-50 border border-blue-100 rounded"></div>
        </div>
      </LegacyWindow>

      <LegacyWindow title="Terminal v2.0" className="absolute bottom-[10%] left-[5%] w-[400px] h-[200px] opacity-30 rotate-2">
        <div className="font-mono text-[8px] text-gray-500">
          &gt; EXPORT_DATA --format=csv --target=s3<br/>
          &gt; ERROR: Connection timed out (504)<br/>
          &gt; RETRYING... [3/10]
        </div>
      </LegacyWindow>

      <LegacyWindow title="Q4_Final_Final_v2.xlsx" className="absolute top-[10%] right-[2%] w-[350px] h-[300px] opacity-40 rotate-6">
        <div className="grid grid-cols-4 gap-1">
          {[...Array(24)].map((_, i) => (
            <div key={i} className={`h-3 rounded-sm ${i % 7 === 0 ? 'bg-red-100' : 'bg-gray-100'}`}></div>
          ))}
        </div>
      </LegacyWindow>

      <LegacyWindow title="Manual Override" className="absolute bottom-[15%] right-[8%] w-[280px] h-[180px] opacity-50 -rotate-2">
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className="w-10 h-10 rounded-full border-4 border-red-200 border-t-red-500"></div>
          <div className="text-[10px] text-red-600 font-bold">Awaiting Input...</div>
        </div>
      </LegacyWindow>

      {/* PRIMARY WINDOW - Matches Section2 "After" sizing exactly */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-full max-w-7xl px-6 md:px-12">
          <div className="legacy-window w-full h-[500px] bg-white border border-gray-400 rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="h-10 bg-[#D1D5DB] flex items-center justify-between px-4 border-b border-gray-400">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              </div>
              <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Main Dashboard (Deprecated)</div>
              <div className="w-12"></div>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              <div className="w-48 bg-[#F3F4F6] border-r border-gray-300 p-4 flex flex-col gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded border border-gray-300 flex items-center px-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-sm mr-2"></div>
                    <div className="h-2 bg-gray-300 rounded w-full"></div>
                  </div>
                ))}
              </div>
              <div className="flex-1 p-6 bg-white overflow-hidden">
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 h-32 bg-red-50 border border-red-200 rounded p-4">
                    <div className="text-[10px] font-bold text-red-800 uppercase mb-2">Critical Sync Error</div>
                    <div className="h-2 bg-red-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-red-100 rounded w-full"></div>
                  </div>
                  <div className="w-1/3 h-32 bg-gray-50 border border-gray-200 rounded p-4">
                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Idle Resource</div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-50 border border-gray-200 rounded flex items-center px-4 gap-4">
                      <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                      <div className="h-2 bg-gray-200 rounded flex-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-24"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


