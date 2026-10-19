import React from 'react';
import { Wrench, Settings, Ruler } from 'lucide-react';

// Custom clean Hanger SVG line icon matching the mockup style
function HangerIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3a2 2 0 0 0-2 2c0 1.1.9 2 2 2 1.5 0 2 .8 2 2v1" />
      <path d="M12 10 2.5 17a1 1 0 0 0 .6 1.7h17.8a1 1 0 0 0 .6-1.7L12 10Z" />
    </svg>
  );
}

export function BenefitBar() {
  // Bottom category glass bar is now integrated directly inside HeroSection matching Target Image 2
  return null;
}
