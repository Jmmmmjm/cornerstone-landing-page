import { useEffect, useRef } from 'react';

export function IlluminationGrid() {
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

    const boxSize = 24;
    const gap = 6;
    const step = boxSize + gap;

    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let isHovering = false;
    let globalFade = 0;
    let clickRipple = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      if (!isHovering) {
        mouseX = targetMouseX;
        mouseY = targetMouseY;
        isHovering = true;
      }
    };

    const handleMouseLeave = () => {
      isHovering = false;
    };

    const handleClick = () => {
      clickRipple = 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (isHovering) {
        globalFade += (1 - globalFade) * 0.05;
        mouseX += (targetMouseX - mouseX) * 0.15;
        mouseY += (targetMouseY - mouseY) * 0.15;
      } else {
        globalFade += (0 - globalFade) * 0.02;
      }

      if (clickRipple > 0) {
        clickRipple -= 0.03;
        if (clickRipple < 0) clickRipple = 0;
      }

      if (globalFade < 0.01 && clickRipple === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      const isDarkMode = document.documentElement.classList.contains('dark');
      const radius = 250; // Increased radius for better visibility
      const maxOpacity = isDarkMode ? 0.15 : 0.25; // More noticeable in light mode

      ctx.strokeStyle = isDarkMode ? '#8892B0' : '#0A192F'; // Use navy in light mode
      ctx.lineWidth = isDarkMode ? 1 : 1.5; // Slightly thicker lines in light mode

      const startCol = Math.max(0, Math.floor((mouseX - radius) / step));
      const endCol = Math.min(Math.ceil(width / step), Math.ceil((mouseX + radius) / step));
      const startRow = Math.max(0, Math.floor((mouseY - radius) / step));
      const endRow = Math.min(Math.ceil(height / step), Math.ceil((mouseY + radius) / step));

      for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
          const x = c * step;
          const y = r * step;
          
          const cx = x + boxSize / 2;
          const cy = y + boxSize / 2;

          const dist = Math.sqrt(Math.pow(cx - mouseX, 2) + Math.pow(cy - mouseY, 2));

          if (dist < radius) {
            let opacity = maxOpacity * Math.pow(1 - dist / radius, 2);
            
            if (clickRipple > 0) {
              const rippleRadius = (1 - clickRipple) * radius * 1.5;
              const rippleDist = Math.abs(dist - rippleRadius);
              if (rippleDist < 40) {
                opacity += 0.3 * clickRipple * (1 - rippleDist / 40);
              }
            }

            opacity *= globalFade;

            if (opacity > 0.005) {
              ctx.globalAlpha = opacity;
              ctx.strokeRect(x, y, boxSize, boxSize);
            }
          }
        }
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[5] hidden md:block"
    />
  );
}
