'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface ResponsiveImageProps extends Omit<ImageProps, 'width' | 'height'> {
  aspectRatio?: 'square' | 'video' | 'auto' | `${number}/${number}`;
  className?: string;
  priority?: boolean;
}

export default function ResponsiveImage({ 
  src, 
  alt, 
  aspectRatio = 'auto',
  className = '',
  priority = false,
  ...props
}: ResponsiveImageProps) {
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get aspect ratio values
  const getAspectRatio = () => {
    switch (aspectRatio) {
      case 'square': return '1/1';
      case 'video': return '16/9';
      case 'auto': return 'auto';
      default: return aspectRatio;
    }
  };

  // Set up resize observer for container width
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate dimensions based on aspect ratio
  const calculateDimensions = () => {
    if (!containerWidth) return { width: 600, height: 400 };
    
    const ratio = getAspectRatio();
    if (ratio === 'auto') return { width: containerWidth, height: containerWidth * 0.75 };
    
    const [widthRatio, heightRatio] = ratio.split('/').map(Number);
    const height = (containerWidth * heightRatio) / widthRatio;
    
    return { width: containerWidth, height };
  };

  const { width, height } = calculateDimensions();

  // Build class name without dynamic aspect ratio to avoid potential issues
  const containerClasses = `relative w-full ${className}`;
  const imageClasses = `${aspectRatio !== 'auto' ? 'object-cover' : ''}`;
  
  return (
    <div 
      ref={(el) => { if (el) containerRef.current = el; }}
      className={containerClasses}
      style={aspectRatio !== 'auto' ? { aspectRatio: getAspectRatio() } : {}}
    >
      <Image
        src={src}
        alt={alt}
        fill={aspectRatio !== 'auto'}
        width={aspectRatio === 'auto' ? width : undefined}
        height={aspectRatio === 'auto' ? height : undefined}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={imageClasses}
        priority={priority}
        quality={80}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        {...props}
      />
    </div>
  );
}