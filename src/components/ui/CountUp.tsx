"use client"
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import React from "react"

export function CountUp({ end, suffix = "", duration = 2, className = "" }: { end: number, suffix?: string, duration?: number, className?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    const obj = { val: 0 };
    
    gsap.to(obj, {
      val: end,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
      },
      onUpdate: () => {
        setCount(Math.floor(obj.val));
      }
    });
  }, [end, duration]);

  return (
    <div ref={ref} className={className}>
      {count}{suffix}
    </div>
  );
}
