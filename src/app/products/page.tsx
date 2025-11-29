'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import AlertPopup from '@/components/AlertPopup/AlertPopup';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/Responsive';

// Define the product type for our data
interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  status: string;
  imageUrl: string;
  description: string;
  specifications: string;
  packaging: string;
  minOrder: string;
  delivery: string;
}

// Skeleton component for loading state
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="rounded-t-xl w-full aspect-video bg-gray-300"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
      <div className="h-10 bg-gray-300 rounded w-1/3"></div>
    </div>
  </div>
);

// Products page component - displays all products grouped by category
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [alert, setAlert] = useState({ isOpen: false, message: '', type: 'info' });

  // Load products from localStorage or use default data
  useEffect(() => {
    try {
      const storedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
      
      // Simulate network delay for better UX
      setTimeout(() => {
        setProducts(storedProducts);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error loading products:', error);
      setTimeout(() => {
        setProducts([]); // Show no products if there's an error
        setLoading(false);
      }, 0);
    }
  }, []);

  const categories = ['All', ...new Set(products.map(product => product.category))];
  
  // Filter products by category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  //   setAlert({ isOpen: true, message, type });
  // };

  const closeAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  // Add enhanced JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Agricultural Products Catalog",
    "description": "Explore our premium agricultural products including onions, lemons, rice, lentils, and spices. Farm-fresh quality with international certifications and fast global delivery.",
    "url": "https://satyamexport.com/products",
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "Product",
      "position": index + 1,
      "name": product.name,
      "description": product.description,
      "category": product.category,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": product.price.replace(/[^\d.-]/g, ''),
        "availability": product.status === "In Stock" ? "InStock" : "OutOfStock"
      },
      "image": product.imageUrl,
      "brand": {
        "@type": "Brand",
        "name": "Satyam Import and Export"
      }
    })),
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
        "name": "Products",
        "item": "https://satyamexport.com/products"
      }]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <div className="flex-grow pt-16">
        <AlertPopup 
        message={alert.message} 
        type={alert.type as 'success' | 'error' | 'warning' | 'info'} 
        isOpen={alert.isOpen} 
        onClose={closeAlert}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white py-16 md:py-24">
        <ResponsiveContainer padding="lg">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight animate-fade-in-up">
              Our Premium Product Collection
            </h1>
            <p className="text-xl text-emerald-50 mb-8 animate-fade-in-up animation-delay-200">
              Discover high-quality agricultural products sourced directly from farms across India. Every product meets international standards and comes with quality certifications.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-in-up animation-delay-400">
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/30">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">100% Farm Fresh</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/30">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Quality Certified</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/30">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Fast Shipping</span>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </div>

      {/* Main Content */}
      <ResponsiveContainer className="py-12">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:shadow-xl touch-target-large"
                />

              </div>
            </div>
            
            {/* Category Filter */}
            <div className="w-full md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full py-4 px-3 border border-gray-300 rounded-xl bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:shadow-xl touch-target-large"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={filteredProducts.length === 1 ? "flex justify-center" : ""}>
            <div 
              className={`grid gap-8 justify-center ${
                filteredProducts.length === 1 
                  ? "max-w-2xl w-full grid-cols-1" 
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {filteredProducts.map((product) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${(product.id % 6) * 100}ms` }}>
                  <ProductCard 
                    name={product.name}
                    description={product.description}
                    image={product.imageUrl}
                    link={`/products/${product.id}`}
                    price={product.price}
                    status={product.status}
                    category={product.category}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="mx-auto h-24 w-24 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-2xl font-bold text-gray-900">No products found</h3>
            <p className="mt-2 text-gray-600">Try adjusting your search or filter criteria</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 touch-target-large"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </ResponsiveContainer>
    </div>
    <Footer />
  </div>
  );
}