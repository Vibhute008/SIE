'use client';

import { useState, useEffect } from 'react';

export default function BreakpointTester() {
  const [breakpoint, setBreakpoint] = useState<string>('unknown');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setDimensions({ width, height: window.innerHeight });
      
      if (width < 640) {
        setBreakpoint('sm (small phones)');
      } else if (width < 768) {
        setBreakpoint('md (tablets)');
      } else if (width < 1024) {
        setBreakpoint('lg (laptops)');
      } else if (width < 1280) {
        setBreakpoint('xl (desktops)');
      } else {
        setBreakpoint('2xl (large screens)');
      }
    };

    // Initial check
    updateBreakpoint();

    // Add event listener
    window.addEventListener('resize', updateBreakpoint);

    // Cleanup
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-lg shadow-lg z-50 text-sm font-mono">
      <div>Breakpoint: {breakpoint}</div>
      <div>Dimensions: {dimensions.width} × {dimensions.height}</div>
    </div>
  );
}