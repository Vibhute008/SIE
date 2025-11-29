'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Load products from localStorage
  useEffect(() => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        router.push('/admin/login');
        return;
      }
      
      const storedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
      setProducts(storedProducts);
    } catch (error: any) {
      console.error('Error loading products:', error);
      showAlertPopup(`Error loading products: ${error.message || 'Unknown error'}`, 'error');
      setProducts([]);
    }
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
      try {
        const updatedProducts = products.filter(product => product.id !== deleteId);
        setProducts(updatedProducts);
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
        showAlertPopup('Product deleted successfully!', 'success');
      } catch (error: any) {
        console.error('Error deleting product:', error);
        showAlertPopup(`Error deleting product: ${error.message || 'Unknown error'}`, 'error');
      } finally {
        setShowDeleteConfirm(false);
        setDeleteId(null);
      }
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleSave = async (productData: any) => {
    try {
      // Validate required fields
      if (!productData.name || !productData.category) {
        showAlertPopup('Product name and category are required!', 'error');
        return;
      }
      
      // Validate that at least one image is provided
      if (!productData.images || productData.images.length === 0 || !productData.images[0]) {
        showAlertPopup('At least one product image is required!', 'error');
        return;
      }
      
      if (editingProduct) {
        // Update existing product
        const updatedProducts = products.map(p => p.id === editingProduct.id ? {...productData, id: editingProduct.id} : p);
        setProducts(updatedProducts);
        // Save to localStorage
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
        showAlertPopup('Product updated successfully!', 'success');
      } else {
        // Add new product
        const updatedProducts = [...products, {...productData, id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1}];
        setProducts(updatedProducts);
        // Save to localStorage
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
        showAlertPopup('Product added successfully!', 'success');
      }
      setShowModal(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Error saving product:', error);
      showAlertPopup(`Error saving product: ${error.message || 'Unknown error'}`, 'error');
    }
  };

  // Product Modal Component
  function ProductModal({ product, onClose, onSave }: { product: any, onClose: () => void, onSave: (data: any) => void }) {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      category: product?.category || '',
      price: product?.price || '',
      status: product?.status || 'Draft',
      description: product?.description || '',
      specifications: product?.specifications || '',
      packaging: product?.packaging || '',
      minOrder: product?.minOrder || '',
      delivery: product?.delivery || '',
      images: product?.images || [product?.imageUrl || ''],
    });
    const [previewImages, setPreviewImages] = useState<string[]>(formData.images);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev: any) => ({
        ...prev,
        [name]: value
      }));
    };

    const handleImageUrlChange = (index: number, value: string) => {
      const newImages = [...formData.images];
      newImages[index] = value;
      setFormData((prev: any) => ({
        ...prev,
        images: newImages
      }));
      const newPreviews = [...previewImages];
      newPreviews[index] = value;
      setPreviewImages(newPreviews);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const files = e.target.files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          handleImageUrlChange(index, result);
        };
        reader.readAsDataURL(files[0]);
      }
    };

    const addImageField = () => {
      setFormData((prev: any) => ({
        ...prev,
        images: [...prev.images, '']
      }));
      setPreviewImages([...previewImages, '']);
    };

    const removeImageField = (index: number) => {
      if (formData.images.length > 1) {
        const newImages = formData.images.filter((_: string, i: number) => i !== index);
        setFormData((prev: any) => ({
          ...prev,
          images: newImages
        }));
        const newPreviews = previewImages.filter((_: string, i: number) => i !== index);
        setPreviewImages(newPreviews);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Use first image as main imageUrl for compatibility
      const submitData = {
        ...formData,
        imageUrl: formData.images[0] || '',
      };
      onSave(submitData);
    };

    return (
      <div className="fixed inset-0 bg-gradient-to-b from-black/30 to-black/50 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="relative mx-auto p-8 w-full max-w-2xl shadow-2xl rounded-2xl bg-white border border-gray-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
          <div className="mt-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl leading-6 font-bold text-gray-900 flex items-center">
                <svg className="h-6 w-6 mr-2 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                {product ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200 hover:scale-110"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Spices">Spices</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                    placeholder="e.g., ₹45/kg"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                    required
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Images *
                </label>
                <p className="text-xs text-gray-500 mb-3">At least one product image is required</p>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {formData.images.map((image: string, index: number) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-semibold text-gray-600">Image {index + 1}</label>
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="text-red-600 hover:text-red-800 font-medium text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-2">Upload Image (Required)</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-2">Or paste Image URL</label>
                          <input
                            type="text"
                            value={image}
                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                            placeholder="https://example.com/image.jpg (required)"
                            className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all duration-200"
                          />
                        </div>
                      </div>
                      {previewImages[index] ? (
                        <div className="mt-3">
                          <Image
                            src={previewImages[index]}
                            alt={`Preview ${index + 1}`}
                            width={128}
                            height={128}
                            className="h-32 w-32 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.parentElement!.innerHTML = `
                                <div class="h-32 w-32 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center">
                                  <svg class="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              `;
                            }}
                          />
                        </div>
                      ) : (
                        <div className="mt-3 h-32 w-32 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center">
                          <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageField}
                    className="w-full py-2 px-3 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    + Add Another Image
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="specifications" className="block text-sm font-medium text-gray-700">
                  Specifications
                </label>
                <textarea
                  id="specifications"
                  name="specifications"
                  rows={3}
                  value={formData.specifications}
                  onChange={handleChange}
                  placeholder="e.g., Size: 45mm+, Color: Red, Moisture: 85% max"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                />
              </div>

              <div className="mt-6">
                <label htmlFor="packaging" className="block text-sm font-medium text-gray-700">
                  Packaging Options
                </label>
                <textarea
                  id="packaging"
                  name="packaging"
                  rows={3}
                  value={formData.packaging}
                  onChange={handleChange}
                  placeholder="e.g., 25kg PP bags, 10kg mesh bags"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="minOrder" className="block text-sm font-medium text-gray-700">
                    Minimum Order
                  </label>
                  <input
                    type="text"
                    name="minOrder"
                    id="minOrder"
                    value={formData.minOrder}
                    onChange={handleChange}
                    placeholder="e.g., 1000 kg"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="delivery" className="block text-sm font-medium text-gray-700">
                    Delivery Time
                  </label>
                  <input
                    type="text"
                    name="delivery"
                    id="delivery"
                    value={formData.delivery}
                    onChange={handleChange}
                    placeholder="e.g., 2-3 weeks after order"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3 sticky bottom-0 bg-white pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
                >
                  Save Product
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
              <h3 className="ml-4 text-lg font-semibold text-slate-900">Delete Product?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Product Management
          </h2>
          <p className="mt-2 text-base text-gray-600">Manage your product catalog</p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={handleAddNew}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl leading-6 font-bold text-gray-900 flex items-center">
            <svg className="h-5 w-5 mr-2 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            All Products
          </h3>
          <p className="mt-1 text-sm text-gray-600">{products.length} products in your catalog</p>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.imageUrl ? (
                            <Image 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={product.imageUrl} 
                              alt={product.name}
                              width={40}
                              height={40}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `
                                  <div class="h-10 w-10 rounded-md bg-gray-200 border border-gray-300 flex items-center justify-center">
                                    <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                `;
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 border border-gray-300 flex items-center justify-center">
                              <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${product.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-emerald-600 hover:text-emerald-900 mr-3 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
          {products.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-sm font-bold text-gray-900">No products</h3>
              <p className="mt-1 text-sm text-gray-600">Get started by creating a new product.</p>
              <div className="mt-6">
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-md text-sm font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => setShowModal(false)} 
          onSave={handleSave}
        />
      )}
    </div>
  );
}