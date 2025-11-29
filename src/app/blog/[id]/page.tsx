'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { use } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import AlertPopup from '@/components/AlertPopup';

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise
  const unwrappedParams = use(params);
  const [post, setPost] = useState<any>(null);
  const [alert, setAlert] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({
    isOpen: false,
    message: '',
    type: 'success'
  });
  
  useEffect(() => {
    // Define interface for blog post
    interface BlogPost {
      id: number;
      title: string;
      author: string;
      date: string;
      category: string;
      content: string;
      imageUrl: string;
      excerpt: string;
      readTime: string;
      tags: string[];
      status: string;
    }
    
    // Load blog posts from localStorage
    const storedBlogs: BlogPost[] = JSON.parse(localStorage.getItem('adminBlogs') || '[]');
    const postId = parseInt(unwrappedParams.id);
    const foundPost = storedBlogs.find((p: BlogPost) => p.id === postId);
    setTimeout(() => {
      setPost(foundPost);
    }, 0);
  }, [unwrappedParams.id]);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center bg-white rounded-3xl shadow-2xl p-16 border border-gray-200/50 backdrop-blur-sm">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
                <svg className="h-12 w-12 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Blog Post Not Found</h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">The blog post you're looking for doesn't exist or may have been removed.</p>
              <div className="mt-8">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <svg className="h-6 w-6 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Function to download blog post as PDF
  const downloadAsPDF = () => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '', 'width=800,height=600');
      if (!printWindow) {
        setTimeout(() => {
          setAlert({
            isOpen: true,
            message: 'Unable to open print dialog. Please try again.',
            type: 'error'
          });
        }, 0);
        return;
      }
      
      // Write content to the print window
      printWindow.document.write('<html><head><title>' + post.title + '</title>');
      printWindow.document.write('<style>');
      printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
      printWindow.document.write('h1 { color: #059669; }');
      printWindow.document.write('p { line-height: 1.6; color: #333; }');
      printWindow.document.write('</style></head><body>');
      printWindow.document.write('<h1>' + post.title + '</h1>');
      printWindow.document.write('<p><strong>Date:</strong> ' + post.date + '</p>');
      printWindow.document.write('<p><strong>Category:</strong> ' + post.category + '</p>');
      printWindow.document.write('<hr>');
      printWindow.document.write(post.content);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      // Trigger print dialog
      printWindow.print();
      
      setTimeout(() => {
        setAlert({
          isOpen: true,
          message: 'Print dialog opened. You can save as PDF from the print menu.',
          type: 'info'
        });
      }, 0);
    } catch (error) {
      setTimeout(() => {
        setAlert({
          isOpen: true,
          message: 'Error preparing PDF download. Please try again.',
          type: 'error'
        });
      }, 0);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AlertPopup 
        message={alert.message} 
        type={alert.type} 
        isOpen={alert.isOpen} 
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
      <Header />
      
      <main>
        {/* Blog Post Header */}
        <section className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPgogIDxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIHRyYW5zZm9ybT0icm90YXRlKDEwKSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+CiAgPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgdHJhbnNmb3JtPSJyb3RhdGUoNTApIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
            <div className="flex items-center mb-8">
              <Link 
                href="/blog" 
                className="flex items-center text-emerald-100 hover:text-white transition-colors duration-300 group font-medium"
              >
                <svg className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Blog
              </Link>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-emerald-700/30 text-emerald-100 border border-emerald-600/50 backdrop-blur-sm mb-6">
                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                {post.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-emerald-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className="bg-emerald-600 rounded-full w-10 h-10 flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className="font-medium">{post.author || 'Satyam Import & Export Team'}</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>{post.readTime || '5 min read'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Image */}
        {post.imageUrl && (
          <section className="py-12 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50">
                <Image 
                  src={post.imageUrl} 
                  alt={post.title} 
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm italic">Featured image for &quot;{post.title}&quot;</p>
              </div>
            </div>
          </section>
        )}
        
        {/* Blog Post Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="prose prose-lg max-w-none">
              <div 
                className="blog-content prose prose-lg max-w-none text-black"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <style jsx>{`
                .blog-content {
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                  word-break: break-word;
                  hyphens: auto;
                }
                .blog-content h2 {
                  font-size: 2.25rem;
                  font-weight: 800;
                  margin-top: 3rem;
                  margin-bottom: 1.5rem;
                  color: #1e3a8a; /* Dark blue for better contrast */
                  position: relative;
                  padding-bottom: 0.75rem;
                }
                .blog-content h2:after {
                  content: '';
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  width: 60px;
                  height: 4px;
                  background: linear-gradient(to right, #10b981, #0d9488);
                  border-radius: 2px;
                }
                .blog-content h3 {
                  font-size: 1.75rem;
                  font-weight: 700;
                  margin-top: 2.5rem;
                  margin-bottom: 1.25rem;
                  color: #1e40af; /* Darker blue for headings */
                  position: relative;
                }
                .blog-content h3:before {
                  content: '▍';
                  color: #10b981;
                  margin-right: 0.5rem;
                }
                .blog-content p {
                  margin-bottom: 1.75rem;
                  line-height: 1.8;
                  color: #334155; /* Darker gray for better readability */
                  font-size: 1.125rem;
                }
                .blog-content ul, .blog-content ol {
                  margin-bottom: 1.75rem;
                  padding-left: 1.75rem;
                }
                .blog-content li {
                  margin-bottom: 0.75rem;
                  line-height: 1.8;
                  font-size: 1.125rem;
                  color: #334155; /* Darker gray for list items */
                }
                .blog-content ul li:before {
                  content: '•';
                  color: #10b981;
                  font-weight: bold;
                  display: inline-block;
                  width: 1em;
                  margin-left: -1em;
                }
                .blog-content a {
                  color: #0d9488;
                  text-decoration: none;
                  font-weight: 600;
                  border-bottom: 2px solid #10b981;
                  transition: all 0.3s ease;
                }
                .blog-content a:hover {
                  color: #047857;
                  border-bottom: 2px solid #047857;
                }
                .blog-content blockquote {
                  border-left: 4px solid #10b981;
                  padding: 1.5rem 2rem;
                  margin: 2rem 0;
                  color: #1e293b; /* Darker text for quotes */
                  font-style: italic;
                  background: linear-gradient(to right, #f0fdf4, #ecfdf5);
                  border-radius: 0 8px 8px 0;
                }
                .blog-content blockquote p {
                  margin-bottom: 0;
                  font-size: 1.25rem;
                }
                .blog-content img {
                  border-radius: 1rem;
                  margin: 2.5rem auto;
                  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                  max-width: 100%;
                  height: auto;
                  display: block;
                  transition: transform 0.3s ease;
                }
                .blog-content img:hover {
                  transform: translateY(-5px);
                }
                .blog-content code {
                  background-color: #f1f5f9;
                  padding: 0.25rem 0.5rem;
                  border-radius: 0.375rem;
                  font-family: monospace;
                  font-size: 0.875rem;
                  color: #1e3a8a;
                  overflow-wrap: break-word;
                }
                .blog-content pre {
                  background-color: #1e293b;
                  padding: 1.5rem;
                  border-radius: 0.75rem;
                  overflow-x: auto;
                  margin: 2rem 0;
                  color: #f8fafc;
                  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
                }
                .blog-content table {
                  width: 100%;
                  margin: 2rem 0;
                  border-collapse: collapse;
                  border-radius: 0.5rem;
                  overflow: hidden;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                  table-layout: fixed;
                }
                .blog-content th {
                  background-color: #10b981;
                  color: white;
                  text-align: left;
                  padding: 1rem;
                  font-weight: 600;
                }
                .blog-content td {
                  padding: 1rem;
                  border-bottom: 1px solid #e2e8f0;
                  color: #334155;
                  overflow-wrap: break-word;
                }
                .blog-content tr:nth-child(even) {
                  background-color: #f8fafc;
                }
                .blog-content tr:last-child td {
                  border-bottom: none;
                }
              `}</style>
            </article>
            
            {/* Tags */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200">
                  {post.category}
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  {post.readTime}
                </span>
                {/* Display actual tags if they exist */}
                {post.tags && Array.isArray(post.tags) && post.tags.map((tag: string, index: number) => (
                  <span key={index} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Author Box */}
            <div className="mt-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200/50 shadow-lg">
              <div className="flex flex-col md:flex-row items-start">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
                    <svg className="h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{post.author || 'Satyam Import & Export Team'}</h4>
                  <p className="mt-2 text-gray-600">
                    Expert in agricultural trade and international commerce. Sharing insights to help businesses thrive in global markets.
                  </p>
                  <div className="mt-4 flex space-x-4">
                    <a href="#" className="text-emerald-600 hover:text-emerald-700">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-emerald-600 hover:text-emerald-700">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="mt-16 flex flex-wrap gap-4">
              <button 
                onClick={downloadAsPDF}
                className="inline-flex items-center px-6 py-3 border border-emerald-600 text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download as PDF
              </button>
              <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 101.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                </svg>
                Share Article
              </button>
            </div>
            
            {/* Related Posts */}
            <div className="mt-20">
              <h3 className="text-3xl font-bold text-gray-900 mb-10 pb-2 border-b border-gray-200">Related Articles</h3>
              <div className="grid gap-8 md:grid-cols-3">
                {/* Load related posts from localStorage */}
                {(() => {
                  // Define interface for blog post
                  interface BlogPost {
                    id: number;
                    title: string;
                    author: string;
                    date: string;
                    category: string;
                    content: string;
                    imageUrl: string;
                    excerpt: string;
                    readTime: string;
                    tags: string[];
                    status: string;
                  }
                  
                  const storedBlogs: BlogPost[] = JSON.parse(localStorage.getItem('adminBlogs') || '[]');
                  const relatedPosts = storedBlogs
                    .filter((p: BlogPost) => p.id !== post.id && p.status === 'Published')
                    .slice(0, 3);
                  
                  return relatedPosts.length > 0 ? (
                    relatedPosts.map((relatedPost: BlogPost) => (
                      <div key={relatedPost.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-[400px]">
                        <div className="h-40 overflow-hidden">
                          <Image 
                            src={relatedPost.imageUrl || `https://images.unsplash.com/photo-${relatedPost.id % 3 === 0 ? '1615484477773-40c6b7b5b78d' : relatedPost.id % 2 === 0 ? '1582515073490-39981397c445' : '1593587157138-68b77949b3a5'}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80`} 
                            alt={relatedPost.title} 
                            fill
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                        </div>
                        <div className="p-5 flex-grow flex flex-col">
                          <div className="flex justify-between items-center mb-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800">
                              {relatedPost.category}
                            </span>
                            <span className="text-xs text-gray-500">{relatedPost.readTime}</span>
                          </div>
                          <h4 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{relatedPost.title}</h4>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">{relatedPost.excerpt}</p>
                          <Link 
                            href={`/blog/${relatedPost.id}`} 
                            className="text-emerald-600 font-medium hover:text-emerald-700 text-sm flex items-center group mt-auto"
                          >
                            Read More
                            <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12 bg-gray-50 rounded-2xl">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No related articles</h3>
                      <p className="mt-1 text-gray-500">Check back later for more content.</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}