'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import AlertPopup from '@/components/AlertPopup/AlertPopup';
import { useAlert } from '@/hooks/useAlert';

interface CompanyInfo {
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
}

export default function ContactPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    address: 'Nirman Sankul Building, Tata Power Netaji Nagar, Kalyan East, Maharashtra 421306, India',
    email: 'info.satyamimportandexport@gmail.com',
    phone: '+91 9004633136',
    whatsapp: '+91 9004633136'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    productInterest: '',
    message: ''
  });

  useEffect(() => {
    // Load company info from localStorage
    const savedCompanyInfo = localStorage.getItem('companyInfo');
    if (savedCompanyInfo) {
      try {
        const parsedInfo = JSON.parse(savedCompanyInfo);
        // Wrap setState in setTimeout to avoid React warning
        setTimeout(() => {
          setCompanyInfo({
            address: parsedInfo.address || 'Nirman Sankul Building, Tata Power Netaji Nagar, Kalyan East, Maharashtra 421306, India',
            email: parsedInfo.email || 'info.satyamimportandexport@gmail.com',
            phone: parsedInfo.phone || '+91 9004633136',
            whatsapp: parsedInfo.whatsapp || '+91 9004633136'
          });
        }, 0);
      } catch (e) {
        console.error('Error parsing company info:', e);
      }
    }
    
    // Listen for changes to company info
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'companyInfo') {
        try {
          const parsedInfo = e.newValue ? JSON.parse(e.newValue) : null;
          // Wrap setState in setTimeout to avoid React warning
          setTimeout(() => {
            setCompanyInfo({
              address: parsedInfo?.address || 'Nirman Sankul Building, Tata Power Netaji Nagar, Kalyan East, Maharashtra 421306, India',
              email: parsedInfo?.email || 'info.satyamimportandexport@gmail.com',
              phone: parsedInfo?.phone || '+91 9004633136',
              whatsapp: parsedInfo?.whatsapp || '+91 9004633136'
            });
          }, 0);
        } catch (e) {
          console.error('Error parsing company info:', e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const { alert, showAlert, hideAlert } = useAlert();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.country || !formData.productInterest) {
      showAlert('Please fill in all required fields', 'warning');
      return;
    }
    
    try {
      // Save inquiry to localStorage so admin can view it
      const newInquiry = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        country: formData.country,
        product: formData.productInterest,
        quantity: '',
        message: formData.message,
        date: new Date().toISOString().split('T')[0],
        status: 'New'
      };
      
      // Get existing inquiries from localStorage
      const existingInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
      existingInquiries.push(newInquiry);
      localStorage.setItem('inquiries', JSON.stringify(existingInquiries));
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        country: '',
        productInterest: '',
        message: ''
      });
      
      showAlert('Thank you for your inquiry! We will contact you soon.', 'success');
    } catch (_error) {
      showAlert('Error submitting inquiry. Please try again.', 'error');
    }
  };

  const closeAlert = () => {
    hideAlert();
  };

  // Add enhanced JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Satyam Import and Export",
    "description": "Get in touch with Satyam Import and Export for inquiries about agricultural products, partnerships, and business opportunities.",
    "url": "https://satyamexport.com/contact",
    "telephone": "+91-9004633136",
    "email": "info.satyamimportandexport@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nirman Sankul Building, Tata Power Netaji Nagar",
      "addressLocality": "Kalyan East",
      "addressRegion": "Maharashtra",
      "postalCode": "421306",
      "addressCountry": "IN"
    },
    "contactPoint": [{
      "@type": "ContactPoint",
      "telephone": "+91-9004633136",
      "contactType": "sales",
      "availableLanguage": ["English"]
    }],
    "areaServed": {
      "@type": "Place",
      "name": "Global"
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
        "name": "Contact Us",
        "item": "https://satyamexport.com/contact"
      }]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AlertPopup 
        message={alert.message} 
        type={alert.type} 
        isOpen={alert.isOpen} 
        onClose={closeAlert}
      />
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Contact Us
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl">
                Reach out to our team for product inquiries, partnerships, or any questions
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16">
              {/* Contact Form */}
              <div>
                <div className="bg-white shadow-lg rounded-lg p-8">
                  <h2 className="text-3xl font-extrabold text-gray-900">Send us a message</h2>
                  <p className="mt-2 text-lg text-gray-600">
                    We&apos;ll get back to you within 24 hours
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="">Select your country</option>
                        <option value="India">India</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                        <option value="China">China</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="productInterest" className="block text-sm font-medium text-gray-700">
                        Product Interest
                      </label>
                      <select
                        id="productInterest"
                        name="productInterest"
                        value={formData.productInterest}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="">Select a product</option>
                        <option value="Vegetables">Fresh Vegetables</option>
                        <option value="Fruits">Fresh Fruits</option>
                        <option value="Grains">Grains & Cereals</option>
                        <option value="Pulses">Pulses & Legumes</option>
                        <option value="Spices">Spices & Herbs</option>
                        <option value="Other">Other Products</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-12 lg:mt-0">
                <div className="bg-white shadow-lg rounded-lg p-8">
                  <h2 className="text-3xl font-extrabold text-gray-900">Get in Touch</h2>
                  <p className="mt-2 text-lg text-gray-600">
                    We&apos;re here to help and answer any questions you might have
                  </p>

                  <div className="mt-8 space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                        <p className="mt-1 text-gray-600">
                          <a href={`tel:${companyInfo.phone.replace(/\s/g, '')}`} className="hover:text-green-600 transition-colors">
                            {companyInfo.phone}
                          </a>
                        </p>
                        <p className="mt-1 text-gray-600">
                          <a href={`https://wa.me/${companyInfo.whatsapp.replace(/[\s+-]/g, '')}`} className="hover:text-green-600 transition-colors">
                            WhatsApp: {companyInfo.whatsapp}
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Email</h3>
                        <p className="mt-1 text-gray-600">
                          <a href={`mailto:${companyInfo.email}`} className="hover:text-green-600 transition-colors">
                            {companyInfo.email}
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Office</h3>
                        <p className="mt-1 text-gray-600">
                          {companyInfo.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900">Our Location</h3>
                    <div className="mt-4 rounded-lg overflow-hidden shadow-md">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.645454507799!2d73.1250933148742!3d19.2544649870398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be796d0e0a0a0a1%3A0x1234567890abcdef!2sSatyam%20Import%20and%20Export!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}