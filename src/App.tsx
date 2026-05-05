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
import { AboutSection } from './components/AboutSection';
import { PlaceholderSection } from './components/PlaceholderSection';
import { PortfolioSection } from './components/PortfolioSection';
import { PlanSection } from './components/PlanSection';
import { Section6 } from './components/Section6';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { LogoIntro } from './components/LogoIntro';
import { IlluminationGrid } from './components/IlluminationGrid';
import Grainient from './components/Grainient';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync theme state with document class
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    // Initial check
    checkTheme();

    // Observe class changes on html element
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

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
    <main ref={mainRef} className="bg-transparent text-[#0A192F] dark:text-[#F8F9FA] cursor-none">
      <AnimatePresence>
        {!introDone && <LogoIntro key="intro" onComplete={() => setIntroDone(true)} />}
      </AnimatePresence>

      <CustomCursor />
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <Grainient
          color1={isDark ? "#4A5568" : "#F8FAFC"}
          color2={isDark ? "#112240" : "#F1F5F9"}
          color3={isDark ? "#0A192F" : "#E2E8F0"}
          timeSpeed={0.12}
          grainAmount={isDark ? 0.08 : 0.03}
          grainScale={2.2}
          grainAnimated
          warpStrength={0.4}
          warpFrequency={1.8}
          zoom={1.1}
          contrast={isDark ? 1.5 : 1.1}
        />
      </div>
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
          <div id="about">
            <AboutSection />
          </div>
          <div id="portfolio">
            <PortfolioSection />
          </div>
          <div id="pricing">
            <PlanSection />
          </div>
          <Section6 />
          <Footer />
        </>
      )}
    </main>
  );
}
