'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useState, useEffect, useRef } from 'react';
import { getInitials, getColorFromName } from '@/utils/avatarGenerator';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  content: string;
  image?: string;
  role?: string;
  company?: string;
  rating?: number;
}

export default function AboutPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load testimonials from localStorage
  useEffect(() => {
    const storedTestimonials = JSON.parse(localStorage.getItem('adminTestimonials') || '[]');
    if (storedTestimonials.length > 0) {
      setTimeout(() => {
        setTestimonials(storedTestimonials);
      }, 0);
    } else {
      // Save default testimonials to localStorage
      localStorage.setItem('adminTestimonials', JSON.stringify(testimonials));
    }
  }, []);

  // Setup infinite scrolling
  useEffect(() => {
    if (!containerRef.current || !contentRef.current || testimonials.length === 0) return;

    const container = containerRef.current;
    const content = contentRef.current;
    
    // Duplicate content for seamless looping
    const clone = content.cloneNode(true) as HTMLDivElement;
    container.appendChild(clone);

    let animationFrameId: number;
    let position = 0;
    const speed = 0.5; // Slower speed for better visibility

    const animate = () => {
      position -= speed;
      
      // Reset position when we've moved one full set
      if (Math.abs(position) >= content.offsetWidth) {
        position = 0;
      }
      
      container.style.transform = `translateX(${position}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [testimonials]);

  // Duplicate testimonials for infinite scroll effect
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Add JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Satyam Import and Export",
    "description": "Learn about Satyam Import and Export, India's premier agricultural product exporter. Discover our story, mission, values, and commitment to quality in global trade.",
    "url": "https://satyamexport.com/about",
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
        "name": "About Us",
        "item": "https://satyamexport.com/about"
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
                About Satyam Import and Export
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl">
                Delivering India's finest agricultural products to markets worldwide
              </p>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
                  Our Story
                </h2>
                <p className="mt-6 text-lg text-black">
                  Founded by Shubham Raulo, Satyam Import and Export began with a vision to bridge the gap between Indian farmers and international markets. We recognized the potential of India's agricultural sector and the need for reliable export partners who understand both the quality requirements of international buyers and the capabilities of Indian producers.
                </p>
                <p className="mt-4 text-lg text-black">
                  Today, we export premium agricultural products to over 25 countries, maintaining the highest standards of quality and customer service. Our success is built on direct relationships with farmers, state-of-the-art processing facilities, and a deep understanding of international trade regulations.
                </p>
                <div className="mt-8">
                  <Link 
                    href="/contact" 
                    className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="mt-10 lg:mt-0">
                <Image 
                  src="/about.png" 
                  alt="About Satyam Import and Export" 
                  width={600} 
                  height={400} 
                  className="rounded-xl w-full h-96 object-cover shadow-lg"
                  onError={(e) => {
                    // Fallback to default image if loading fails
                    e.currentTarget.src = '/no_image.png';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission and Values */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
                Our Mission & Values
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-black">
                Principles that guide our operations and relationships
              </p>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                <div className="bg-white p-8 rounded-lg shadow">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-black">Quality</h3>
                  <p className="mt-4 text-black">
                    We never compromise on quality. Every product undergoes rigorous testing and inspection to meet international standards.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-black">Transparency</h3>
                  <p className="mt-4 text-black">
                    We maintain complete transparency in our operations, from sourcing to delivery, building trust with our partners.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-black">Commitment</h3>
                  <p className="mt-4 text-black">
                    We are committed to building long-term relationships with our customers and suppliers based on mutual growth and success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
                What Our Customers Say
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-black">
                Trusted by importers across the globe
              </p>
            </div>

            <div className="mt-12">
              {/* Infinite Scrolling Testimonials */}
              <div className="relative overflow-hidden">
                <div 
                  ref={containerRef}
                  className="flex space-x-8 py-4"
                  style={{ width: 'max-content' }}
                >
                  <div ref={contentRef} className="flex space-x-8">
                    {duplicatedTestimonials.map((testimonial, index) => (
                      <div 
                        key={`${testimonial.id}-${index}`} 
                        className="flex-shrink-0 w-80 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 p-8 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-16 translate-x-16 opacity-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400 rounded-full translate-y-12 -translate-x-12 opacity-10"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              {testimonial.image ? (
                                <Image 
                                  src={testimonial.image} 
                                  alt={testimonial.name} 
                                  width={64}
                                  height={64}
                                  className="rounded-full object-cover border-4 border-white shadow-lg"
                                />
                              ) : (
                                <div 
                                  className="rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl"
                                  style={{ backgroundColor: getColorFromName(testimonial.name) }}
                                >
                                  {getInitials(testimonial.name)}
                                </div>
                              )}
                            </div>
                            <div className="ml-6 flex-1">
                              <h4 className="text-xl font-bold text-gray-900">{testimonial.name}</h4>
                              {(testimonial.role || testimonial.company) && (
                                <p className="text-emerald-600 font-semibold mt-1">
                                  {testimonial.role}{testimonial.role && testimonial.company ? ', ' : ''}{testimonial.company}
                                </p>
                              )}
                              {testimonial.location && !testimonial.company && (
                                <p className="text-gray-600 mt-1">{testimonial.location}</p>
                              )}
                              {testimonial.rating && (
                                <div className="flex mt-3 space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <svg 
                                      key={i} 
                                      className={`h-6 w-6 ${i < (testimonial.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      viewBox="0 0 24 24" 
                                      fill="currentColor"
                                    >
                                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <div className="flex items-center">
                              <svg className="h-6 w-6 text-emerald-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                              </svg>
                              <p className="text-gray-700 italic ml-3 line-clamp-3">&quot;{testimonial.content}&quot;</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                Ready to Partner With Us?
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-green-100">
                Contact us today to discuss your agricultural product requirements
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