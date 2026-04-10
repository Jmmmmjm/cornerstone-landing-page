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
        trigger: "html",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
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

    // Trigger 2: Transition Line Phase (Connects Hero Scroll Label to Section 2 Slider)
    ScrollTrigger.create({
      trigger: heroSection,
      start: "bottom 15%", // Starts slightly BEFORE Hero fully unpins
      end: "+=550%", // Spans gap + full Section 2 pin duration
      scrub: true,
      onUpdate: (self) => {
        if (!sharedLineContainerRef.current || !sharedLineRef.current) return;
        const p = self.progress;

        const isDark = document.documentElement.classList.contains('dark');
        
        // p=0: Hero unpins. Label is moving up with the section.
        // We track the anchor element which is pinned inside Hero.
        const anchor = document.getElementById('hero-scroll-anchor');
        if (!anchor) return;
        
        const anchorRect = anchor.getBoundingClientRect();
        // Keep the line's top at the label until it hits the screen top, then pin it to 0
        let topPosPx = Math.max(0, anchorRect.bottom);

        // Calculate line height
        let finalHeight = 0;
        if (topPosPx === 0) {
          // If pinned to top, it should span the whole screen height
          finalHeight = window.innerHeight;
        } else if (p < 0.05) {
          // Initial growth downwards from the label
          let growP = p / 0.05;
          let distanceToBottom = window.innerHeight - topPosPx; 
          finalHeight = distanceToBottom * growP;
        } else {
          // Spanning from label to bottom
          finalHeight = window.innerHeight - topPosPx;
        }

        // Manage clean fade in/out
        let opacity = 1;
        if (p < 0.02) {
          opacity = p / 0.02; 
        } else if (p > 0.98) {
          opacity = 1 - ((p - 0.98) / 0.02);
        }

        gsap.set(sharedLineContainerRef.current, {
          top: `${topPosPx}px`, 
          width: '2px', 
          height: `${Math.max(0, finalHeight)}px`,
          opacity: opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start'
        });

        // Maintain aesthetic with margins
        let lineGrowthP = Math.min(1, p / 0.05);
        let currentHeight = 48 + (lineGrowthP * ( (finalHeight * 0.6) - 48 ));
        let currentMarginTop = lineGrowthP * (finalHeight * 0.2);

        gsap.set(sharedLineRef.current, { 
          height: `${currentHeight}px`,
          marginTop: `${currentMarginTop}px`,
          backgroundColor: '#FFFFFF', 
          boxShadow: '0 0 20px rgba(255,255,255,0.3)',
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
          <Section2 />
          <HorizontalScrollSection />
          <Section3 />
          <Section4 />
          <Section5 />
          <Section6 />
          <Footer />
        </>
      )}
    </main>
  );
}
