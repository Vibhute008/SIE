'use client';

import { ReactNode } from 'react';

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export default function ResponsiveGrid({ 
  children, 
  className = '',
  gap = 'md',
  cols = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }
}: ResponsiveGridProps) {
  // Gap classes
  const gapClasses = {
    none: '',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  // Column classes
  const colClasses = [
    cols.xs ? `grid-cols-${cols.xs}` : 'grid-cols-1',
    `sm:grid-cols-${cols.sm || cols.xs || 1}`,
    `md:grid-cols-${cols.md || cols.sm || cols.xs || 1}`,
    `lg:grid-cols-${cols.lg || cols.md || cols.sm || cols.xs || 1}`,
    `xl:grid-cols-${cols.xl || cols.lg || cols.md || cols.sm || cols.xs || 1}`
  ].join(' ');

  return (
    <div className={`
      grid 
      ${colClasses}
      ${gapClasses[gap]}
      ${className}
    `.trim()}>
      {children}
    </div>
  );
}