'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ResponsiveImage } from '@/components/Responsive';

interface ProductCardProps {
  name: string;
  description: string;
  image: string;
  link?: string;
}

export default function ProductCard({ name, description, image, link }: ProductCardProps) {
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
    
    return imageMap[imageId] || 'https://images.unsplash.com/photo-1599306628147-4a2a8aa02bc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-100 product-card transition-all duration-500 transform hover:-translate-y-2 group h-full flex flex-col">
      <div className="rounded-t-2xl w-full overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-2xl"></div>
        )}
        <ResponsiveImage
          src={getImageUrl(image)}
          alt={name}
          aspectRatio="video"
          className={`transition-all duration-500 ${isLoading ? 'opacity-0' : 'opacity-100 group-hover:scale-110'}`}
          onLoadingComplete={() => setIsLoading(false)}
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300 mb-2">{name}</h3>
        <p className="text-gray-600 line-clamp-2 flex-grow mb-4">{description}</p>
        <div className="mt-auto">
          {link && link.length > 0 ? (
            <Link 
              href={link} 
              className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-800 transition-all duration-300 group touch-target-large focus-visible-ring px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100"
            >
              View Details
              <svg className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          ) : (
            <span className="text-gray-500">Details not available</span>
          )}
        </div>
      </div>
    </div>
  );
}