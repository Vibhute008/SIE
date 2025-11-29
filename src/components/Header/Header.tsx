'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [companyName, setCompanyName] = useState('Satyam Import & Export');
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Handle scroll effect for header
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Load company info from localStorage
    const savedCompanyInfo = localStorage.getItem('companyInfo');
    if (savedCompanyInfo) {
      try {
        const companyInfo = JSON.parse(savedCompanyInfo);
        setTimeout(() => {
          setCompanyName(companyInfo.name || 'Satyam Import & Export');
        }, 0);
      } catch (e) {
        console.error('Error parsing company info:', e);
      }
    }
    
    // Listen for changes to company info
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'companyInfo') {
        try {
          const companyInfo = e.newValue ? JSON.parse(e.newValue) : null;
          setTimeout(() => {
            setCompanyName(companyInfo?.name || 'Satyam Import & Export');
          }, 0);
        } catch (e) {
          console.error('Error parsing company info:', e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to determine if a link is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white/90 backdrop-blur-sm py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3 min-w-0">
            <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <Image
                  src={logoError ? '/no_image.png' : '/logo.png'}
                  alt="Satyam Import & Export Logo"
                  width={48}
                  height={48}
                  className="rounded-full object-cover transition-all duration-300 hover:rotate-6"
                  priority
                  onError={() => setLogoError(true)}
                />
                <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            </Link>
          </div>
          
          {/* Navigation - Responsive design */}
          <nav className="flex space-x-1 md:space-x-2 lg:space-x-3" role="navigation" aria-label="Main navigation">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/products', label: 'Products' },
              { href: '/quality-certifications', label: 'Quality' },
              { href: '/gallery', label: 'Gallery' },
              { href: '/blog', label: 'Blog' },
              { href: '/contact', label: 'Contact' }
            ].map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg font-medium transition-all duration-300 relative group whitespace-nowrap ${
                  isActive(item.href) 
                    ? 'text-green-700 bg-emerald-50' 
                    : 'text-gray-700 hover:text-green-700 hover:bg-emerald-50'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-emerald-600 transition-all duration-300 ${
                  isActive(item.href) ? 'w-4/5' : 'w-0 group-hover:w-3/5'
                }`}></span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}