'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AlertPopup from '@/components/AlertPopup/AlertPopup';
import { useAlert } from '@/hooks/useAlert';

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
}

export default function GalleryAdmin() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'Gallery',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const { alert, showAlert, hideAlert } = useAlert();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
    }
  }, [router]);

  // Load images from localStorage on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('adminGallery') || '[]');
    setTimeout(() => {
      setImages(saved);
    }, 0);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, imageUrl: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: 'Gallery',
    });
    setImagePreview('');
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditImage = (image: GalleryImage) => {
    setFormData({
      title: image.title,
      description: image.description,
      imageUrl: image.imageUrl,
      category: image.category,
    });
    setImagePreview(image.imageUrl);
    setEditingId(image.id);
    setShowModal(true);
  };

  const handleSaveImage = () => {
    if (!formData.title) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }
    
    // Validate that an image is provided
    if (!formData.imageUrl) {
      showAlert('An image is required!', 'error');
      return;
    }

    let updated: GalleryImage[];
    if (editingId) {
      updated = images.map(img => 
        img.id === editingId 
          ? { ...img, ...formData, date: img.date }
          : img
      );
    } else {
      const newImage: GalleryImage = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
      };
      updated = [...images, newImage];
    }

    localStorage.setItem('adminGallery', JSON.stringify(updated));
    setImages(updated);
    setShowModal(false);
    showAlert(
      editingId 
        ? 'Image updated successfully!' 
        : 'Image added successfully!',
      'success'
    );
  };

  const handleDeleteImage = (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const updated = images.filter(img => img.id !== deleteId);
      localStorage.setItem('adminGallery', JSON.stringify(updated));
      setImages(updated);
      setShowDeleteConfirm(false);
      setDeleteId(null);
      showAlert('Image deleted successfully!', 'success');
    }
  };

  const categories = ['all', ...new Set(images.map(img => img.category))];
  const filteredImages = filterCategory === 'all' ? images : images.filter(img => img.category === filterCategory);

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
              <h3 className="ml-4 text-lg font-semibold text-slate-900">Delete Image?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this image? This action cannot be undone.
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Gallery
            </h1>
            <p className="mt-2 text-base text-gray-600">Manage gallery images and media</p>
          </div>
          <button
            onClick={handleAddImage}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Image
          </button>
        </div>

        {/* Filter */}
        {categories.length > 1 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filterCategory === cat
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {cat === 'all' ? 'All Images' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map(image => (
            <div key={image.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group">
              <div className="relative overflow-hidden bg-slate-100 h-48">
                {image.imageUrl ? (
                  <Image 
                    src={image.imageUrl} 
                    alt={image.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">No image uploaded</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-4">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
                    <button
                      onClick={() => handleEditImage(image)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1 truncate">{image.title}</h3>
                <p className="text-xs text-emerald-600 font-medium mb-2">{image.category}</p>
                {image.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">{image.description}</p>
                )}
                <p className="text-xs text-slate-500 mt-3">{new Date(image.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              {images.length === 0 ? 'No images in gallery yet' : `No images in ${filterCategory} category`}
            </p>
            <button
              onClick={handleAddImage}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
            >
              Add First Image
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-in zoom-in-95 slide-in-from-bottom-4">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Image' : 'Add Image'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-600 hover:text-slate-900 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Image Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-900"
                  placeholder="Image title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-900"
                  placeholder="e.g., Events, Projects, Team"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Image URL or Upload *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
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
                    width={400}
                    height={128}
                    className="mt-3 w-full h-32 rounded-lg object-cover border border-slate-200"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-900"
                  placeholder="Image description..."
                  rows={3}
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
                onClick={handleSaveImage}
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
