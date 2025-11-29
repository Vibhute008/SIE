'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define types for our data
interface StatItem {
  name: string;
  value: number;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  product: string;
  country: string;
  date: string;
  status: string;
}

interface DashboardData {
  totalProducts: number;
  totalBlogs: number;
  totalInquiries: number;
  totalTestimonials: number;
  recentInquiries: Inquiry[];
  productStats: StatItem[];
  monthlyInquiries: StatItem[];
}

// Professional Pie Chart Component - Moved outside to prevent creating during render
const PieChart = ({ data }: { data: StatItem[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <div className="text-2xl font-bold text-slate-900">No Data</div>
          <div className="text-sm text-slate-500 mt-1">Add products to see chart</div>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <div className="text-2xl font-bold text-slate-900">0</div>
          <div className="text-sm text-slate-500 mt-1">Total Products</div>
        </div>
      </div>
    );
  }

  const colors = [
    { fill: '#10b981', light: '#d1fae5' }, // emerald
    { fill: '#3b82f6', light: '#dbeafe' }, // blue
    { fill: '#f59e0b', light: '#fef3c7' }, // amber
    { fill: '#ef4444', light: '#fee2e2' }, // red
    { fill: '#8b5cf6', light: '#ede9fe' }, // purple
    { fill: '#06b6d4', light: '#cffafe' }  // cyan
  ];

  let cumulativePercentage = 0;
  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startPercentage = cumulativePercentage;
    cumulativePercentage += percentage;
    return {
      percentage,
      startPercentage,
      name: item.name,
      value: item.value,
      color: colors[index % colors.length]
    };
  });

  return (
    <div className="w-full">
      <div className="relative w-64 h-64 mx-auto mb-8">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {slices.map((slice, index) => {
            const startAngle = (slice.startPercentage / 100) * 360 - 90;
            const endAngle = ((slice.startPercentage + slice.percentage) / 100) * 360 - 90;
            const isLarge = slice.percentage > 50 ? 1 : 0;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);

            const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${isLarge} 1 ${x2} ${y2} Z`;

            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={slice.color.fill}
                  stroke="white"
                  strokeWidth="2.5"
                  opacity="0.95"
                  className="transition-opacity hover:opacity-100 cursor-pointer"
                />
              </g>
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg border border-slate-100">
            <div className="text-3xl font-bold text-slate-900">{total}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Bar Chart Component - Also moved outside
const BarChart = ({ data }: { data: StatItem[] }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  
  return (
    <div className="flex items-end h-40 gap-2 mt-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="text-xs text-slate-600 mb-1 font-semibold">{item.value}</div>
          <div 
            className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500 hover:opacity-75"
            style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '4px' }}
          ></div>
          <div className="text-xs text-slate-600 mt-2 text-center font-medium">{item.name}</div>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // success, error, warning, info
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
    }
  }, [router]);

  // Load data for dashboard
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    totalBlogs: 0,
    totalInquiries: 0,
    totalTestimonials: 0,
    recentInquiries: [],
    productStats: [],
    monthlyInquiries: []
  });

  useEffect(() => {
    // Load data from localStorage
    const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const blogs = JSON.parse(localStorage.getItem('adminBlogs') || '[]');
    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    const testimonials = JSON.parse(localStorage.getItem('adminTestimonials') || '[]');
    
    // Product category stats
    const categoryCount: Record<string, number> = {};
    products.forEach((product: any) => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });
    
    const productStats: StatItem[] = Object.keys(categoryCount).map(category => ({
      name: category,
      value: categoryCount[category]
    }));
    
    // Monthly inquiries (last 6 months)
    const monthlyInquiries: StatItem[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
      
      const count = inquiries.filter((inquiry: any) => {
        const inquiryDate = new Date(inquiry.date);
        return `${inquiryDate.getFullYear()}-${inquiryDate.getMonth() + 1}` === monthKey;
      }).length;
      
      monthlyInquiries.push({
        name: month.toLocaleString('default', { month: 'short' }),
        value: count
      });
    }
    
    setTimeout(() => {
      setDashboardData({
        totalProducts: products.length,
        totalBlogs: blogs.length,
        totalInquiries: inquiries.length,
        totalTestimonials: testimonials.length,
        recentInquiries: inquiries.slice(0, 5),
        productStats,
        monthlyInquiries
      } as DashboardData);
    }, 0);
  }, []);

  const showAlertPopup = (message: string, type: string = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleResetAllData = () => {
    localStorage.setItem('adminProducts', '[]');
    localStorage.setItem('adminBlogs', '[]');
    localStorage.setItem('adminTestimonials', '[]');
    localStorage.setItem('adminCertifications', '[]');
    localStorage.setItem('adminGallery', '[]');
    localStorage.setItem('inquiries', '[]');
    setShowResetConfirm(false);
    showAlertPopup('All data has been cleared successfully!', 'success');
    // Reload page to update dashboard and website
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M6.228 6.228a9 9 0 1012.544 0M6.228 6.228L6 6m.228.228l12.544 12.544m0-12.544L18 6m-.228.228L5.456 18.772" />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-medium text-slate-900">Clear All Data?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              This will permanently delete all:
              <ul className="list-disc list-inside mt-2 ml-2">
                <li>Products</li>
                <li>Blog Posts</li>
                <li>Testimonials</li>
                <li>Certifications</li>
                <li>Gallery Images</li>
                <li>Inquiries</li>
              </ul>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetAllData}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Popup */}
      {showAlert && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          alertType === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
          alertType === 'error' ? 'bg-red-100 border border-red-400 text-red-700' :
          alertType === 'warning' ? 'bg-yellow-100 border border-yellow-400 text-yellow-700' :
          'bg-blue-100 border border-blue-400 text-blue-700'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {alertType === 'success' && (
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {alertType === 'error' && (
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {alertType === 'warning' && (
                <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {alertType === 'info' && (
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {alertMessage}
              </p>
            </div>
            <button 
              onClick={() => setShowAlert(false)}
              className="ml-auto -mx-1.5 -my-1.5 bg-transparent rounded-lg p-1.5 inline-flex h-8 w-8 items-center justify-center"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl flex items-center">
            <svg className="h-7 w-7 mr-3 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard Overview
          </h2>
          <p className="mt-2 text-base text-slate-600">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-emerald-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="flex items-baseline">
                    <div className="text-3xl font-bold text-gray-900">{dashboardData.totalProducts}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Blogs</dt>
                  <dd className="flex items-baseline">
                    <div className="text-3xl font-bold text-gray-900">{dashboardData.totalBlogs}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Inquiries</dt>
                  <dd className="flex items-baseline">
                    <div className="text-3xl font-bold text-gray-900">{dashboardData.totalInquiries}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-rose-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-rose-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Testimonials</dt>
                  <dd className="flex items-baseline">
                    <div className="text-3xl font-bold text-gray-900">{dashboardData.totalTestimonials}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Quick Review */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-md">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h3 className="text-xl font-semibold text-slate-900">Product Catalog Overview</h3>
          <p className="mt-1 text-sm text-slate-600">Comprehensive view of your product inventory and category distribution</p>
        </div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Categories Distribution */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-slate-800">Category Distribution</h4>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {dashboardData.productStats.length} categories
                </span>
              </div>
              <div className="flex items-center justify-center">
                <PieChart data={dashboardData.productStats} />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3">
                {dashboardData.productStats.length === 0 ? (
                  <div className="text-center text-slate-600 py-4">No products yet. Add products to see category distribution.</div>
                ) : (
                  dashboardData.productStats.map((stat, index) => {
                    const colorClasses = [
                      'bg-emerald-500',
                      'bg-blue-500',
                      'bg-amber-500',
                      'bg-rose-500',
                      'bg-indigo-500',
                      'bg-teal-500'
                    ];
                    const color = colorClasses[index % colorClasses.length];
                    
                    // Calculate percentage
                    const total = dashboardData.productStats.reduce((sum, item) => sum + item.value, 0);
                    const percentage = total > 0 ? Math.round((stat.value / total) * 100) : 0;
                    
                    return (
                      <div key={stat.name} className="flex items-center p-4 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors duration-200">
                        <div className={`w-3 h-3 rounded-full ${color}`}></div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-slate-700">{stat.name}</span>
                            <span className="text-sm font-bold text-slate-900">{stat.value}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full ${color}`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{percentage}% of total products</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            {/* Product Catalog Insights */}
            <div>
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Catalog Insights</h4>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-emerald-50 rounded-lg border border-emerald-100 transition-colors duration-200 hover:bg-emerald-100">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-emerald-900">Total Products</div>
                    <div className="text-3xl font-bold text-emerald-700">{dashboardData.totalProducts}</div>
                    <div className="text-xs text-emerald-600 mt-1">All products in your catalog</div>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100 transition-colors duration-200 hover:bg-blue-100">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-blue-900">Product Categories</div>
                    <div className="text-3xl font-bold text-blue-700">{dashboardData.productStats.length}</div>
                    <div className="text-xs text-blue-600 mt-1">Distinct product categories</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-base font-semibold text-slate-700">Top Performing Categories</h5>
                    <span className="text-xs font-medium text-slate-500">By product count</span>
                  </div>
                  <div className="space-y-3">
                    {dashboardData.productStats
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 3)
                      .map((stat, index) => {
                        const total = dashboardData.productStats.reduce((sum, item) => sum + item.value, 0);
                        const percentage = total > 0 ? Math.round((stat.value / total) * 100) : 0;
                        
                        return (
                          <div key={stat.name} className="p-4 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors duration-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <span className="text-xs font-bold text-slate-500 w-6">#{index + 1}</span>
                                <span className="text-base font-medium text-slate-700 ml-2">{stat.name}</span>
                              </div>
                              <span className="text-base font-bold text-slate-900">{stat.value}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-emerald-500" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{percentage}% of catalog</div>
                          </div>
                        );
                      })
                    }
                    {dashboardData.productStats.length === 0 && (
                      <div className="text-center text-slate-500 text-sm py-3">No categories available. Add products to see insights.</div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <Link 
                    href="/admin/products" 
                    className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
                  >
                    Manage Products
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Inquiries Chart */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-md">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h3 className="text-xl font-semibold text-slate-900">Monthly Inquiries</h3>
          <p className="mt-1 text-sm text-slate-600">Inquiries received over the last 6 months</p>
        </div>
        <div className="px-6 py-5">
          <BarChart data={dashboardData.monthlyInquiries} />
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white shadow rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-900">Recent Inquiries</h3>
          <p className="mt-1 text-sm text-gray-600">Latest customer inquiries</p>
        </div>
        <div className="px-6 py-5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentInquiries.length > 0 ? (
                  dashboardData.recentInquiries.map((inquiry: any) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inquiry.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inquiry.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inquiry.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          inquiry.status === 'New' 
                            ? 'bg-blue-100 text-blue-800' 
                            : inquiry.status === 'In Progress' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : inquiry.status === 'Resolved' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                          {inquiry.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No recent inquiries
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Link 
              href="/admin/inquiries" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              View all inquiries
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}