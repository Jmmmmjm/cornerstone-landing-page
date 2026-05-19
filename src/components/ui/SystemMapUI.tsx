"use client"
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import React from "react"

export function SystemMapUI() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const nodes = svgRef.current.querySelectorAll('.node');
    const lines = svgRef.current.querySelectorAll('.line');

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    tl.fromTo(nodes, 
      { scale: 0, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.2, ease: "back.out(1.5)", transformOrigin: "center" }
    );
    
    tl.fromTo(lines,
      { strokeDasharray: "0 1000" },
      { strokeDasharray: "1000 1000", duration: 1.5, ease: "power2.inOut" },
      "-=0.5"
    );

  }, []);

  return (
    <div className="w-full max-w-md bg-[#112240] rounded-none border border-[#8892B0]/20 p-6 h-[300px] flex items-center justify-center">
      <svg ref={svgRef} viewBox="0 0 400 300" className="w-full h-full">
        {/* Lines */}
        <path className="line" d="M 100 150 L 200 150" stroke="#64FFDA" strokeWidth="2" fill="none" />
        <path className="line" d="M 200 150 L 300 100" stroke="#64FFDA" strokeWidth="2" fill="none" />
        <path className="line" d="M 200 150 L 300 200" stroke="#64FFDA" strokeWidth="2" fill="none" />
        
        {/* Nodes */}
        <circle className="node" cx="100" cy="150" r="20" fill="#0A192F" stroke="#8892B0" strokeWidth="2" />
        <circle className="node" cx="200" cy="150" r="24" fill="#0A192F" stroke="#64FFDA" strokeWidth="2" />
        <circle className="node" cx="300" cy="100" r="20" fill="#0A192F" stroke="#8892B0" strokeWidth="2" />
        <circle className="node" cx="300" cy="200" r="20" fill="#0A192F" stroke="#8892B0" strokeWidth="2" />

        {/* Labels */}
        <text className="node" x="100" y="190" fill="#8892B0" fontSize="10" textAnchor="middle">Legacy ERP</text>
        <text className="node" x="200" y="195" fill="#64FFDA" fontSize="12" textAnchor="middle">Cornerstone</text>
        <text className="node" x="300" y="70" fill="#8892B0" fontSize="10" textAnchor="middle">Reporting</text>
        <text className="node" x="300" y="240" fill="#8892B0" fontSize="10" textAnchor="middle">Alerts</text>
      </svg>
    </div>
  );
}
