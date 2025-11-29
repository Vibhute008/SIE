'use client';

import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  imageUrl?: string; // Added for compatibility
}

export default function GalleryPage() {
  // Gallery images data - load from localStorage
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  // Create a state object to track image errors for each gallery item
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const [selectedCategory, setSelectedCategory] = useState('All');

  // Load gallery images from localStorage
  useEffect(() => {
    const storedGallery = JSON.parse(localStorage.getItem('adminGallery') || '[]');
    // Map imageUrl to image for compatibility
    const mappedGallery = storedGallery.map((img: GalleryImage) => ({
      ...img,
      image: img.image || img.imageUrl || ''
    }));
    setTimeout(() => {
      setGalleryImages(mappedGallery);
    }, 0);
  }, []);

  // Get unique categories from gallery images
  const categories = ['All', ...new Set(galleryImages.map((img: GalleryImage) => img.category))];

  // Filter images based on selected category
  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter((img: GalleryImage) => img.category === selectedCategory);

  // Add enhanced JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MediaGallery",
    "name": "Satyam Import and Export Gallery",
    "description": "A visual journey through our agricultural export process",
    "url": "https://satyamexport.com/gallery",
    "image": galleryImages.map(img => ({
      "@type": "ImageObject",
      "name": img.title,
      "caption": img.description,
      "contentUrl": `https://satyamexport.com${img.image}`,
      "description": img.description,
      "representativeOfPage": false
    })),
    "creator": {
      "@type": "Organization",
      "name": "Satyam Import and Export"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://satyamexport.com/"
      },{
        "@type": "ListItem",
        "position": 2,
        "name": "Gallery",
        "item": "https://satyamexport.com/gallery"
      }]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Our Gallery
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl">
                A visual journey through our agricultural export process
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Content */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Behind the Scenes
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700">
                Explore our process from farm to international delivery
              </p>
            </div>

            {/* Category Filter */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    selectedCategory === category
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-green-100 hover:text-green-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredImages.map((item) => (
                <div key={item.id} className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src={imageErrors[item.id] ? '/no_image.png' : item.image} 
                      alt={item.title} 
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-6 text-white">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-700 rounded-full">
                          {item.category}
                        </span>
                        <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
                        <p className="mt-1 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Image Section - Replacing Video */}
        <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Commitment to Excellence
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700">
                Quality assurance at every step of our process
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Quality Assurance Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <svg className="h-16 w-16 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="text-2xl font-bold">Quality Assurance</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">
                    Rigorous testing and inspection protocols ensure only the highest quality products reach our clients.
                  </p>
                </div>
              </div>

              {/* Global Reach Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <svg className="h-16 w-16 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 104 0 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-2xl font-bold">Global Reach</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">
                    Connecting farmers and exporters worldwide with reliable shipping and logistics solutions.
                  </p>
                </div>
              </div>

              {/* Sustainable Practices Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <svg className="h-16 w-16 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h3 className="text-2xl font-bold">Sustainable Practices</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">
                    Promoting eco-friendly farming methods and responsible sourcing for a better tomorrow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-700 to-green-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Experience Our Quality
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-green-100">
                Partner with us for premium agricultural products
              </p>
              <div className="mt-8">
                <Link 
                  href="/contact" 
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 mr-4"
                >
                  Contact Us
                </Link>
                <Link 
                  href="/products" 
                  className="inline-block bg-transparent hover:bg-green-800 text-white font-bold py-3 px-8 rounded-lg border-2 border-white transition duration-300"
                >
                  View Our Products
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}