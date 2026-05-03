import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { Logo } from './Logo';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial theme from HTML class or localStorage
    const hasDarkClass = document.documentElement.classList.contains('dark');
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newDark = !prev;
      if (newDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newDark;
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none py-4">
      <motion.nav
        initial={false}
        animate={{
          y: scrolled ? 0 : 20,
          width: scrolled ? 'min(calc(100% - 3rem), 900px)' : '100%',
          backgroundColor: scrolled ? (isDark ? 'rgba(10, 25, 47, 0.85)' : 'rgba(255, 255, 255, 0.85)') : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
          borderRadius: '0px',
          borderWidth: scrolled ? '1px' : '0px',
          borderColor: scrolled ? (isDark ? 'rgba(100, 255, 218, 0.15)' : 'rgba(20, 184, 166, 0.2)') : 'transparent',
          padding: scrolled ? '0.6rem 1.5rem 0.6rem 2rem' : '1.5rem 3rem',
          boxShadow: scrolled ? (isDark ? '0 10px 40px -10px rgba(2, 12, 27, 0.8), 0 0 30px rgba(100, 255, 218, 0.08)' : '0 10px 40px -10px rgba(0, 0, 0, 0.05)') : 'none',
        }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 32,
          mass: 0.8,
        }}
        className="pointer-events-auto flex items-center justify-between relative group/nav will-change-transform"
      >
        <div className="flex items-center gap-2 relative z-10">
          <Logo className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-[#0A192F] dark:text-[#F8F9FA] font-display font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs whitespace-nowrap">
            Cornerstone
          </span>
        </div>

        <div className={`hidden md:flex items-center gap-10 ${scrolled ? 'mx-12' : 'absolute left-1/2 -translate-x-1/2'}`}>
          {['About', 'Portfolio', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[#0A192F]/70 dark:text-[#8892B0] hover:text-teal-600 dark:hover:text-[#64FFDA] text-[10px] font-bold tracking-[0.15em] uppercase transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-teal-500 dark:bg-[#64FFDA] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button 
            onClick={toggleTheme}
            className="text-[#0A192F]/70 dark:text-[#8892B0] hover:text-teal-600 dark:hover:text-[#64FFDA] transition-colors p-1"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <motion.a
            initial={false}
            animate={{
              backgroundColor: scrolled ? (isDark ? '#64FFDA' : '#0d9488') : 'transparent',
              color: scrolled ? (isDark ? '#0A192F' : '#ffffff') : (isDark ? '#64FFDA' : '#0d9488'),
              borderRadius: '0px',
              padding: scrolled ? '0.5rem 1.25rem' : '0.5rem 1.5rem',
              scale: 1,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://calendar.google.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 border border-teal-500 dark:border-[#64FFDA]/50 font-bold tracking-widest uppercase text-[10px] transition-colors duration-300"
            style={{
              boxShadow: scrolled ? (isDark ? '0 0 15px rgba(100, 255, 218, 0.25)' : '0 0 10px rgba(20, 184, 166, 0.2)') : 'none',
            }}
          >
            <span>{scrolled ? 'Connect' : 'Book a Call'}</span>
            <motion.span
              initial={false}
              animate={{ opacity: scrolled ? 1 : 0, x: scrolled ? 0 : -5 }}
              transition={{ duration: 0.2 }}
            >
              &rarr;
            </motion.span>
          </motion.a>
        </div>
      </motion.nav>
    </div>
  );
}
