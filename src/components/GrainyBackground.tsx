/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export function GrainyBackground() {
  const isMobile = typeof window !== 'undefined' 
    && window.matchMedia('(pointer: coarse)').matches
    && window.innerWidth < 1024;

  if (isMobile) {
    // Static fallback — zero GPU cost, visually close enough
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#F8F9FA] dark:bg-[#0A192F]"
        style={{
          background: 'radial-gradient(ellipse at 20% 20%, rgba(100,255,218,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(99,102,241,0.07) 0%, transparent 60%)'
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#F8F9FA] dark:bg-[#0A192F] transition-colors duration-700">
      
      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.2] dark:opacity-[0.15] mix-blend-overlay z-[2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Mesh Gradients */}
      <div className="absolute inset-0 z-[1]">
        {/* Top Left Blob */}
        <motion.div 
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-teal-200/20 dark:bg-teal-500/10 blur-[60px] will-change-transform"
        />

        {/* Middle Right Blob */}
        <motion.div 
          animate={{
            x: [0, -50, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-200/20 dark:bg-indigo-500/10 blur-[60px] will-change-transform"
        />

        {/* Bottom Left Blob */}
        <motion.div 
          animate={{
            x: [0, 30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-[10%] -left-[5%] w-[45%] h-[45%] rounded-full bg-teal-100/30 dark:bg-[#64FFDA]/5 blur-[60px] will-change-transform"
        />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-200/20 dark:to-black/30 z-[3]" />
    </div>
  );
}
