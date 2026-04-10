/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Section2 } from './components/Section2';
import { Section3 } from './components/Section3';
import { Section4 } from './components/Section4';
import { Section5 } from './components/Section5';
import { Section6 } from './components/Section6';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { SectionTransition } from './components/SectionTransition';
import { LogoIntro } from './components/LogoIntro';
import { IlluminationGrid } from './components/IlluminationGrid';
import { WindowUI } from './components/WindowUI';
import { Logo } from './components/Logo';
import { HorizontalScrollSection } from './components/HorizontalScrollSection';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sharedLogoContainerRef = useRef<HTMLDivElement>(null);
  const sharedLineContainerRef = useRef<HTMLDivElement>(null);
  const sharedLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!introDone) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    gsap.to(scrollbarRef.current, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1
      }
    });

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [introDone]);

  useGSAP(() => {
    if (!introDone) return;
    const allSections = gsap.utils.toArray<HTMLElement>('section');
    const heroSection = allSections[0];
    const section2 = allSections[1];

    if (!heroSection || !section2) return;

    // Trigger 2: Transition Line Phase (Grows from Scroll Label at 78%)
    ScrollTrigger.create({
      trigger: section2,
      start: "top top",
      end: "+=400%", // Explicitly match Section2 pin duration!
      scrub: 1,
      onUpdate: (self) => {
        if (!sharedLineContainerRef.current || !sharedLineRef.current) return;
        const p = self.progress;

        const isDark = document.documentElement.classList.contains('dark');
        const lineColor = isDark ? '#FFFFFF' : '#0A192F';
        const shadowColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(10,25,47,0.5)';

        let topPos = 78;
        let finalHeight = 2; // px

        if (p < 0.2) {
          const growP = p / 0.2;
          finalHeight = 2 + (growP * (window.innerHeight * 0.22)); 
        } else {
          const slideP = (p - 0.2) / 0.8;
          topPos = 78 - (slideP * 78);
          finalHeight = (window.innerHeight * 0.22) + (slideP * (window.innerHeight * 0.78));
        }

        // Manage clean fade in/out perfectly within this single timeline
        let opacity = 1;
        if (p < 0.01) {
          opacity = p / 0.01;
        } else if (p > 0.98) {
          opacity = 1 - ((p - 0.98) / 0.02);
        }

        gsap.set(sharedLineContainerRef.current, {
          top: `${topPos}%`, 
          width: '2px', // Restored precision width
          height: `${finalHeight}px`,
          opacity: opacity,
        });

        gsap.set(sharedLineRef.current, { 
          backgroundColor: lineColor, // Strict theme color
          boxShadow: `0 0 12px ${shadowColor}`,
        });
      }
    });

  }, { dependencies: [introDone] });

  return (
    <main ref={mainRef} className="bg-white dark:bg-[#0A192F] text-[#0A192F] dark:text-[#F8F9FA] cursor-none">
      <AnimatePresence>
        {!introDone && <LogoIntro key="intro" onComplete={() => setIntroDone(true)} />}
      </AnimatePresence>

      <CustomCursor />
      <IlluminationGrid />

      {/* Transition Line (Starts at bottom Scroll label) */}
      <div 
        id="shared-transition-line"
        ref={sharedLineContainerRef}
        className="fixed top-[78%] left-1/2 z-[500] w-[2px] h-[2px] pointer-events-none opacity-0"
      >
        <div ref={sharedLineRef} className="w-full h-full rounded-none" />
      </div>

      {/* Custom Scrollbar */}
      <div className="fixed top-0 right-0 w-1.5 h-full bg-slate-50 dark:bg-[#112240] z-[100] hidden md:block">
        <div ref={scrollbarRef} className="w-full bg-teal-500 dark:bg-[#64FFDA] origin-top scale-y-0 rounded-none" style={{ height: '100%' }} />
      </div>

      {introDone && (
        <>
          <div className="relative z-[1000]">
            <Navbar />
          </div>
          <Hero />
          <SectionTransition />
          <Section2 />
          <SectionTransition />
          <HorizontalScrollSection />
          <SectionTransition />
          <Section3 />
          <SectionTransition />
          <Section4 />
          <SectionTransition />
          <Section5 />
          <SectionTransition />
          <Section6 />
          <Footer />
        </>
      )}
    </main>
  );
}
