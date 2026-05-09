/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CustomCursor } from './components/CustomCursor';
import { IlluminationGrid } from './components/IlluminationGrid';
import Grainient from './components/Grainient';

// Lazy load sections
const AboutSection = lazy(() => import('./components/AboutSection').then(module => ({ default: module.AboutSection })));
const PortfolioSection = lazy(() => import('./components/PortfolioSection').then(module => ({ default: module.PortfolioSection })));
const PlanSection = lazy(() => import('./components/PlanSection').then(module => ({ default: module.PlanSection })));
const Section6 = lazy(() => import('./components/Section6').then(module => ({ default: module.Section6 })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
const LogoIntro = lazy(() => import('./components/LogoIntro').then(module => ({ default: module.LogoIntro })));

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

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    if (!isTouchDevice) {
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

      const tickerHandler = (time: number) => {
        lenis.raf(time * 1000);
      };
      
      gsap.ticker.add(tickerHandler);
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
        gsap.ticker.remove(tickerHandler);
        ScrollTrigger.getAll().forEach(t => t.kill());
        observer.disconnect();
      };
    }

    // Still want scrollbar and refresh on touch
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
      ScrollTrigger.getAll().forEach(t => t.kill());
      observer.disconnect();
    };
  }, [introDone]);

  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  return (
    <main ref={mainRef} className="bg-transparent text-[#0A192F] dark:text-[#F8F9FA] cursor-none">
      <AnimatePresence>
        {!introDone && (
          <Suspense fallback={null}>
            <LogoIntro key="intro" onComplete={() => setIntroDone(true)} />
          </Suspense>
        )}
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
          grainAnimated={!isTouchDevice}
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
        <Suspense fallback={null}>
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
        </Suspense>
      )}
    </main>
  );
}
