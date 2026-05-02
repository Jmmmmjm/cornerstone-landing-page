import { useRef, useEffect, useState } from 'react';
import { WindowUI } from './WindowUI';

export function LiveWindowUI({ className = "" }: { className?: string }) {
  const [count, setCount] = useState(1240);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 5));
      setProgress(p => {
        if (p >= 100) {
          setStatus(true);
          return 100;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <WindowUI className="w-full h-full absolute inset-0" />
      
      {/* Live Overlay Elements */}
      <div className="absolute inset-0 z-10 flex p-6 gap-6 pt-16 pointer-events-none">
        <div className="w-48 pr-6 border-r border-transparent flex flex-col justify-end pb-4">
           <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-none ${status ? 'bg-teal-500 dark:bg-[#64FFDA]' : 'bg-[#FF5F56]'}`}></div>
             <span className="text-xs font-mono text-[#0A192F]/70 dark:text-[#8892B0]">{status ? 'SYSTEM ONLINE' : 'SYNCING...'}</span>
           </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-6">
          <div className="h-32 flex items-center justify-center">
            <div className="text-4xl font-mono text-[#0A192F] dark:text-[#F8F9FA] tracking-wider">
              {count.toLocaleString()}
            </div>
          </div>
          <div className="flex gap-6 flex-1">
            <div className="flex-1 p-4 flex flex-col justify-end">
               <div className="w-full h-2 bg-[#F8F9FA] dark:bg-[#0A192F] rounded-none overflow-hidden">
                 <div className="h-full bg-teal-500 dark:bg-[#64FFDA] transition-all duration-100" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
            <div className="flex-1 p-4 flex items-end justify-between">
               <div className="w-4 h-16 bg-[#8892B0]/30 rounded-none"></div>
               <div className="w-4 h-24 bg-[#8892B0]/30 rounded-none"></div>
               <div className="w-4 h-12 bg-[#8892B0]/30 rounded-none"></div>
               <div className="w-4 h-32 bg-teal-500 dark:bg-[#64FFDA]/80 rounded-none"></div>
               <div className="w-4 h-20 bg-[#8892B0]/30 rounded-none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
