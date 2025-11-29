'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import AlertPopup from '@/components/AlertPopup/AlertPopup';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'replied';
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: '', type: 'info' });

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = () => {
    try {
      const storedInquiries = localStorage.getItem('contactInquiries');
      if (storedInquiries) {
        const parsedInquiries: Inquiry[] = JSON.parse(storedInquiries);
        setInquiries(parsedInquiries);
      }
    } catch (error) {
      console.error('Error loading inquiries:', error);
      setAlert({ isOpen: true, message: 'Error loading inquiries', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleInquiryClick = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    // Mark as read when opening
    if (inquiry.status === 'unread') {
      updateInquiryStatus(inquiry.id, 'read');
    }
  };

  const updateInquiryStatus = (id: number, status: 'unread' | 'read' | 'replied') => {
    const updatedInquiries = inquiries.map(inquiry => 
      inquiry.id === id ? { ...inquiry, status } : inquiry
    );
    setInquiries(updatedInquiries);
    localStorage.setItem('contactInquiries', JSON.stringify(updatedInquiries));
  };

  const handleReply = () => {
    if (selectedInquiry) {
      updateInquiryStatus(selectedInquiry.id, 'replied');
      setReplyMessage('');
      setShowReplyModal(false);
      setSelectedInquiry(null);
      setAlert({ isOpen: true, message: 'Reply sent successfully!', type: 'success' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const closeAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <AlertPopup 
        message={alert.message} 
        type={alert.type as 'success' | 'error' | 'warning' | 'info'} 
        isOpen={alert.isOpen} 
        onClose={closeAlert}
      />

      <main className="flex-grow pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Inquiries</h1>
              <p className="mt-2 text-gray-600">Manage and respond to customer inquiries</p>
            </div>
            <Link 
              href="/admin" 
              className="mt-4 md:mt-0 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
            >
              Back to Dashboard
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No inquiries</h3>
              <p className="mt-1 text-gray-500">You don&apos;t have any customer inquiries yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Inquiries List */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Inquiries ({inquiries.length})</h2>
                  </div>
                  <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                    {inquiries.map((inquiry) => (
                      <div 
                        key={inquiry.id}
                        className={`border-b border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                          selectedInquiry?.id === inquiry.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleInquiryClick(inquiry)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 truncate">{inquiry.name}</h3>
                            <p className="text-xs text-gray-500 mt-1 truncate">{inquiry.subject}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-xs text-gray-500">{formatDate(inquiry.date)}</p>
                          {inquiry.status === 'unread' && (
                            <span className="inline-flex items-center justify-center h-2 w-2 rounded-full bg-red-500"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inquiry Details */}
              <div className="lg:col-span-2">
                {selectedInquiry ? (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{selectedInquiry.subject}</h2>
                          <div className="mt-2 flex items-center">
                            <span className="text-sm font-medium text-gray-900">{selectedInquiry.name}</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{selectedInquiry.email}</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{formatDate(selectedInquiry.date)}</span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedInquiry.status)}`}>
                          {selectedInquiry.status}
                        </span>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-900">Message</h3>
                        <div className="mt-2 bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                        </div>
                      </div>

                      <div className="mt-8 flex space-x-3">
                        <button
                          onClick={() => setShowReplyModal(true)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => setSelectedInquiry(null)}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center h-full flex items-center justify-center">
                    <div>
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">Select an inquiry</h3>
                      <p className="mt-1 text-gray-500">Choose an inquiry from the list to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Reply Modal */}
      {showReplyModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Reply to {selectedInquiry.name}</h2>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="text"
                  value={selectedInquiry.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={`Re: ${selectedInquiry.subject}`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={6}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Write your reply here..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}