'use client';

import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useState, useEffect } from 'react';
import AlertPopup from '@/components/AlertPopup/AlertPopup';
import Image from 'next/image';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  imageUrl: string;
  status?: string;
  content?: string; // Add content property
}

// Helper function to strip HTML tags and extract text content (SSR safe)
const extractTextFromHtml = (html: string): string => {
  if (!html) return '';
  // Simple regex to remove HTML tags
  return html.replace(/<[^>]*>/g, '').trim();
};

// Helper function to create excerpt from content (SSR safe)
const createExcerpt = (content: string, maxLength: number = 200): string => {
  if (!content) return '';
  const textContent = extractTextFromHtml(content);
  // Decode common HTML entities
  const decodedText = textContent
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  return decodedText.length > maxLength 
    ? decodedText.substring(0, maxLength) + '...' 
    : decodedText;
};

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [alert, setAlert] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({
    isOpen: false,
    message: '',
    type: 'success'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // 3x2 grid

  // Load blog posts from localStorage
  useEffect(() => {
    const storedBlogs = JSON.parse(localStorage.getItem('adminBlogs') || '[]');
    if (storedBlogs.length > 0) {
      const publishedPosts = storedBlogs.filter((post: BlogPost) => post.status === 'Published');
      // Add content preview if excerpt is not available
      const postsWithPreview = publishedPosts.map((post: BlogPost) => {
        if ((!post.excerpt || post.excerpt.length === 0) && post.content) {
          return {
            ...post,
            excerpt: createExcerpt(post.content)
          };
        }
        // If excerpt exists but is short, we can extend it slightly
        else if (post.excerpt && post.excerpt.length < 100 && post.content) {
          const contentPreview = createExcerpt(post.content, 250);
          return {
            ...post,
            excerpt: contentPreview
          };
        }
        return post;
      });
      setTimeout(() => {
        setBlogPosts(postsWithPreview);
        setFilteredPosts(postsWithPreview);
      }, 0);
    } else {
      // Show no blog posts if none exist in localStorage
      setTimeout(() => {
        setBlogPosts([]);
        setFilteredPosts([]);
      }, 0);
    }
  }, []);

  // Add JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Satyam Import and Export Blog",
    "description": "Expert advice, market trends, and industry insights for global agricultural trade.",
    "url": "https://satyamexport.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Satyam Import and Export",
      "logo": {
        "@type": "ImageObject",
        "url": "https://satyamexport.com/logo.png"
      }
    },
    "blogPost": blogPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "dateModified": post.date,
      "author": {
        "@type": "Organization",
        "name": "Satyam Import and Export"
      },
      "image": post.imageUrl,
      "keywords": post.category,
      "articleBody": post.content || post.excerpt
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
        "name": "Blog",
        "item": "https://satyamexport.com/blog"
      }]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AlertPopup 
        message={alert.message} 
        type={alert.type} 
        isOpen={alert.isOpen} 
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPgogIDxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIHRyYW5zZm9ybT0icm90YXRlKDEwKSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+CiAgPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgdHJhbnNmb3JtPSJyb3RhdGUoNTApIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 md:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-emerald-700/30 text-emerald-100 border border-emerald-600/50 backdrop-blur-sm mb-6">
                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Knowledge Hub
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                Agricultural Insights & <span className="text-amber-300">Trade Knowledge</span>
              </h1>
              <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto mb-8">
                Expert advice, market trends, and industry insights for global agricultural trade
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-10">
                <div className="flex items-center text-emerald-100">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Updated Daily</span>
                </div>
                <div className="flex items-center text-emerald-100">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <span>{blogPosts.length} Articles</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Introduction */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Latest Articles & Insights
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Discover expert knowledge on agricultural exports, international trade, and market trends to help your business thrive globally
              </p>
            </div>

            {/* Blog Posts Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage).map((post) => (
                  <div key={post.id} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative group flex flex-col h-[400px] w-[350px] mx-auto">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full -translate-y-16 translate-x-16 opacity-5"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-400 rounded-full translate-y-12 -translate-x-12 opacity-5"></div>
                    
                    {/* Image Container - 60% of the card height */}
                    <div className="h-52 overflow-hidden relative">
                      <Image 
                        src={post.imageUrl || `https://images.unsplash.com/photo-${post.id % 3 === 0 ? '1615484477773-40c6b7b5b78d' : post.id % 2 === 0 ? '1582515073490-39981397c445' : '1593587157138-68b77949b3a5'}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80`} 
                        alt={post.title} 
                        fill
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Content - 40% of the card height */}
                    <div className="p-6 relative z-10 flex-grow flex flex-col">
                      <div className="flex justify-between items-center mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed flex-grow">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto pt-3">
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {post.date}
                        </span>
                        <Link 
                          href={`/blog/${post.id}`} 
                          className="text-emerald-600 font-semibold hover:text-emerald-700 text-sm flex items-center group"
                        >
                          Read More
                          <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100">
                  <svg className="h-10 w-10 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-2xl font-medium text-gray-900">No blog posts found</h3>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">Check back later for new articles and insights.</p>
                <div className="mt-8">
                  <Link 
                    href="/" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Home
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredPosts.length > postsPerPage && (
              <div className="mt-16">
                <div className="text-center text-gray-600 mb-6 font-medium">
                  Page {currentPage} of {Math.ceil(filteredPosts.length / postsPerPage)} 
                  <span className="ml-2 text-gray-500">
                    (Showing {Math.min(postsPerPage, filteredPosts.length - (currentPage - 1) * postsPerPage)} of {filteredPosts.length} posts)
                  </span>
                </div>
                <nav className="flex items-center justify-center space-x-2">
                  {/* Previous button - only show if not on first page */}
                  {currentPage > 1 && (
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="px-5 py-3 rounded-xl bg-white text-gray-700 hover:bg-emerald-100 hover:text-emerald-800 border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Previous
                    </button>
                  )}
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, Math.ceil(filteredPosts.length / postsPerPage)) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-5 py-3 rounded-xl shadow-md transition-all duration-300 ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-emerald-100 hover:text-emerald-800 border border-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {/* Ellipsis and last page if needed */}
                  {Math.ceil(filteredPosts.length / postsPerPage) > 5 && (
                    <>
                      <span className="px-3 py-3 text-gray-500">...</span>
                      <button
                        onClick={() => setCurrentPage(Math.ceil(filteredPosts.length / postsPerPage))}
                        className="px-5 py-3 rounded-xl bg-white text-gray-700 hover:bg-emerald-100 hover:text-emerald-800 border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {Math.ceil(filteredPosts.length / postsPerPage)}
                      </button>
                    </>
                  )}
                  
                  {/* Next button - only show if not on last page */}
                  {currentPage < Math.ceil(filteredPosts.length / postsPerPage) && (
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredPosts.length / postsPerPage)))}
                      className="px-5 py-3 rounded-xl bg-white text-gray-700 hover:bg-emerald-100 hover:text-emerald-800 border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Next
                    </button>
                  )}
                </nav>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-800 to-teal-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                Ready to Start Trading?
              </h2>
              <p className="text-xl text-emerald-100 mb-10 max-w-3xl mx-auto">
                Contact us today to discuss your agricultural product requirements and explore our premium export services.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-10 rounded-xl transition duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Contact Us
                </Link>
                <Link 
                  href="/products" 
                  className="inline-flex items-center justify-center bg-transparent hover:bg-teal-800 text-white font-bold py-4 px-10 rounded-xl border-2 border-white transition duration-300 shadow-xl hover:shadow-2xl"
                >
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
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