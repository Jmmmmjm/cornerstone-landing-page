"use client"
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Logo } from '../ui/Logo';

import React from "react"

export function Navbar({ onBookClick }: { onBookClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Pricing', href: '#pricing' }
  ];

  const appointmentLink = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2eEOUtyaVnNrgyCwVj_5zBnmIYLxtjY1xfkc8nQA_S3CvSQfvzaGxkmkdVg7A6LZuhULIgg9gC";

  // Dynamic colors based on scroll only (dark mode only)
  const activeTextColor = scrolled ? '#0A192F' : '#F8F9FA';
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
            boxShadow: scrolled ? '0 10px 30px -10px rgba(0, 0, 0, 0.04), 0 4px 10px -5px rgba(0, 0, 0, 0.02)' : 'none',
          }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 24,
            mass: 1.2,
          }}
          className={`pointer-events-auto flex items-center justify-between relative group/nav will-change-transform mx-4 md:mx-0 rounded-none border-none transition-[padding] duration-300 ${scrolled ? 'py-3 px-8' : 'py-6 px-6 md:px-16'}`}
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
              initial={false}
              animate={{
                backgroundColor: activeTextColor,
                color: scrolled ? '#FFFFFF' : '#0A192F',
                padding: scrolled ? '0.5rem 1rem' : '0.5rem 1.25rem',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBookClick}
              className="hidden sm:flex items-center justify-center min-w-[120px] h-10 border-none font-bold tracking-widest uppercase text-[10px] transition-colors duration-300 rounded-none cursor-none"
            >
              <span>Book a Call</span>
            </motion.button>

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
            className="fixed inset-0 z-[1000] bg-[#0A192F] pt-32 px-8 flex flex-col gap-8 md:hidden"
          >
            {navLinks.map((item, i) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-display font-bold text-[#F8F9FA] tracking-tighter uppercase border-b border-[#8892B0]/10 pb-4"
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
               <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookClick();
                }}
                className="block w-full py-5 bg-[#64FFDA] text-center font-bold tracking-widest uppercase text-xs text-[#0A192F] rounded-none cursor-none border-none"
               >
                 Book a Call
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
