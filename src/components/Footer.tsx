export function Footer() {
  return (
    <footer className="bg-[#0A192F] border-t border-[#8892B0]/20 py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <span className="text-[#F8F9FA] font-display font-medium tracking-widest uppercase text-sm">
            Cornerstone
          </span>
          <span className="text-[#8892B0] text-sm hidden md:inline">
            — Enterprise automation for traditional industries.
          </span>
        </div>

        <div className="flex items-center gap-8 text-[#8892B0] text-sm">
          <a href="#" className="hover:text-[#F8F9FA] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#F8F9FA] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#F8F9FA] transition-colors">Contact</a>
        </div>

      </div>
    </footer>
  );
}
