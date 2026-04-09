/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
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

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const scrollbarRef = useRef<HTMLDivElement>(null);

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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

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

    return () => {
      lenis.destroy();
    };
  }, [introDone]);

  return (
    <main className="bg-[#0A192F] min-h-screen text-[#F8F9FA] cursor-none">
      {!introDone && <LogoIntro onComplete={() => setIntroDone(true)} />}
      
      <CustomCursor />
      <IlluminationGrid />
      
      {/* Custom Scrollbar */}
      <div className="fixed top-0 right-0 w-1.5 h-full bg-[#112240] z-[100] hidden md:block">
        <div ref={scrollbarRef} className="w-full bg-[#64FFDA] origin-top scale-y-0 rounded-full" style={{ height: '100%' }} />
      </div>

      <Navbar />
      <Hero />
      <SectionTransition />
      <Section2 />
      <SectionTransition />
      <Section3 />
      <SectionTransition />
      <Section4 />
      <SectionTransition />
      <Section5 />
      <SectionTransition />
      <Section6 />
      <Footer />
    </main>
  );
}
