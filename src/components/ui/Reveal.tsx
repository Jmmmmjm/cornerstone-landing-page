"use client"
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import React from "react"

gsap.registerPlugin(ScrollTrigger);

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!innerRef.current || !ref.current) return;
    gsap.fromTo(innerRef.current,
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
        }
      }
    );
  }, { scope: ref });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
