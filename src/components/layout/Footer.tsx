import Grainient from '../effects/Grainient';

export function Footer() {
  return (
    <footer className="relative bg-transparent overflow-hidden pb-12">
      {/* 1. THE REFINED SVG MASK DEFINITION */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-0 overflow-visible" aria-hidden="true">
        <defs>
          <mask id="cornerstone-mask" maskUnits="userSpaceOnUse">
            {/* White: Background is visible */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black: This area becomes transparent (the hole) */}
            <text
              x="50%"
              y="-70"
              textAnchor="middle"
              fill="black"
              stroke="black"
              strokeWidth="0.02em"
              className="font-display uppercase"
              dominantBaseline="text-before-edge"
              style={{
                fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '16vw' : '13.5vw',
                letterSpacing: '-0.05em',
                fontWeight: 900,
                paintOrder: 'stroke fill'
              }}
            >
              Cornerstone
            </text>
          </mask>
        </defs>
      </svg>

      {/* 2. THE FOOTER BASE LAYER (The slate/cyan background) 
           We apply the mask here. 
      */}
      <div
        className="absolute -top-px inset-x-0 bottom-0 z-0"
        style={{
          mask: 'url(#cornerstone-mask)',
          WebkitMask: 'url(#cornerstone-mask)'
        }}
      >
        <Grainient
          color1="#299682ff"
          color2="#70d1bb"
          color3="#5a9ea3"
          timeSpeed={0.12}
          grainAmount={0.05}
          grainScale={2.0}
          grainAnimated warpStrength={0.4}
          warpFrequency={1.8}
          zoom={1.1}
          contrast={1.1}
        />
      </div>

      {/* 3. Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 mt-24 md:mt-56">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16 md:mb-24">

          {/* Column 1: Navigation */}
          <div className="col-span-1">
            <ul className="space-y-3">
              {['Home', 'About Us', 'Architecture', 'Solutions'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-900/80 hover:text-slate-900 transition-colors text-xs md:text-sm font-bold tracking-wide uppercase">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Connect */}
          <div className="col-span-1">
            <ul className="space-y-3">
              {['LinkedIn', 'Twitter', 'GitHub', 'Docs'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-900/80 hover:text-slate-900 transition-colors text-xs md:text-sm font-bold tracking-wide uppercase">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Telemetry / Status */}
          <div className="col-span-2 flex flex-col justify-end items-start md:items-end mt-4 md:mt-0">
            <div className="text-left md:text-right font-mono text-[9px] md:text-[10px] text-slate-900/60 space-y-1 font-bold uppercase">
              <p>System Status: Operational</p>
              <p>Build: v2.4.0-Stable</p>
              <p>Latency: 24ms // Protocol: Secure</p>
            </div>
          </div>
        </div>

        {/* 4. Final Legal Row */}
        <div className="pt-8 border-t border-slate-900/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[9px] md:text-[10px] text-slate-900/70 tracking-wider font-bold uppercase">
            © 2026 Cornerstone Industrial Systems • All Rights Reserved
          </p>
          <div className="flex gap-8 font-mono text-[9px] md:text-[10px] uppercase tracking-wider text-slate-900/70 font-bold">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
