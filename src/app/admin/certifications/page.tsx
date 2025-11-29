'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AlertPopup from '@/components/AlertPopup/AlertPopup';
import { useAlert } from '@/hooks/useAlert';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: number;
  image: string;
  description: string;
  certificateUrl: string;
  date: string;
}

export default function CertificationsAdmin() {
  const router = useRouter();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    year: new Date().getFullYear(),
    image: '',
    description: '',
    certificateUrl: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const { alert, showAlert, hideAlert } = useAlert();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
    }

    const saved = JSON.parse(localStorage.getItem('adminCertifications') || '[]');
    setTimeout(() => {
      setCertifications(saved);
    }, 0);
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCertification = () => {
    setFormData({
      name: '',
      issuer: '',
      year: new Date().getFullYear(),
      image: '',
      description: '',
      certificateUrl: '',
    });
    setImagePreview('');
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditCertification = (cert: Certification) => {
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      year: cert.year,
      image: cert.image,
      description: cert.description,
      certificateUrl: cert.certificateUrl,
    });
    setImagePreview(cert.image);
    setEditingId(cert.id);
    setShowModal(true);
  };

  const handleSaveCertification = () => {
    if (!formData.name || !formData.issuer) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }
    
    // Validate that an image is provided
    if (!formData.image) {
      showAlert('An image is required!', 'error');
      return;
    }

    let updated: Certification[];
    if (editingId) {
      updated = certifications.map(c => 
        c.id === editingId 
          ? { ...c, ...formData, date: c.date }
          : c
      );
    } else {
      const newCert: Certification = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
      };
      updated = [...certifications, newCert];
    }

    localStorage.setItem('adminCertifications', JSON.stringify(updated));
    setCertifications(updated);
    setShowModal(false);
    showAlert(
      editingId 
        ? 'Certification updated successfully!' 
        : 'Certification added successfully!',
      'success'
    );
  };

  const handleDeleteCertification = (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const updated = certifications.filter(c => c.id !== deleteId);
      localStorage.setItem('adminCertifications', JSON.stringify(updated));
      setCertifications(updated);
      setShowDeleteConfirm(false);
      setDeleteId(null);
      showAlert('Certification deleted successfully!', 'success');
    }
  };

  return (
    <div className="">
      <AlertPopup 
        message={alert.message}
        type={alert.type}
        isOpen={alert.isOpen}
        onClose={hideAlert}
      />
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
              <h3 className="ml-4 text-lg font-semibold text-slate-900">Delete Certification?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this certification? This action cannot be undone.
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
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl flex items-center">
              <svg className="h-7 w-7 mr-3 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Certifications
            </h1>
            <p className="mt-2 text-base text-gray-600">Manage company certifications and accreditations</p>
          </div>
          <button
            onClick={handleAddCertification}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Certification
          </button>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map(cert => (
            <div key={cert.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 rounded-full -translate-y-12 translate-x-12 opacity-10"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-400 rounded-full translate-y-16 -translate-x-16 opacity-10"></div>
              
              <div className="relative z-10 p-5">
                {cert.image && (
                  <div className="flex justify-center mb-4">
                    <Image 
                      src={cert.image} 
                      alt={cert.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 object-contain rounded-lg border-2 border-white shadow"
                    />
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="font-bold text-slate-900 text-lg">{cert.name}</h3>
                  <p className="text-sm text-emerald-600 font-medium mt-1">{cert.issuer}</p>
                  <p className="text-xs text-slate-500 mt-1">Year: {cert.year}</p>
                  
                  {cert.description && (
                    <p className="text-sm text-slate-700 mt-3 line-clamp-2">{cert.description}</p>
                  )}
                </div>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => handleEditCertification(cert)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCertification(cert.id)}
                    className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow"
                  >
                    Delete
                  </button>
                </div>

                {cert.certificateUrl && (
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-center px-3 py-2 text-sm bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-colors font-medium shadow"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {certifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No certifications yet</p>
            <button
              onClick={handleAddCertification}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
            >
              Add First Certification
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-in zoom-in-95 slide-in-from-bottom-4">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Certification' : 'Add Certification'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-600 hover:text-slate-900 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Certification Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-900"
                  placeholder="e.g., ISO 9001 Certification"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Issuing Organization *</label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-900"
                  placeholder="Organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-900"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-900"
                  placeholder="Certification details..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Badge/Logo Image URL or Upload *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image.startsWith('data:') ? '' : formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-900"
                    placeholder="https://example.com/image.jpg (required)"
                  />
                  <label className="relative px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold cursor-pointer transition-colors">
                    Upload (Required)
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500 mt-1">Image upload is required</p>
                {imagePreview && (
                  <Image 
                    src={imagePreview} 
                    alt="Preview"
                    width={80}
                    height={80}
                    className="mt-3 w-20 h-20 rounded-lg object-cover border border-slate-200"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Certificate URL</label>
                <input
                  type="text"
                  value={formData.certificateUrl}
                  onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-900"
                  placeholder="Link to verify certificate"
                />
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCertification}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold transition-colors"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
