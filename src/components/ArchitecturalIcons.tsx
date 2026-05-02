/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface IconProps {
  className?: string;
}

/**
 * TIER 1: FREE (THE FRAMEWORK)
 * Corrected to 1:1:1 Cube proportions (dx=30, dy=17.32, H=34.64)
 */
export const PlateIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20 40 L 50 22.68 L 80 40 L 50 57.32 Z" stroke="currentColor" strokeWidth="1.5" className="text-teal-500 opacity-60" />
    <path d="M 20 40 V 74.64 L 50 91.96 V 57.32" stroke="currentColor" strokeWidth="1.5" className="text-teal-600 opacity-60" />
    <path d="M 80 40 V 74.64 L 50 91.96" stroke="currentColor" strokeWidth="1.5" className="text-teal-800 opacity-60" />
  </svg>
);

/**
 * TIER 2: CAPSTONE (THE MODULE)
 */
export const BlockIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 50 20 L 80 37.32 L 50 54.64 L 20 37.32 Z" fill="currentColor" className="text-teal-500" />
    <path d="M 20 37.32 V 71.96 L 50 89.28 V 54.64 Z" fill="currentColor" className="text-teal-600" />
    <path d="M 80 37.32 V 71.96 L 50 89.28 V 54.64 Z" fill="currentColor" className="text-teal-800" />
  </svg>
);

/**
 * TIER 3: KEYSTONE (THE CORE)
 */
export const KeystoneIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20 35 L 50 17.68 L 80 35 L 50 52.32 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" className="text-teal-500" />
    <path d="M 20 35 V 69.64 L 50 86.96 V 52.32" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" className="text-teal-600" />
    <path d="M 80 35 V 69.64 L 50 86.96" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" className="text-teal-800" />
    <g transform="translate(0, 3)">
        <path d="M 50 40 L 60 45.77 L 50 51.54 L 40 45.77 Z" fill="currentColor" className="text-teal-400" />
        <path d="M 40 45.77 V 57.31 L 50 63.08 V 51.54 Z" fill="currentColor" className="text-teal-500" />
        <path d="M 60 45.77 V 57.31 L 50 63.08 V 51.54 Z" fill="currentColor" className="text-teal-700" />
    </g>
  </svg>
);

/**
 * TIER 4: CORNERSTONE (THE ASSEMBLY)
 * Scaled and centered with correct cube heights.
 */
export const CornerstoneIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Left Block */}
    <g transform="translate(-12, 12)">
      <path d="M 40 30 L 60 41.54 L 40 53.08 L 20 41.54 Z" fill="currentColor" className="text-teal-500" />
      <path d="M 20 41.54 V 64.64 L 40 76.18 V 53.08 Z" fill="currentColor" className="text-teal-600" />
      <path d="M 60 41.54 V 64.64 L 40 76.18 V 53.08 Z" fill="currentColor" className="text-teal-800" />
    </g>
    {/* Right Block */}
    <g transform="translate(12, 12)">
      <path d="M 60 30 L 80 41.54 L 60 53.08 L 40 41.54 Z" fill="currentColor" className="text-teal-600" />
      <path d="M 40 41.54 V 64.64 L 60 76.18 V 53.08 Z" fill="currentColor" className="text-teal-700" />
      <path d="M 80 41.54 V 64.64 L 60 76.18 V 53.08 Z" fill="currentColor" className="text-teal-900" />
    </g>
    {/* Top Locking Block */}
    <g transform="translate(0, -12)">
      <path d="M 50 25 L 70 36.54 L 50 48.08 L 30 36.54 Z" fill="currentColor" className="text-teal-400" />
      <path d="M 30 36.54 V 59.64 L 50 71.18 V 48.08 Z" fill="currentColor" className="text-teal-500" />
      <path d="M 70 36.54 V 59.64 L 50 71.18 V 48.08 Z" fill="currentColor" className="text-teal-700" />
    </g>
  </svg>
);

/**
 * TIER 5: CUSTOMER (THE ECOSYSTEM)
 */
export const FrameworkIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20 30 L 50 12.68 L 80 30 L 50 47.32 Z" stroke="currentColor" strokeWidth="1.5" className="text-teal-500" />
    <path d="M 20 55 L 50 37.68 L 80 55 L 50 72.32 Z" stroke="currentColor" strokeWidth="1.5" className="text-teal-500" />
    <path d="M 20 80 L 50 62.68 L 80 80 L 50 97.32 Z" stroke="currentColor" strokeWidth="1.5" className="text-teal-500" />
    
    <path d="M 20 30 V 80" stroke="currentColor" strokeWidth="1.5" className="text-teal-600" />
    <path d="M 50 47.32 V 97.32" stroke="currentColor" strokeWidth="1.5" className="text-teal-700" />
    <path d="M 80 30 V 80" stroke="currentColor" strokeWidth="1.5" className="text-teal-800" />
    
    <circle cx="50" cy="30" r="2.5" fill="currentColor" className="text-teal-400" />
    <circle cx="50" cy="55" r="2.5" fill="currentColor" className="text-teal-400" />
    <circle cx="50" cy="80" r="2.5" fill="currentColor" className="text-teal-400" />
  </svg>
);
