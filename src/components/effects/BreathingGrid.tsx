"use client"
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import React from "react"

export function BreathingGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    gsap.to(containerRef.current, {
      scale: 1.05,
      opacity: 0.8,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50">
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(136, 146, 176, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(136, 146, 176, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          backgroundPosition: 'center center'
        }}
      />
    </div>
  );
}
