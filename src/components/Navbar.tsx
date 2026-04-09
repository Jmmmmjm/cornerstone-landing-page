import { useEffect, useState } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500 ${scrolled ? 'pt-6' : 'pt-0'}`}>
      <nav className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ${
        scrolled 
          ? 'bg-[#112240] border border-[#8892B0]/30 rounded-full px-8 py-3 shadow-2xl w-auto gap-8 md:gap-12' 
          : 'bg-transparent w-full px-6 md:px-12 py-6'
      }`}>
        <div className="flex items-center gap-3">
          {scrolled && <div className="w-2 h-2 rounded-full bg-[#64FFDA]"></div>}
          <span className="text-[#F8F9FA] font-display font-medium tracking-widest uppercase text-sm">Cornerstone</span>
        </div>
        
        <div className={`hidden md:flex items-center gap-8`}>
          <a href="#process" className="text-[#8892B0] hover:text-[#F8F9FA] text-sm font-medium transition-colors">Process</a>
          <a href="#solutions" className="text-[#8892B0] hover:text-[#F8F9FA] text-sm font-medium transition-colors">Solutions</a>
          <a href="#results" className="text-[#8892B0] hover:text-[#F8F9FA] text-sm font-medium transition-colors">Case Studies</a>
        </div>

        <a href="https://calendar.google.com" target="_blank" rel="noreferrer" className={`text-sm font-medium transition-colors flex items-center gap-2 ${
          scrolled
            ? 'text-[#64FFDA] hover:text-[#F8F9FA]'
            : 'border border-[#F8F9FA] text-[#F8F9FA] hover:bg-[#F8F9FA] hover:text-[#0A192F] px-5 py-2'
        }`}>
          Book a Call {scrolled && <span>&rarr;</span>}
        </a>
      </nav>
    </div>
  );
}
