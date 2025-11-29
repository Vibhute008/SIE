'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import AlertPopup from '@/components/AlertPopup';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  status: string;
  imageUrl: string;
  images?: string[];
  description: string;
  specifications: string;
  packaging: string;
  minOrder: string;
  delivery: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    country: '',
    quantity: '',
    message: ''
  });
  const [alert, setAlert] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  // Default products data
  const defaultProducts: Product[] = [
    {
      id: 1,
      name: 'Nashik Red Onion',
      category: 'Vegetables',
      price: '₹45/kg',
      status: 'Published',
      imageUrl: 'https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      description: 'Premium red onions from the fertile lands of Nashik, known for their sharp taste and high quality.',
      specifications: 'Size: 45mm+, Color: Red, Moisture: 85% max, HS Code: 07030010',
      packaging: '25kg PP bags, 10kg mesh bags',
      minOrder: '1000 kg',
      delivery: '2-3 weeks after order confirmation'
    },
    {
      id: 2,
      name: 'Fresh Lemon',
      category: 'Fruits',
      price: '₹80/kg',
      status: 'Published',
      imageUrl: 'https://images.unsplash.com/photo-1593587157138-68b77949b3a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      description: 'Juicy and fresh lemons with high vitamin C content, perfect for culinary and beverage applications.',
      specifications: 'Size: Medium to Large, Color: Yellow/Green, Moisture: 88% max, HS Code: 08055000',
      packaging: '20kg corrugated boxes, 10kg mesh bags',
      minOrder: '500 kg',
      delivery: '1-2 weeks after order confirmation'
    },
    {
      id: 3,
      name: 'Basmati Rice',
      category: 'Grains',
      price: '₹120/kg',
      status: 'Published',
      imageUrl: 'https://images.unsplash.com/photo-1615484477773-40c6b7b5b78d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      description: 'Premium quality basmati rice with long grains and aromatic flavor, popular in Middle Eastern and Asian cuisines.',
      specifications: 'Grain Length: 6.5mm+, Aroma: High, Moisture: 14% max, HS Code: 10063000',
      packaging: '25kg PP bags, 10kg vacuum packs',
      minOrder: '1000 kg',
      delivery: '2-3 weeks after order confirmation'
    },
    {
      id: 4,
      name: 'Red Lentils',
      category: 'Pulses',
      price: '₹95/kg',
      status: 'Published',
      imageUrl: 'https://images.unsplash.com/photo-1615484477773-40c6b7b5b78d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      description: 'High-protein red lentils with quick cooking time, perfect for soups and stews.',
      specifications: 'Size: Split, Color: Red, Protein: 25% min, HS Code: 07134000',
      packaging: '25kg PP bags, 5kg poly packs',
      minOrder: '500 kg',
      delivery: '1-2 weeks after order confirmation'
    },
    {
      id: 5,
      name: 'Turmeric Powder',
      category: 'Spices',
      price: '₹220/kg',
      status: 'Published',
      imageUrl: 'https://images.unsplash.com/photo-1596803244610-0359df7f8ec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      description: 'Organic turmeric powder with high curcumin content, used in cooking and traditional medicine.',
      specifications: 'Curcumin: 3% min, Color: Yellow, Moisture: 10% max, HS Code: 09102000',
      packaging: '10kg foil bags, 1kg glass jars',
      minOrder: '200 kg',
      delivery: '1-2 weeks after order confirmation'
    }
  ];

  useEffect(() => {
    try {
      const storedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
      const allProducts = storedProducts.length > 0 ? storedProducts : defaultProducts;
      const foundProduct = allProducts.find((p: Product) => p.id === productId);
      
      if (foundProduct) {
        // Ensure product has images array
        if (!foundProduct.images && foundProduct.imageUrl) {
          foundProduct.images = [foundProduct.imageUrl];
        }
        if (!foundProduct.images) {
          foundProduct.images = [];
        }
        setProduct(foundProduct);
      } else {
        setAlert({
          isOpen: true,
          message: 'Product not found',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error loading product:', error);
      const foundProduct = defaultProducts.find(p => p.id === productId);
      if (foundProduct) {
        if (!foundProduct.images && foundProduct.imageUrl) {
          foundProduct.images = [foundProduct.imageUrl];
        }
        if (!foundProduct.images) {
          foundProduct.images = [];
        }
        setProduct(foundProduct);
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.country || !inquiryForm.quantity) {
      setAlert({
        isOpen: true,
        message: 'Please fill in all required fields',
        type: 'warning'
      });
      return;
    }

    try {
      const newInquiry = {
        id: Date.now(),
        name: inquiryForm.name,
        email: inquiryForm.email,
        country: inquiryForm.country,
        product: product?.name || 'Unknown',
        quantity: inquiryForm.quantity,
        message: inquiryForm.message,
        date: new Date().toISOString().split('T')[0],
        status: 'New'
      };

      const existingInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
      existingInquiries.push(newInquiry);
      localStorage.setItem('inquiries', JSON.stringify(existingInquiries));

      setAlert({
        isOpen: true,
        message: 'Thank you for your inquiry! We will contact you soon.',
        type: 'success'
      });

      setInquiryForm({
        name: '',
        email: '',
        country: '',
        quantity: '',
        message: ''
      });
    } catch (error) {
      setAlert({
        isOpen: true,
        message: 'Error submitting inquiry. Please try again.',
        type: 'error'
      });
    }
  };

  const closeAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Product Not Found</h1>
            <p className="mt-4 text-lg text-gray-600">Sorry, the product you&#39;re looking for doesn&#39;t exist.</p>
            <Link href="/products" className="mt-8 inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition">
              Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AlertPopup 
        message={alert.message} 
        type={alert.type} 
        isOpen={alert.isOpen} 
        onClose={closeAlert}
      />
      <Header />

      <main>
        {/* Breadcrumb */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200 py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-1">
                <li>
                  <div className="flex items-center">
                    <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">Home</Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">Products</Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600 font-medium" aria-current="page">{product.name}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16">
              {/* Product Images */}
              <div>
                <div className="rounded-xl overflow-hidden w-full h-96 bg-gray-100 mb-6">
                  <Image 
                    src={product.images && product.images.length > 0 ? product.images[selectedImageIndex] : product.imageUrl} 
                    alt={product.name} 
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images && product.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((image: string, index: number) => (
                      image && (
                        <div
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`rounded-lg overflow-hidden w-full h-24 bg-gray-100 cursor-pointer hover:opacity-75 transition ${
                            selectedImageIndex === index ? 'ring-2 ring-emerald-600' : ''
                          }`}
                        >
                          <Image 
                            src={image}
                            alt={`Product view ${index + 1}`} 
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-10 lg:mt-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{product.name}</h1>
                    <div className="mt-2 flex items-center">
                      <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-6 border-t border-b border-gray-200 py-6">
                  <div>
                    <span className="text-sm text-gray-600">Starting Price</span>
                    <p className="text-4xl font-extrabold text-emerald-600">{product.price}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-6 text-lg text-gray-600">
                  {product.description}
                </p>

                {/* Quick Info */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-emerald-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700"><strong>Minimum Order:</strong> {product.minOrder}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-emerald-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700"><strong>Delivery Time:</strong> {product.delivery}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <a href="#inquiry-form" className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Get a Quote
                  </a>
                  <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition font-medium">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                  </Link>
                </div>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="mt-16 border-t pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>
                  <p className="text-gray-700 whitespace-pre-line">{product.specifications}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Packaging Options</h3>
                  <p className="text-gray-700 whitespace-pre-line">{product.packaging}</p>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-16 border-t pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Choose This Product?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg mb-4">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">100% Farm Fresh</h3>
                  <p className="mt-2 text-gray-600">Sourced directly from trusted farms to ensure maximum freshness and quality.</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg mb-4">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.757a1 1 0 01-.940 1.017 7.003 7.003 0 01-1.379-.071 8.983 8.983 0 01-1.9-.596 8.98 8.98 0 01-1.513-.667 9.036 9.036 0 01-1.37-1.03 9.046 9.046 0 01-1.370 1.03 8.981 8.981 0 01-1.513.667 8.981 8.981 0 01-1.9.596 7.003 7.003 0 01-1.379.07A1 1 0 013.455 9.82V3.062a3.066 3.066 0 012.812-3.062zm2.718 5.042a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Quality Certified</h3>
                  <p className="mt-2 text-gray-600">All products meet international standards with proper certifications.</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg mb-4">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Fast Shipping</h3>
                  <p className="mt-2 text-gray-600">Quick and reliable global delivery with real-time tracking available.</p>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div id="inquiry-form" className="mt-16 border-t pt-12">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Request a Quote</h2>
                <p className="text-gray-600 mb-8">Get in touch with us for pricing, bulk orders, and more information about this product.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={inquiryForm.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={inquiryForm.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-900">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        id="country"
                        value={inquiryForm.country}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-900">
                        Desired Quantity *
                      </label>
                      <input
                        type="text"
                        name="quantity"
                        id="quantity"
                        placeholder="e.g., 1000 kg"
                        value={inquiryForm.quantity}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-900">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={inquiryForm.message}
                      onChange={handleInputChange}
                      placeholder="Any additional information or special requests..."
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300"
                    >
                      Send Inquiry
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}