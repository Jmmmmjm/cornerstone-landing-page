/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  const sharedWindowRef = useRef<HTMLDivElement>(null);
  const sharedLogoRef = useRef<SVGSVGElement>(null);
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

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Custom scrollbar animation
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

    // --- SHARED OBJECT (LOGO → LINE) ANIMATION ---
    // Object starts as Logo in Hero center → morphs into a Vertical Line → travels to Section 2

    const allSections = gsap.utils.toArray<HTMLElement>('section');
    const heroSection = allSections[0];
    const section2 = allSections[1];

    // Initial state for the shared container (opacity 0, Hero will fade it in)
    gsap.set(sharedWindowRef.current, { 
      opacity: 0, 
      left: '50%', 
      top: '40%',
      xPercent: -50,
      yPercent: -50,
      width: '100px',
      height: '100px',
      scale: 0.8
    });
    // Ensure logo paths are hidden initially for the drawing effect
    if (sharedLogoRef.current) {
      gsap.set(sharedLogoRef.current.querySelectorAll('path, polygon'), { opacity: 0 });
    }
    gsap.set(sharedLineRef.current, { opacity: 0, height: '0%' });

    // Force a refresh after components mount
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // --- SHARED OBJECT (LOGO → LINE) ANIMATION ---
    // Trigger 1: Hero Pin Phase (Logo stays static, then shrinks to dot at the very end of the pin)
    ScrollTrigger.create({
      trigger: heroSection,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        if (!sharedWindowRef.current || !sharedLogoRef.current || !sharedLineRef.current) return;
        const p = self.progress;

        if (p < 0.98) {
          // STATIC: Logo is solid and static at 40%
          // Title is gone by p = 0.53. This gives a massive buffer.
          gsap.set(sharedWindowRef.current, {
            top: '40%',
            width: '100px',
            height: '100px',
            yPercent: -50,
            opacity: 1
          });
          gsap.set(sharedLogoRef.current, { opacity: 1, scale: 1 });
          gsap.set(sharedLineRef.current, { opacity: 0 });
        } else {
          // MORPH: Shrink to dot (0.98 -> 1.0 of the pin duration)
          const dotP = (p - 0.98) / 0.02;
          gsap.set(sharedLogoRef.current, { 
            opacity: 1 - dotP,
            scale: 1 - (dotP * 0.98)
          });
          gsap.set(sharedWindowRef.current, {
            width: `${100 - (dotP * 98)}px`,
            height: `${100 - (dotP * 98)}px`,
            top: '40%',
            yPercent: -50
          });
        }
      }
    });

    // Trigger 2: Transition Phase (Dot grows into full-height line while moving to Section 2)
    // Synchronized to start when Section 2 fills the screen and finish as it reveals its content.
    ScrollTrigger.create({
      trigger: section2,
      start: "top top",
      end: "+=100vh", // Line forms over the first 100vh of the S2 pin duration
      scrub: 1,
      onUpdate: (self) => {
        if (!sharedWindowRef.current || !sharedLogoRef.current || !sharedLineRef.current) return;
        const p = self.progress;

        // Ensure logo is hidden
        gsap.set(sharedLogoRef.current, { opacity: 0 });

        // Growth: From top: 40% (2px high) to top: 0% (100vh high)
        // Shifting from 40% to 0% and 2px to 100vh
        gsap.set(sharedWindowRef.current, {
          top: `${40 - (p * 40)}%`, 
          width: '2px',
          height: `calc(2px + ${p * 100}vh)`,
          yPercent: 0,
        });

        gsap.set(sharedLineRef.current, { 
          opacity: 1,
          height: '100%',
          backgroundColor: '#64FFDA',
          boxShadow: '0 0 15px rgba(100,255,218,0.5)',
          borderRadius: '2px'
        });
      }
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [introDone]);

  return (
    <main ref={mainRef} className="bg-[#0A192F] text-[#F8F9FA] cursor-none">
      {!introDone && <LogoIntro onComplete={() => setIntroDone(true)} />}

      <CustomCursor />
      <IlluminationGrid />

      {/* Shared Global Transitioning Object (Logo → Line) */}
      <div 
        id="shared-global-object"
        ref={sharedWindowRef}
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] w-[100px] h-[100px] pointer-events-none flex items-center justify-center opacity-0`}
      >
        {/* Logo State */}
        <Logo ref={sharedLogoRef} className="absolute text-[#F8F9FA]" />
        
        {/* Line State */}
        <div ref={sharedLineRef} className="w-full opacity-0 rounded-full" />
      </div>

      {/* Custom Scrollbar */}
      <div className="fixed top-0 right-0 w-1.5 h-full bg-[#112240] z-[100] hidden md:block">
        <div ref={scrollbarRef} className="w-full bg-[#64FFDA] origin-top scale-y-0 rounded-full" style={{ height: '100%' }} />
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
