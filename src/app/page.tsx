'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import AlertPopup from '@/components/AlertPopup/AlertPopup';
import { ResponsiveContainer } from '@/components/Responsive';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: ''
  });
  
  const [alert, setAlert] = useState({ isOpen: false, message: '', type: 'info' });

  // Fetch products from localStorage or API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First try to get products from localStorage
        const storedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        
        if (storedProducts.length > 0) {
          // Sort by ID in descending order to get newest first, then take first 3
          const latestProducts = storedProducts
            .sort((a: any, b: any) => b.id - a.id)
            .slice(0, 3);
          setProducts(latestProducts);
        } else {
          // If no products in localStorage, fetch from API
          const response = await fetch('/api/products');
          if (response.ok) {
            const apiProducts: any[] = await response.json();
            // Sort by ID in descending order to get newest first, then take first 3
            const latestProducts = apiProducts
              .sort((a, b) => b.id - a.id)
              .slice(0, 3);
            setProducts(latestProducts);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to default products
        setProducts([
          { id: 1, name: 'Premium Onions', category: 'Vegetables', price: '₹45/kg', status: 'NEW', imageUrl: 'onion-featured', description: 'Freshly harvested yellow onions, perfect for cooking and salads.' },
          { id: 2, name: 'Organic Lemons', category: 'Fruits', price: '₹80/kg', status: 'NEW', imageUrl: 'lemon-featured', description: 'Juicy organic lemons rich in vitamin C and antioxidants.' },
          { id: 3, name: 'Basmati Rice', category: 'Grains', price: '₹120/kg', status: 'NEW', imageUrl: 'rice-featured', description: 'Premium quality basmati rice with long grains and aromatic flavor.' }
        ]);

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setAlert({ isOpen: true, message: 'Thank you for your interest! We will contact you soon.', type: 'success' });
    setFormData({ name: '', email: '', country: '' });
  };

  const closeAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header />
      
      <AlertPopup 
        message={alert.message} 
        type={alert.type as 'success' | 'error' | 'warning' | 'info'} 
        isOpen={alert.isOpen} 
        onClose={closeAlert}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-700 to-green-900 text-white">
          <ResponsiveContainer padding="lg" className="py-16 md:py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="animate-fade-in-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight animate-fade-in-up text-heading-responsive">
                  Delivering India&#39;s Finest Agricultural Products Worldwide
                </h1>
                <p className="mt-4 md:mt-6 text-lg md:text-xl max-w-3xl animate-fade-in-up animation-delay-200 text-responsive">
                  Premium quality onions, lemons, rice, and other agri products exported globally with 100% farm freshness and on-time delivery.
                </p>
                <div className="mt-8 md:mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-400">
                  <Link 
                    href="/products" 
                    className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg transition duration-300 text-center transform hover:scale-105 hover:shadow-xl touch-target-large focus-visible-ring"
                  >
                    Explore Products
                  </Link>
                  <Link 
                    href="/contact" 
                    className="inline-block bg-transparent hover:bg-green-800 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg border-2 border-white transition duration-300 text-center transform hover:scale-105 hover:shadow-xl touch-target-large focus-visible-ring"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block animate-fade-in-right">
                <Image 
                  src="/hero.png" 
                  alt="Premium Agricultural Products" 
                  width={600} 
                  height={400} 
                  className="rounded-2xl w-full h-64 md:h-80 lg:h-96 object-cover shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to default image if loading fails
                    e.currentTarget.src = '/no_image.png';
                  }}
                />
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Highlights */}
        <section className="py-12 bg-white">
          <ResponsiveContainer>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { 
                  icon: (
                    <svg className="h-8 w-8 md:h-10 md:w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  ),
                  title: "100% Farm Fresh",
                  animation: "animate-fade-in-up"
                },
                { 
                  icon: (
                    <svg className="h-8 w-8 md:h-10 md:w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 104 0 2 2 0 012-2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Global Export Network",
                  animation: "animate-fade-in-up animation-delay-200"
                },
                { 
                  icon: (
                    <svg className="h-8 w-8 md:h-10 md:w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: "Quality Certified",
                  animation: "animate-fade-in-up animation-delay-400"
                },
                { 
                  icon: (
                    <svg className="h-8 w-8 md:h-10 md:w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "On-Time Delivery",
                  animation: "animate-fade-in-up animation-delay-600"
                }
              ].map((highlight, index) => (
                <div key={index} className={`text-center p-4 ${highlight.animation}`}>
                  <div className="flex justify-center transform transition-transform duration-300 hover:scale-110">
                    {highlight.icon}
                  </div>
                  <h3 className="mt-4 text-lg md:text-xl font-bold text-gray-900 transition-colors duration-300 hover:text-green-700">{highlight.title}</h3>
                </div>
              ))}
            </div>
          </ResponsiveContainer>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 md:py-16 bg-gray-50">
          <ResponsiveContainer>
            <div className="text-center animate-fade-in-up">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 sm:text-4xl text-heading-responsive">
                Why Choose Satyam Import Export?
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-700 text-responsive">
                Decades of experience in delivering premium agricultural products worldwide
              </p>
            </div>

            <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: "Farm Fresh Quality",
                  description: "Direct sourcing from Indian farms ensures the highest quality produce with optimal freshness and nutritional value.",
                  icon: (
                    <svg className="h-10 w-10 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )
                },
                {
                  title: "Global Distribution",
                  description: "Our extensive network delivers products to over 50 countries with reliable logistics and timely shipments.",
                  icon: (
                    <svg className="h-10 w-10 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Certified Standards",
                  description: "All our products meet international quality standards with certifications from recognized agricultural authorities.",
                  icon: (
                    <svg className="h-10 w-10 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 md:mt-12 text-center animate-fade-in-up animation-delay-400">
              <Link 
                href="/about"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 transition duration-300 transform hover:scale-105 touch-target-large focus-visible-ring"
              >
                Learn More About Us
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Contact CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-emerald-600 to-teal-700">
          <ResponsiveContainer>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              <div className="animate-fade-in-left">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white text-heading-responsive">
                  Have Questions About Our Products?
                </h2>
                <p className="mt-4 text-lg md:text-xl text-emerald-100 text-responsive">
                  Get in touch with our team for product inquiries, partnerships, or any questions
                </p>
              </div>
              <div className="mt-8 lg:mt-0 animate-fade-in-right">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="name" className="sr-only">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your Name"
                      className="block w-full px-4 py-3 md:px-5 md:py-4 text-base placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg text-gray-900 bg-white focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-700 touch-target-large"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Your Email"
                      className="block w-full px-4 py-3 md:px-5 md:py-4 text-base placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg text-gray-900 bg-white focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-700 touch-target-large"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="sr-only">Country</label>
                    <input
                      type="text"
                      name="country"
                      id="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      placeholder="Your Country"
                      className="block w-full px-4 py-3 md:px-5 md:py-4 text-base placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg text-gray-900 bg-white focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-700 touch-target-large"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 md:py-4 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-700 focus:ring-white transition duration-300 transform hover:scale-105 touch-target-large"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </ResponsiveContainer>
        </section>
      </main>

      <Footer />
    </div>
  );
}