"use client"
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import React from "react"

export function WorkflowDiagramUI() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll('.flow-path-active');
    
    gsap.to(paths, {
      strokeDashoffset: -40,
      duration: 1,
      repeat: -1,
      ease: "linear"
    });
  }, []);

  return (
    <div className="w-full h-32 bg-[#0A192F] rounded-none border border-[#8892B0]/20 mb-6 flex items-center justify-center overflow-hidden relative">
      <svg ref={svgRef} viewBox="0 0 300 100" className="w-full h-full">
        {/* Base paths */}
        <path d="M 40 50 L 100 50 L 150 20 L 240 20 M 100 50 L 150 80 L 240 80" stroke="#8892B0" strokeWidth="2" fill="none" opacity="0.2" />
        
        {/* Animated flowing paths */}
        <path className="flow-path-active" d="M 40 50 L 100 50 L 150 20 L 240 20" stroke="#64FFDA" strokeWidth="2" fill="none" strokeDasharray="8 8" />
        <path className="flow-path-active" d="M 100 50 L 150 80 L 240 80" stroke="#64FFDA" strokeWidth="2" fill="none" strokeDasharray="8 8" />
        
        {/* Nodes */}
        <rect x="10" y="35" width="30" height="30" fill="#112240" stroke="#8892B0" strokeWidth="2" />
        <rect x="240" y="5" width="30" height="30" fill="#112240" stroke="#64FFDA" strokeWidth="2" />
        <rect x="240" y="65" width="30" height="30" fill="#112240" stroke="#64FFDA" strokeWidth="2" />
      </svg>
    </div>
  );
}
