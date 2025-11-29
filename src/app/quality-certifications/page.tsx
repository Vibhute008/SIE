'use client';

import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Certification {
  id: number;
  name: string;
  description: string;
  image: string;
  issuer?: string;
  year?: number;
  certificateUrl?: string;
}

export default function QualityCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  // Load certifications from localStorage
  useEffect(() => {
    const storedCertifications = JSON.parse(localStorage.getItem('adminCertifications') || '[]');
    if (storedCertifications.length > 0) {
      setTimeout(() => {
        setCertifications(storedCertifications);
      }, 0);
    } else {
      // Save default certifications to localStorage
      setTimeout(() => {
        localStorage.setItem('adminCertifications', JSON.stringify(certifications));
      }, 0);
    }
  }, [certifications]);

  // Add JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Quality Certifications",
    "description": "Our commitment to excellence and adherence to international standards",
    "url": "https://satyamexport.com/quality-certifications",
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
        "name": "Quality Certifications",
        "item": "https://satyamexport.com/quality-certifications"
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
                Quality & Certifications
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl">
                Our commitment to excellence and adherence to international standards
              </p>
            </div>
          </div>
        </section>

        {/* Quality Commitment */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Commitment to Quality
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700">
                We maintain the highest standards throughout our supply chain
              </p>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                <div className="bg-gray-50 p-8 rounded-lg">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">Stringent Testing</h3>
                  <p className="mt-4 text-gray-700">
                    Every batch of our products undergoes rigorous laboratory testing to ensure purity, quality, and safety standards are met before export.
                  </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">Traceability</h3>
                  <p className="mt-4 text-gray-700">
                    We maintain complete traceability from farm to container, ensuring transparency and accountability at every stage of the supply chain.
                  </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">Hygiene Standards</h3>
                  <p className="mt-4 text-gray-700">
                    Our facilities adhere to the highest hygiene standards with regular sanitization, pest control, and staff training programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Certifications
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700">
                Recognized standards that validate our commitment to quality
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 rounded-full -translate-y-12 translate-x-12 opacity-10"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-400 rounded-full translate-y-16 -translate-x-16 opacity-10"></div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex justify-center mb-6">
                      {cert.image ? (
                        <div className="bg-white rounded-full p-3 shadow-lg border-4 border-white">
                          <Image 
                            src={cert.image} 
                            alt={cert.name}
                            width={80}
                            height={80}
                            className="h-20 w-20 object-contain rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-full p-4 shadow-lg border-4 border-white">
                          <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900">{cert.name}</h3>
                      {cert.issuer && (
                        <p className="mt-2 text-emerald-600 font-semibold">{cert.issuer}</p>
                      )}
                      {cert.year && cert.year > 0 && (
                        <p className="mt-1 text-sm text-gray-500">Issued: {cert.year}</p>
                      )}
                      <p className="mt-4 text-gray-700 text-sm">{cert.description}</p>
                      
                      {cert.certificateUrl && (
                        <div className="mt-6">
                          <a 
                            href={cert.certificateUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                          >
                            <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            View Certificate
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-700 to-green-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Committed to Excellence
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-green-100">
                Partner with us for premium quality agricultural products
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