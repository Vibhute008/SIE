'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ResponsiveImage } from '@/components/Responsive';

interface ProductCardProps {
  name: string;
  description: string;
  image: string;
  link?: string;
  price?: string;
  status?: string;
  category?: string;
}

export default function ProductCard({ name, description, image, link, price, status, category }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Map image identifiers to actual image URLs
  const getImageUrl = (imageId: string) => {
    const imageMap: Record<string, string> = {
      'onion-category': 'https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'lemon-category': 'https://images.unsplash.com/photo-1593587157138-68b77949b3a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'rice-category': 'https://images.unsplash.com/photo-1599306628147-4a2a8aa02bc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'lentils-category': 'https://images.unsplash.com/photo-1615484477773-40c6b7b5b78d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'spices-category': 'https://images.unsplash.com/photo-1596803244610-0359df7f8ec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'other-products': 'https://images.unsplash.com/photo-1602015222395-1f47d6e0c7fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'onion-featured': 'https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'lemon-featured': 'https://images.unsplash.com/photo-1593587157138-68b77949b3a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'rice-featured': 'https://images.unsplash.com/photo-1599306628147-4a2a8aa02bc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      'lentils-featured': 'https://images.unsplash.com/photo-1615484477773-40c6b7b5b78d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    };
    
    // Return the mapped image URL or a fallback image
    return imageMap[imageId] || 'https://images.unsplash.com/photo-1602015222395-1f47d6e0c7fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80';
  };

  // Get badge text based on status
  const getBadgeText = () => {
    if (status) {
      if (status.toLowerCase().includes('new')) return 'NEW';
      if (status.toLowerCase().includes('sale')) return 'SALE';
      if (status.toLowerCase().includes('best')) return 'BEST';
      return status;
    }
    return '';
  };

  // Get badge color based on status
  const getBadgeColor = () => {
    if (status) {
      if (status.toLowerCase().includes('new')) return 'bg-emerald-500';
      if (status.toLowerCase().includes('sale')) return 'bg-red-500';
      if (status.toLowerCase().includes('best')) return 'bg-amber-500';
      return 'bg-gray-500';
    }
    return 'bg-emerald-500';
  };

  // Shorten product name to 2-4 words
  const getShortName = () => {
    const words = name.split(' ');
    return words.length > 4 ? words.slice(0, 4).join(' ') : name;
  };

  return (
    // Card container with fixed width and height
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col w-[350px] h-[400px]">
      {/* Image Container with fixed height */}
      <div className="relative h-[240px] overflow-hidden bg-gray-100 rounded-t-xl">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        
        {/* Status Badge - Small and clean, positioned in top-left corner */}
       
        
        {/* Category Badge - Small and clean, positioned in top-right corner */}
        {category && (
          <div className={`absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm`}>
            {category}
          </div>
        )}
        
        <ResponsiveImage
          src={getImageUrl(image)}
          alt={name}
          aspectRatio="square"
          className={`w-full h-full object-cover transition-all duration-500 ${isLoading ? 'opacity-0' : 'opacity-100 hover:scale-105'}`}
          onLoadingComplete={() => setIsLoading(false)}
          priority={false}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300"></div>
      </div>
      
      {/* Content with clean spacing */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Product Title - Semi-bold, single line */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">{getShortName()}</h3>
        
        {/* Description - Hidden to maintain clean layout */}
        <div className="hidden">
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-grow">{description}</p>
        </div>
        
        {/* Price and Action - Clean layout with bold price */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            {price ? (
              <p className="text-xl font-bold text-emerald-600">{price}</p>
            ) : (
              <p className="text-xs text-gray-400">Price not available</p>
            )}
          </div>
          
          {link && link.length > 0 ? (
            <Link 
              href={link} 
              className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-1.5 px-3 rounded-lg transition-colors duration-200 flex items-center"
            >
              View
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}