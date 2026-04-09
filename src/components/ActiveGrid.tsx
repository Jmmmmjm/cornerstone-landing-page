import { useEffect, useRef } from 'react';

export function ActiveGrid() {
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

    let animationFrameId: number;
    let time = 0;

    const draw = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      ctx.strokeStyle = `rgba(136, 146, 176, 0.1)`;
      ctx.lineWidth = 1;

      ctx.beginPath();
      
      // Draw lines converging to center
      const numLines = 24;
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2;
        
        // Animated offset moving towards center
        const offset = (time + (i % 2) * 0.5) % 1;
        const radiusStart = Math.max(width, height) * offset;
        const radiusEnd = Math.max(width, height);
        
        const x1 = centerX + Math.cos(angle) * radiusStart;
        const y1 = centerY + Math.sin(angle) * radiusStart;
        
        const x2 = centerX + Math.cos(angle) * radiusEnd;
        const y2 = centerY + Math.sin(angle) * radiusEnd;

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }

      ctx.stroke();
      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
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
