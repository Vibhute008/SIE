'use client';

import { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function ResponsiveContainer({ 
  children, 
  className = '', 
  maxWidth = 'xl',
  padding = 'md'
}: ResponsiveContainerProps) {
  // Max width classes
  const maxWidthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-[90rem]',
    full: 'max-w-full'
  };

  // Padding classes
  const paddingClasses = {
    none: 'px-0',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
    xl: 'px-8 sm:px-10 lg:px-16'
  };

  return (
    <div className={`
      w-full 
      mx-auto 
      ${maxWidthClasses[maxWidth]} 
      ${paddingClasses[padding]} 
      ${className}
    `.trim()}>
      {children}
    </div>
  );
}