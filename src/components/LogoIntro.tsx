import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

export function LogoIntro({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Give enough time for the full animation sequence before transitioning out
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[10000] bg-white dark:bg-[#0A192F] flex flex-col items-center justify-center text-[#0A192F] dark:text-[#F8F9FA]"
    >
      <div className="flex flex-col items-center gap-8">
        <Logo className="w-32 h-32" isAnimated={true} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-[0.3em] uppercase">
            Cornerstone
          </h1>
        </motion.div>
      </div>
    </motion.div>
  );
}

