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
import { PlaceholderSection } from './components/PlaceholderSection';
import { PlanSection } from './components/PlanSection';
import { Section6 } from './components/Section6';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { LogoIntro } from './components/LogoIntro';
import { IlluminationGrid } from './components/IlluminationGrid';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

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

  return (
    <main ref={mainRef} className="bg-[#F8F9FA] dark:bg-[#0A192F] text-[#0A192F] dark:text-[#F8F9FA] cursor-none">
      <AnimatePresence>
        {!introDone && <LogoIntro key="intro" onComplete={() => setIntroDone(true)} />}
      </AnimatePresence>

      <CustomCursor />
      <IlluminationGrid />

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
          <PlaceholderSection title="About" number={2} />
          <PlaceholderSection title="Portfolio" number={3} />
          <PlanSection />
          <Section6 />
          <Footer />
        </>
      )}
    </main>
  );
}
