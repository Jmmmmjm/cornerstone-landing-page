"use client"

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import React from "react"

interface IconProps {
  className?: string;
  isHovered?: boolean;
}

const springTransition = { type: 'spring', stiffness: 200, damping: 25 } as const;
const slowSpring = { type: 'spring', stiffness: 40, damping: 20, mass: 1.5 } as const;

/**
 * TIER 1: FOUNDATION (FREE)
 * Kinetic wireframe draw + subtle float
 */
export const PlateIcon = ({ className, isHovered = false }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.g animate={{ y: isHovered ? -5 : 0 }} transition={springTransition}>
      <motion.path 
        d="M 20 40 L 50 22.68 L 80 40 L 50 57.32 Z" 
        stroke="currentColor" strokeWidth="1.5" className="text-teal-500"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, opacity: isHovered ? 1 : 0.4 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.path 
        d="M 20 40 V 74.64 L 50 91.96 V 57.32" 
        stroke="currentColor" strokeWidth="1.5" className="text-teal-600"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, opacity: isHovered ? 0.8 : 0.3 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      />
      <motion.path 
        d="M 80 40 V 74.64 L 50 91.96" 
        stroke="currentColor" strokeWidth="1.5" className="text-teal-800"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, opacity: isHovered ? 0.6 : 0.2 }}
        transition={{ duration: 1.5, delay: 0.4 }}
      />
    </motion.g>
  </svg>
);

/**
 * TIER 2: FRAMEWORK (CAPSTONE)
 * Internal logic sweep
 */
