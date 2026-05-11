import { useEffect, useRef } from 'react';

export function StaticGrid() {
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

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = `rgba(136, 146, 176, 0.05)`; // Very faint
      ctx.lineWidth = 1;

      const cellSize = 60;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.beginPath();
      
      // Vertical lines
      for (let x = 0; x <= width / 2; x += cellSize) {
        ctx.moveTo(centerX + x, 0);
        ctx.lineTo(centerX + x, height);
        if (x > 0) {
          ctx.moveTo(centerX - x, 0);
          ctx.lineTo(centerX - x, height);
        }
      }

      // Horizontal lines
      for (let y = 0; y <= height / 2; y += cellSize) {
        ctx.moveTo(0, centerY + y);
        ctx.lineTo(width, centerY + y);
        if (y > 0) {
          ctx.moveTo(0, centerY - y);
          ctx.lineTo(width, centerY - y);
        }
      }

      ctx.stroke();
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      draw();
    };
    
    window.addEventListener('resize', handleResize);
    draw();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
