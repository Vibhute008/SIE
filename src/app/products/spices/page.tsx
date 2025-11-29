'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import AlertPopup from '@/components/AlertPopup/AlertPopup';
import { useAlert } from '@/hooks/useAlert';

export default function SpicesPage() {
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    country: '',
    quantity: '',
    message: ''
  });
  const { alert, showAlert, hideAlert } = useAlert();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    showAlert('Thank you for your inquiry! We will contact you soon.', 'success');
    // Reset form
    setInquiryForm({
      name: '',
      email: '',
      country: '',
      quantity: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AlertPopup 
        message={alert.message}
        type={alert.type}
        isOpen={alert.isOpen}
        onClose={hideAlert}
      />

      <main>
        {/* Breadcrumb */}
        <div className="bg-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <div className="flex items-center">
                    <Link href="/" className="text-gray-500 hover:text-green-700">Home</Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link href="/products" className="ml-2 text-gray-500 hover:text-green-700">Products</Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2 text-green-700" aria-current="page">Spices</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16">
              {/* Product Images */}
              <div>
                <div className="bg-gray-200 border border-gray-300 rounded-xl w-full h-96" />
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-gray-200 border border-gray-300 rounded-lg w-full h-24" />
                  <div className="bg-gray-200 border border-gray-300 rounded-lg w-full h-24" />
                  <div className="bg-gray-200 border border-gray-300 rounded-lg w-full h-24" />
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-10 lg:mt-0">
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Premium Indian Spices</h1>
                <p className="mt-4 text-lg text-gray-600">
                  Authentic Indian spices sourced directly from premium farms across India. Our spices are carefully selected, processed, and packaged to maintain their aroma, flavor, and nutritional value.
                </p>

                {/* Specifications */}
                <div className="mt-8 border-t border-b border-gray-200 py-8">
                  <h2 className="text-xl font-bold text-gray-900">Popular Spice Varieties</h2>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">Turmeric Powder (Haldi)</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">Cumin Seeds (Jeera)</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">Coriander Seeds (Dhania)</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">Red Chilli Powder</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">Garam Masala</span>
                    </li>
                  </ul>
                </div>

                {/* Packaging Options */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900">Packaging Options</h2>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">1kg, 5kg, and 10kg Vacuum Sealed Bags</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">25kg and 50kg Jute Bags with Poly Liner</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">Custom packaging available upon request</span>
                    </li>
                  </ul>
                </div>

                {/* Order Terms */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900">Order Terms</h2>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">Minimum Order Quantity: 500kg</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">Delivery Terms: FOB Mumbai Port, CIF available</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">Payment Terms: T/T, L/C at sight</span>
                    </li>
                  </ul>
                </div>

                {/* Inquiry Button */}
                <div className="mt-10">
                  <button 
                    onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                  >
                    Send Inquiry for Spices
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Benefits */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Why Choose Our Spices?
              </h2>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="bg-white p-8 rounded-lg shadow">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Premium Quality</h3>
                <p className="mt-2 text-gray-600">
                  Sourced from the best spice-growing regions of India with strict quality control.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Fresh Aroma</h3>
                <p className="mt-2 text-gray-600">
                  Careful processing and packaging preserve the natural aroma and flavor of spices.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Competitive Pricing</h3>
                <p className="mt-2 text-gray-600">
                  Direct sourcing ensures the best prices without compromising on quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section id="inquiry-form" className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50 rounded-lg shadow-lg p-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Inquire About Our Spices
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                  Fill out the form below and our export specialists will contact you shortly
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={inquiryForm.name}
                      onChange={handleInputChange}
                      required 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={inquiryForm.email}
                      onChange={handleInputChange}
                      required 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                    <input 
                      type="text" 
                      id="country" 
                      name="country" 
                      value={inquiryForm.country}
                      onChange={handleInputChange}
                      required 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Estimated Quantity (Metric Tons)</label>
                    <input 
                      type="text" 
                      id="quantity" 
                      name="quantity" 
                      value={inquiryForm.quantity}
                      onChange={handleInputChange}
                      required 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    value={inquiryForm.message}
                    onChange={handleInputChange}
                    placeholder="Please specify which spices you're interested in and any specific requirements"
                    required 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                </div>
                
                <div>
                  <button 
                    type="submit" 
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}