export const BlockIcon = ({ className, isHovered = false }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.g animate={{ scale: isHovered ? 1.05 : 1 }} transition={springTransition}>
      <path d="M 50 20 L 80 37.32 L 50 54.64 L 20 37.32 Z" fill="currentColor" className="text-teal-500" />
      <path d="M 20 37.32 V 71.96 L 50 89.28 V 54.64 Z" fill="currentColor" className="text-teal-600" />
      <path d="M 80 37.32 V 71.96 L 50 89.28 V 54.64 Z" fill="currentColor" className="text-teal-800" />
      
      {/* Logic Pulse */}
      <motion.path 
        d="M 20 45 L 50 62.32 L 80 45" 
        stroke="currentColor" strokeWidth="2" className="text-teal-300"
        animate={{ 
            opacity: isHovered ? [0, 1, 0] : 0,
            y: isHovered ? [0, 30] : 0 
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </motion.g>
  </svg>
);

/**
 * TIER 3: ASSEMBLY (KEYSTONE)
 * High-stiffness snap flip
 */
export const KeystoneIcon = ({ className, isHovered = false }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.g animate={{ scale: isHovered ? 1.1 : 1 }} transition={springTransition}>
        <path d="M 20 35 L 50 17.68 L 80 35 L 50 52.32 Z" stroke="currentColor" strokeWidth="2" className="text-teal-500 opacity-40" />
        <path d="M 20 35 V 69.64 L 50 86.96 V 52.32" stroke="currentColor" strokeWidth="2" className="text-teal-600 opacity-30" />
        <path d="M 80 35 V 69.64 L 50 86.96" stroke="currentColor" strokeWidth="2" className="text-teal-800 opacity-20" />
        
        <motion.g 
          animate={{ rotateY: isHovered ? 180 : 0, y: isHovered ? -2 : 0 }}
          transition={springTransition}
          style={{ transformOrigin: '50px 52px' }}
        >
            <path d="M 50 40 L 60 45.77 L 50 51.54 L 40 45.77 Z" fill="currentColor" className="text-teal-400 shadow-[0_0_10px_rgba(100,255,218,0.5)]" />
            <path d="M 40 45.77 V 57.31 L 50 63.08 V 51.54 Z" fill="currentColor" className="text-teal-500" />
            <path d="M 60 45.77 V 57.31 L 50 63.08 V 51.54 Z" fill="currentColor" className="text-teal-700" />
        </motion.g>
    </motion.g>
  </svg>
);

/**
 * TIER 4: CORE SYSTEM (CORNERSTONE)
 * Parts convergence and brightness flash
 */
export const CornerstoneIcon = ({ className, isHovered = false }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.g 
      animate={{ 
        y: isHovered ? -5 : 0, 
        filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
      }} 
      transition={slowSpring}
    >
      {/* Bottom Left Cube */}
      <motion.g 
        initial={{ x: -15, y: 15, opacity: 0 }}
        animate={{ 
          x: isHovered ? 0 : -8, 
          y: isHovered ? 0 : 8,
          opacity: isHovered ? 1 : 0.8 
        }} 
        transition={slowSpring}
      >
        <path d="M 30 45 L 50 56.54 L 30 68.08 L 10 56.54 Z" fill="currentColor" className="text-teal-500" />
        <path d="M 10 56.54 V 79.64 L 30 91.18 V 68.08 Z" fill="currentColor" className="text-teal-600" />
        <path d="M 50 56.54 V 79.64 L 30 91.18 V 68.08 Z" fill="currentColor" className="text-teal-800" />
      </motion.g>

      {/* Bottom Right Cube */}
      <motion.g 
        initial={{ x: 15, y: 15, opacity: 0 }}
        animate={{ 
          x: isHovered ? 0 : 8, 
          y: isHovered ? 0 : 8,
          opacity: isHovered ? 1 : 0.8 
        }} 
        transition={slowSpring}
      >
        <path d="M 70 45 L 90 56.54 L 70 68.08 L 50 56.54 Z" fill="currentColor" className="text-teal-600" />
        <path d="M 50 56.54 V 79.64 L 70 91.18 V 68.08 Z" fill="currentColor" className="text-teal-700" />
        <path d="M 90 56.54 V 79.64 L 70 91.18 V 68.08 Z" fill="currentColor" className="text-teal-900" />
      </motion.g>

      {/* Top Cube */}
      <motion.g 
        initial={{ y: -20, opacity: 0 }}
        animate={{ 
          y: isHovered ? 0 : -12,
          opacity: isHovered ? 1 : 0.9 
        }} 
        transition={slowSpring}
      >
        <path d="M 50 15 L 70 26.54 L 50 38.08 L 30 26.54 Z" fill="currentColor" className="text-teal-400" />
        <path d="M 30 26.54 V 49.64 L 50 61.18 V 38.08 Z" fill="currentColor" className="text-teal-500" />
        <path d="M 70 26.54 V 49.64 L 50 61.18 V 38.08 Z" fill="currentColor" className="text-teal-700" />
      </motion.g>
    </motion.g>
  </svg>
);

/**
 * TIER 5: ECOSYSTEM (CUSTOMER)
 * Radial expansion + complex node network
 */
export const FrameworkIcon = ({ className, isHovered = false }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.g animate={{ scale: isHovered ? 1.05 : 1, rotate: isHovered ? 5 : 0 }} transition={springTransition}>
      {/* Central Core */}
      <motion.path 
        d="M 50 35 L 65 43.66 L 50 52.32 L 35 43.66 Z" 
        fill="currentColor" className="text-teal-500"
        animate={{ opacity: isHovered ? 1 : 0.6 }}
      />
      <motion.path 
        d="M 35 43.66 V 58.32 L 50 66.98 V 52.32 Z" 
        fill="currentColor" className="text-teal-600"
        animate={{ opacity: isHovered ? 1 : 0.5 }}
      />
      <motion.path 
        d="M 65 43.66 V 58.32 L 50 66.98 V 52.32 Z" 
        fill="currentColor" className="text-teal-800"
        animate={{ opacity: isHovered ? 1 : 0.4 }}
      />

      {/* Orbiting Nodes and Connections */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const r = 35;
        const x = 50 + Math.cos(rad) * r;
        const y = 50 + Math.sin(rad) * r;
        
        return (
          <motion.g key={i}>
            {/* Connection Line */}
            <motion.line 
              x1="50" y1="50" x2={x} y2={y}
              stroke="currentColor" strokeWidth="1"
              className="text-teal-500/30"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isHovered ? 1 : 0.5, opacity: isHovered ? 0.6 : 0.2 }}
            />
            {/* Outer Node */}
            <motion.rect
              x={x - 4} y={y - 4} width="8" height="8"
              fill="none" stroke="currentColor" strokeWidth="1"
              className="text-teal-400"
              animate={{ 
                rotate: isHovered ? 90 : 0,
                scale: isHovered ? [1, 1.2, 1] : 1,
                opacity: isHovered ? 1 : 0.4
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
            />
            {/* Little Data Bit */}
            {isHovered && (
              <motion.circle
                r="1.5" fill="currentColor" className="text-teal-300"
                animate={{ 
                  cx: [50, x],
                  cy: [50, y],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "circIn" }}
              />
            )}
          </motion.g>
        );
      })}
    </motion.g>
  </svg>
);
