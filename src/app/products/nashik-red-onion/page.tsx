'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import AlertPopup from '@/components/AlertPopup/AlertPopup';
import { useAlert } from '@/hooks/useAlert';
import Image from 'next/image';

export default function NashikRedOnionPage() {
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
                    <span className="ml-2 text-green-700" aria-current="page">Nashik Red Onion</span>
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
                <div className="rounded-xl overflow-hidden w-full h-96 bg-gray-100">
                  <Image 
                    src="https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                    alt="Nashik Red Onion" 
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="rounded-lg overflow-hidden w-full h-24 bg-gray-100">
                    <Image 
                      src="https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                      alt="Nashik Red Onion 1" 
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden w-full h-24 bg-gray-100">
                    <Image 
                      src="https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                      alt="Nashik Red Onion 2" 
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden w-full h-24 bg-gray-100">
                    <Image 
                      src="https://images.unsplash.com/photo-1593587157138-68b77949b3a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                      alt="Nashik Red Onion 3" 
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-10 lg:mt-0">
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Nashik Red Onion</h1>
                <p className="mt-4 text-lg text-gray-600">
                  Premium quality red onions sourced directly from the fertile farms of Nashik, known as the &quot;Onion Capital of India&quot;. Our onions are carefully selected for their optimal size, color, and pungency.
                </p>

                {/* Specifications */}
                <div className="mt-8 border-t border-b border-gray-200 py-8">
                  <h2 className="text-xl font-bold text-gray-900">Product Specifications</h2>
                  <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="border-b border-gray-100 pb-4">
                      <dt className="text-sm font-medium text-gray-500">HS Code</dt>
                      <dd className="mt-1 text-sm text-gray-900">07030010</dd>
                    </div>
                    <div className="border-b border-gray-100 pb-4">
                      <dt className="text-sm font-medium text-gray-500">Color</dt>
                      <dd className="mt-1 text-sm text-gray-900">Deep Red</dd>
                    </div>
                    <div className="border-b border-gray-100 pb-4">
                      <dt className="text-sm font-medium text-gray-500">Size</dt>
                      <dd className="mt-1 text-sm text-gray-900">45mm+, 55mm+, 65mm+</dd>
                    </div>
                    <div className="border-b border-gray-100 pb-4">
                      <dt className="text-sm font-medium text-gray-500">Moisture Content</dt>
                      <dd className="mt-1 text-sm text-gray-900">85-90%</dd>
                    </div>
                    <div className="border-b border-gray-100 pb-4">
                      <dt className="text-sm font-medium text-gray-500">Pungency</dt>
                      <dd className="mt-1 text-sm text-gray-900">Medium to High</dd>
                    </div>
                    <div className="border-b border-gray-100 pb-4">
                      <dt className="text-sm font-medium text-gray-500">Shelf Life</dt>
                      <dd className="mt-1 text-sm text-gray-900">2-3 months when stored properly</dd>
                    </div>
                  </dl>
                </div>

                {/* Packaging Options */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900">Packaging Options</h2>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">10kg PP woven bags with polythene lining</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">20kg PP woven bags with polythene lining</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-600">25kg PP woven bags with polythene lining</span>
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
                      <span className="ml-2 text-gray-600">Minimum Order Quantity: 10 Metric Tons</span>
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
                    Send Inquiry for This Product
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
                Why Choose Our Nashik Red Onions?
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
                  Sourced from the best farms in Nashik with strict quality control at every stage.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">On-Time Delivery</h3>
                <p className="mt-2 text-gray-600">
                  Efficient logistics and packaging ensure your shipment arrives fresh and on schedule.
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
                  Direct sourcing from farmers ensures the best prices without compromising on quality.
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
                  Inquire About Nashik Red Onions
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