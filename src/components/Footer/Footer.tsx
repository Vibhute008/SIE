'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Footer() {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Satyam Import & Export',
    address: 'Nirman Sankul Building, Tata Power Netaji Nagar, Kalyan East, Maharashtra 421306, India',
    email: 'info.satyamimportandexport&#64;gmail.com',
    phone: '+91 9004633136'
  });

  useEffect(() => {
    // Load company info from localStorage
    const savedCompanyInfo = localStorage.getItem('companyInfo');
    if (savedCompanyInfo) {
      try {
        const parsedInfo = JSON.parse(savedCompanyInfo);
        setTimeout(() => {
          setCompanyInfo({
            name: parsedInfo.name || 'Satyam Import & Export',
            address: parsedInfo.address || 'Nirman Sankul Building, Tata Power Netaji Nagar, Kalyan East, Maharashtra 421306, India',
            email: parsedInfo.email || 'info.satyamimportandexport&#64;gmail.com',
            phone: parsedInfo.phone || '+91 9004633136'
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
          setTimeout(() => {
            setCompanyInfo({
              name: parsedInfo?.name || 'Satyam Import & Export',
              address: parsedInfo?.address || 'Nirman Sankul Building, Tata Power Netaji Nagar, Kalyan East, Maharashtra 421306, India',
              email: parsedInfo?.email || 'info.satyamimportandexport&#64;gmail.com',
              phone: parsedInfo?.phone || '+91 9004633136'
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

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/logo.png"
                alt="Satyam Import & Export Logo"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <h3 className="text-xl font-bold">Satyam Import & Export</h3>
            </div>
            <p className="mt-4 text-gray-300 max-w-md">
              Delivering India&#39;s finest agricultural products worldwide. Committed to quality, reliability, and sustainable farming practices.
            </p>
            <div className="mt-4 flex space-x-6">
              <a href="https://www.instagram.com/satyamimportsandexport/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/shubham-raulo-367612368/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
            <div className="mt-4">
              <Link href="/admin" className="text-gray-300 hover:text-white transition-colors text-sm">
                Admin Panel
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/" className="text-base text-gray-300 hover:text-white">Home</Link></li>
              <li><Link href="/about" className="text-base text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link href="/products" className="text-base text-gray-300 hover:text-white">Products</Link></li>
              <li><Link href="/quality-certifications" className="text-base text-gray-300 hover:text-white">Quality</Link></li>
              <li><Link href="/contact" className="text-base text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Contact Info</h3>
            <ul className="mt-4 space-y-4 text-gray-300">
              <li className="flex items-start">
                <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="ml-3">{companyInfo.address}</span>
              </li>
              <li className="flex items-start">
                <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="ml-3">{companyInfo.email}</span>
              </li>
              <li className="flex items-start">
                <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="ml-3">{companyInfo.phone}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300">© 2025 {companyInfo.name}. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-300">Member of APEDA | FSSAI Registered</p>
          </div>
        </div>
      </div>
    </footer>
  );
}