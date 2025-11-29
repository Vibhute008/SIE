'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';

interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  status: string;
  content: string;
  imageUrl: string;
  excerpt: string;
  readTime: string;
  tags: string[];
  views?: number;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const router = useRouter();

  // Load blog posts from localStorage
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
      return;
    }
    
    const storedBlogs = JSON.parse(localStorage.getItem('adminBlogs') || '[]');
    setPosts(storedBlogs);
  }, [router]);

  const showAlertPopup = (message: string, type: string = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const updatedPosts = posts.filter(post => post.id !== deleteId);
      setPosts(updatedPosts);
      localStorage.setItem('adminBlogs', JSON.stringify(updatedPosts));
      showAlertPopup('Blog post deleted successfully!', 'success');
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingPost(null);
    setShowModal(true);
  };

  const handleSave = (postData: any) => {
    // Validate that an image is provided
    if (!postData.imageUrl) {
      showAlertPopup('A featured image is required!', 'error');
      return;
    }
    
    // Process tags from comma-separated string to array
    const tagsArray = postData.tags 
      ? postData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
      : [];
    
    // Add processed tags to the post data
    const postDataWithTags = {
      ...postData,
      tags: tagsArray
    };
    
    let updatedPosts;
    let isNewPost = false;
    let newPostData: BlogPost | null = null;
    
    if (editingPost) {
      // Update existing post
      updatedPosts = posts.map(p => p.id === editingPost.id ? {...postDataWithTags, id: editingPost.id} : p);
      showAlertPopup('Blog post updated successfully!', 'success');
    } else {
      // Add new post
      isNewPost = true;
      newPostData = {...postDataWithTags, id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1, views: 0};
      updatedPosts = [...posts, newPostData];
      showAlertPopup('Blog post created successfully!', 'success');
    }
    
    setPosts(updatedPosts);
    // Save to localStorage
    localStorage.setItem('adminBlogs', JSON.stringify(updatedPosts));
    
    setShowModal(false);
    setEditingPost(null);
  };

  // Blog Post Modal Component
  function BlogPostModal({ post, onClose, onSave }: { post: BlogPost | null, onClose: () => void, onSave: (data: any) => void }) {
    const [formData, setFormData] = useState({
      title: post?.title || '',
      author: post?.author || 'Shubham Raulo',
      date: post?.date || new Date().toISOString().split('T')[0],
      status: post?.status || 'Draft',
      content: post?.content || '',
      imageUrl: post?.imageUrl || '',
      excerpt: post?.excerpt || '',
      readTime: post?.readTime || '5 min read',
      tags: post?.tags ? post.tags.join(', ') : '' // Add tags field
    });

    // Ref for the textarea
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Format text functions
    const formatText = (command: string, value: string = '') => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        document.execCommand(command, false, value);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-gradient-to-b from-black/30 to-black/50 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="relative mx-auto p-8 w-full max-w-2xl shadow-2xl rounded-2xl bg-white border border-black max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
          <div className="mt-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl leading-6 font-bold text-black flex items-center">
                <svg className="h-6 w-6 mr-2 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                {post ? 'Edit Blog Post' : 'Add New Blog Post'}
              </h3>
              <button
                onClick={onClose}
                className="text-black hover:text-black bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200 hover:scale-110"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-black">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-black rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-black">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    id="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-black rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-black">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-black rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-black">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white border border-black rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                    required
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-black">
                    Excerpt
                  </label>
                  <input
                    type="text"
                    name="excerpt"
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-black rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                    placeholder="Brief summary of the blog post (will be shown on blog listing)"
                  />
                  <p className="mt-2 text-sm text-black">This will be displayed on the blog listing page. If left empty, an excerpt will be automatically generated from the content.</p>
                </div>
                
                <div>
                  <label htmlFor="readTime" className="block text-sm font-medium text-black">
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    id="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-black rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                    placeholder="e.g., 5 min read"
                  />
                </div>

                {/* Add Tags Field */}
                <div className="sm:col-span-2">
                  <label htmlFor="tags" className="block text-sm font-medium text-black">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-black rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                    placeholder="Enter tags separated by commas (e.g., agriculture, export, trade)"
                  />
                  <p className="mt-2 text-sm text-black">Separate tags with commas</p>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-black">
                    Featured Image *
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <input
                      type="text"
                      name="imageUrl"
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="flex-1 border border-black rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                      placeholder="https://example.com/image.jpg (required)"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // For demo purposes, we'll show a placeholder
                          // In a real app, you would upload to a server and get a URL
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            if (result) {
                              setFormData(prev => ({ ...prev, imageUrl: result }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 transition-all duration-200"
                    />
                    <p className="mt-1 text-xs text-black">Image upload is required</p>
                  </div>
                  <p className="mt-2 text-sm text-black">Enter the URL of the featured image or upload from your device</p>
                  {formData.imageUrl && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-black mb-2">Preview:</p>
                      <Image 
                        src={formData.imageUrl} 
                        alt="Featured preview" 
                        width={128}
                        height={128}
                        className="w-32 h-32 object-cover rounded-lg border border-black"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-black">
                  Content
                </label>
                <div className="mt-1">
                  <RichTextEditor
                    content={formData.content}
                    onChange={(newContent) => 
                      setFormData(prev => ({ ...prev, content: newContent }))
                    }
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3 sticky bottom-0 bg-white pt-4 border-t border-black">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center py-2 px-4 border border-black rounded-lg shadow-sm text-sm font-bold text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
                >
                  Save Blog Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-in zoom-in-95">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-slate-900">Delete Blog Post?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
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
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl flex items-center">
            <svg className="h-7 w-7 mr-3 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Blog Management
          </h2>
          <p className="mt-2 text-base text-gray-600">Manage your blog content</p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={handleAddNew}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Post
          </button>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl leading-6 font-bold text-gray-900 flex items-center">
            <svg className="h-5 w-5 mr-2 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            All Blog Posts
          </h3>
          <p className="mt-1 text-sm text-gray-600">{posts.length} posts in your blog</p>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image className="h-10 w-10 rounded-md object-cover" src={post.imageUrl || 'https://images.unsplash.com/photo-1602015222395-1f47d6e0c7fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'} alt={post.title} width={40} height={40} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${post.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-emerald-600 hover:text-emerald-900 mr-3 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-rose-600 hover:text-rose-900 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {posts.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="mt-2 text-sm font-bold text-gray-900">No blog posts</h3>
              <p className="mt-1 text-sm text-gray-600">Get started by creating a new blog post.</p>
              <div className="mt-6">
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-md text-sm font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blog Post Modal */}
      {showModal && (
        <BlogPostModal 
          post={editingPost} 
          onClose={() => setShowModal(false)} 
          onSave={handleSave}
        />
      )}
    </div>
  );
}