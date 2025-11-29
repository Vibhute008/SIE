'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { verifyToken, getUserInfo } from '@/lib/auth';
import { getInitials, getColorFromName } from '@/utils/avatarGenerator';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      
      // If on login page and already authenticated, redirect to dashboard
      if (pathname === '/admin/login' && adminToken) {
        const userData = verifyToken(adminToken);
        if (userData) {
          router.push('/admin');
          return;
        }
      }
      
      // If no token, redirect to login (unless already on login page)
      if (!adminToken) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        } else {
          setLoading(false);
        }
        return;
      }
      
      // Verify token
      const userData = verifyToken(adminToken);
      if (!userData) {
        // Token invalid, redirect to login
        localStorage.removeItem('adminToken');
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        } else {
          setLoading(false);
        }
        return;
      }
      
      // Set user data and authentication status
      const userInfo = getUserInfo();
      if (userInfo) {
        setUser({
          email: userInfo.email,
          name: userInfo.name
        });
      }
      setIsAuthenticated(true);
      setLoading(false);
    };
    
    checkAuth();
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Products', href: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Blog', href: '/admin/blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { name: 'Testimonials', href: '/admin/testimonials', icon: 'M7 8h10M7 12h10m7-11a9 9 0 11-18 0 9 9 0 0118 0zM9 9a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm3 3a3 3 0 01-6 0' },
    { name: 'Certifications', href: '/admin/certifications', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { name: 'Gallery', href: '/admin/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Inquiries', href: '/admin/inquiries', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  ];

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // If not authenticated and not on login page, don't render anything
  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  // If on login page, only render children (login form)
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Desktop sidebar - only visible when authenticated */}
      {isAuthenticated && (
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:z-30">
          <div className="flex flex-col flex-grow bg-emerald-800 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 py-6">
              <Link href="/admin" className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 text-white bg-emerald-600 rounded-lg shadow-sm">
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold text-white">Admin Panel</span>
              </Link>
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3.5 text-base font-medium rounded-lg transition-colors duration-200 ${
                      pathname === item.href
                        ? 'bg-emerald-900 text-white'
                        : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                    }`}
                  >
                    <svg className="w-6 h-6 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="truncate">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-emerald-700 p-4">
              <div className="flex-shrink-0 flex items-center">
                {user?.name ? (
                  <div 
                    className="rounded-xl w-10 h-10 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: getColorFromName(user.name), fontSize: '1.25rem' }}
                  >
                    {getInitials(user.name)}
                  </div>
                ) : (
                  <div className="bg-emerald-600 border-2 border-emerald-300 rounded-xl w-10 h-10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs font-medium text-emerald-200 truncate">{user?.email || 'admin@example.com'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto flex items-center text-emerald-100 hover:bg-emerald-700 hover:text-white p-2 rounded-lg transition-colors duration-200"
                title="Logout"
              >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile sidebar - only visible when authenticated */}
      {isAuthenticated && (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-emerald-800 transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center h-16 px-4 bg-emerald-900 sm:px-6">
              <Link href="/admin" className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 text-white bg-emerald-600 rounded-lg shadow-sm">
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold text-white">Admin Panel</span>
              </Link>
            </div>
            <div className="flex-1 h-0 overflow-y-auto">
              <nav className="px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3.5 text-base font-medium rounded-lg transition-colors duration-200 ${
                      pathname === item.href
                        ? 'bg-emerald-900 text-white'
                        : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <svg className="w-6 h-6 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="truncate">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-emerald-700">
              <div className="flex-shrink-0 flex items-center mb-4">
                {user?.name ? (
                  <div 
                    className="rounded-xl w-10 h-10 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: getColorFromName(user.name), fontSize: '1.25rem' }}
                  >
                    {getInitials(user.name)}
                  </div>
                ) : (
                  <div className="bg-emerald-600 border-2 border-emerald-300 rounded-xl w-10 h-10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs font-medium text-emerald-200 truncate">{user?.email || 'admin@example.com'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-base font-medium text-emerald-100 rounded-lg hover:bg-emerald-700 hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="truncate">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`flex flex-col flex-1 ${isAuthenticated ? 'md:pl-64' : ''}`}>
   

        {/* Top navigation for desktop - visible on tablet and larger screens */}
        {isAuthenticated && (
          <div className="hidden md:flex md:items-center md:justify-between md:px-8 md:h-16 md:border-b md:border-gray-200 md:bg-white md:shadow-sm">
            <div className="flex items-center">
              {/* Hamburger menu button - visible on tablet and larger screens */}
              <button
                type="button"
                className="mr-4 inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/admin" className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 text-white bg-emerald-600 rounded-lg shadow-sm">
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Admin Panel</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                {user?.name ? (
                  <div 
                    className="rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: getColorFromName(user.name) }}
                  >
                    {getInitials(user.name)}
                  </div>
                ) : (
                  <div className="bg-emerald-600 border-2 border-emerald-300 rounded-lg w-8 h-8 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200"
                title="Logout"
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}