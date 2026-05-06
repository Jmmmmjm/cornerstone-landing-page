import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { Logo } from './Logo';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Pricing', href: '#pricing' }
  ];

  const appointmentLink = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2eEOUtyaVnNrgyCwVj_5zBnmIYLxtjY1xfkc8nQA_S3CvSQfvzaGxkmkdVg7A6LZuhULIgg9gC";

  // Dynamic colors based on scroll and theme
  const activeTextColor = scrolled 
    ? '#0A192F' 
    : (isDark ? '#F8F9FA' : '#0A192F');
  
  const navBg = scrolled ? '#FFFFFF' : 'rgba(255, 255, 255, 0)';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[1001] flex justify-center pointer-events-none py-4 md:py-6">
        <motion.nav
          initial={false}
          animate={{
            y: scrolled ? 0 : 10,
            width: scrolled ? 'min(calc(100% - 3rem), 1100px)' : '100%',
            backgroundColor: navBg,
            padding: scrolled ? '0.75rem 2rem' : '1.5rem 3rem md:px-16',
            boxShadow: scrolled ? '0 10px 30px -10px rgba(0, 0, 0, 0.04), 0 4px 10px -5px rgba(0, 0, 0, 0.02)' : 'none',
          }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 24,
            mass: 1.2,
          }}
          className="pointer-events-auto flex items-center justify-between relative group/nav will-change-transform mx-4 md:mx-0 rounded-none border-none"
        >
          <div className="flex items-center gap-2 relative z-10">
            <motion.div animate={{ color: activeTextColor }} transition={{ duration: 0.4 }}>
              <Logo className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
            <motion.span 
              animate={{ color: activeTextColor }}
              transition={{ duration: 0.4 }}
              className="font-display font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs whitespace-nowrap"
            >
              Cornerstone
            </motion.span>
          </div>

          <div className={`hidden md:flex items-center gap-10 ${scrolled ? 'mx-12' : 'absolute left-1/2 -translate-x-1/2'}`}>
            {navLinks.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                animate={{ color: activeTextColor }}
                transition={{ duration: 0.4 }}
                className="text-[10px] font-bold tracking-[0.15em] uppercase transition-colors relative group"
              >
                {item.name}
                <motion.span 
                  animate={{ backgroundColor: activeTextColor }}
                  className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full" 
                />
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-6 relative z-10">
            <motion.button 
              onClick={toggleTheme}
              animate={{ color: activeTextColor }}
              className="transition-colors p-2 opacity-70 hover:opacity-100"
              aria-label="Toggle Theme"
            >
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </motion.button>
            
            <motion.a
              initial={false}
              animate={{
                backgroundColor: activeTextColor,
                color: scrolled ? '#FFFFFF' : (isDark ? '#0A192F' : '#FFFFFF'),
                padding: scrolled ? '0.5rem 1rem' : '0.5rem 1.25rem',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={appointmentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center min-w-[120px] h-10 border-none font-bold tracking-widest uppercase text-[10px] transition-colors duration-300 rounded-none"
            >
              <span>Book a Call</span>
            </motion.a>

            <motion.button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              animate={{ color: activeTextColor }}
              className="md:hidden p-2"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </motion.nav>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[1000] bg-white pt-32 px-8 flex flex-col gap-8 md:hidden"
          >
            {navLinks.map((item, i) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-display font-bold text-[#0A192F] tracking-tighter uppercase border-b border-slate-100 pb-4"
              >
                {item.name}
              </motion.a>
            ))}
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-auto pb-12"
            >
               <a 
                href={appointmentLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-5 bg-[#0A192F] text-center font-bold tracking-widest uppercase text-xs text-white rounded-none"
               >
                 Book a Call
               </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
