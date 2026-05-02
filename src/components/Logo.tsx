import { forwardRef } from 'react';
import { motion } from 'motion/react';

export const Logo = forwardRef<SVGSVGElement, { className?: string; isAnimated?: boolean }>(({ className, isAnimated = false }, ref) => {
  const transition = { duration: 1, ease: "easeInOut" };

  return (
    <svg 
      ref={ref}
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer L-shape */}
      <motion.path 
        d="M 0 0 H 100 V 100 H 80 V 20 H 0 Z" 
        fill="currentColor" 
        className="text-[#0A192F] dark:text-[#F8F9FA]"
        initial={isAnimated ? { pathLength: 0, opacity: 0 } : {}}
        animate={isAnimated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, ease: "easeInOut", delay: 0 }}
      />
      
      {/* Inner L-shape */}
      <motion.path 
        d="M 0 30 H 70 V 100 H 50 V 50 H 0 Z" 
        fill="currentColor" 
        className="text-[#0A192F] dark:text-[#F8F9FA]"
        initial={isAnimated ? { pathLength: 0, opacity: 0 } : {}}
        animate={isAnimated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
      />
      
      {/* The Triangle */}
      <motion.path 
        d="M 0 60 H 40 V 100 Z" 
        fill="currentColor" 
        className="text-slate-400 dark:text-[#8892B0]"
        initial={isAnimated ? { opacity: 0, x: -10, y: 10 } : {}}
        animate={isAnimated ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
});

