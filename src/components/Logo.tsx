import { forwardRef } from 'react';

export const Logo = forwardRef<SVGSVGElement, { className?: string }>(({ className }, ref) => {
  return (
    <svg 
      ref={ref}
      width="100" 
      height="100" 
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 0 0 H 100 V 100 H 80 V 20 H 0 Z" fill="currentColor" />
      <path d="M 0 30 H 70 V 100 H 50 V 50 H 0 Z" fill="currentColor" />
      <path d="M 0 60 H 40 V 100 H 20 V 80 H 0 Z" fill="currentColor" />
      <polygon points="0,100 20,100 0,80" fill="#64FFDA" />
    </svg>
  );
});
