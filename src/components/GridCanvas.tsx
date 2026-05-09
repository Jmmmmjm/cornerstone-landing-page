import { useEffect, useRef } from 'react';
import { store } from '../store';

export function GridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      draw();
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    let isVisible = false;

    const draw = () => {
      if (!isVisible) return;

      const progress = store.progress;
      
      // Grid phase: 0.2 to 0.4
      let gridProgress = 0;
      if (progress >= 0.2) {
        gridProgress = Math.min(1, (progress - 0.2) / 0.2);
      }
      
      if (gridProgress <= 0) {
        ctx.clearRect(0, 0, width, height);
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Fade out slightly in phase 5
      let baseOpacity = 0.15;
      if (progress >= 0.85) {
        baseOpacity = 0.15 * (1 - ((progress - 0.85) / 0.15) * 0.5); // Fade to half
      }

      // Breathing pulse
      const time = Date.now() / 2000; // slow breath
      const breath = (Math.sin(time * Math.PI) + 1) / 2; // 0 to 1
      const finalOpacity = baseOpacity * (0.6 + breath * 0.4);

      ctx.strokeStyle = `rgba(136, 146, 176, ${finalOpacity})`;
      ctx.lineWidth = 1;

      const cellSize = 60;
      const centerX = width / 2;
      const centerY = height / 2;

      const maxDistX = width / 2;
      const maxDistY = height / 2;
      
      const currentDistX = maxDistX * gridProgress;
      const currentDistY = maxDistY * gridProgress;

      ctx.beginPath();
      
      // Vertical lines
      for (let x = 0; x <= maxDistX; x += cellSize) {
        if (x <= currentDistX) {
          ctx.moveTo(centerX + x, centerY - currentDistY);
          ctx.lineTo(centerX + x, centerY + currentDistY);
          if (x > 0) {
            ctx.moveTo(centerX - x, centerY - currentDistY);
            ctx.lineTo(centerX - x, centerY + currentDistY);
          }
        }
      }

      // Horizontal lines
      for (let y = 0; y <= maxDistY; y += cellSize) {
        if (y <= currentDistY) {
          ctx.moveTo(centerX - currentDistX, centerY + y);
          ctx.lineTo(centerX + currentDistX, centerY + y);
          if (y > 0) {
            ctx.moveTo(centerX - currentDistX, centerY - y);
            ctx.lineTo(centerX + currentDistX, centerY - y);
          }
        }
      }

      ctx.stroke();
      animationFrameId = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          animationFrameId = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const unsubscribe = store.subscribe(() => {
      // Re-trigger draw if progress changes and it was potentially idle
      if (isVisible && store.progress >= 0.2) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(draw);
      }
    });
    
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      unsubscribe();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
