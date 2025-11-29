// Utility functions for API calls

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  status: string;
  description: string;
  specifications: string;
  packaging: string;
  minOrder: string;
  delivery: string;
  imageUrl: string;
  images: string[];
  date: string;
}

interface ApiError {
  error: string;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({ error: '' }));
      throw new Error(errorData.error || `Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    return await response.json() as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array but also throw error for UI to handle
    throw new Error(`Failed to fetch products: ${(error as Error).message || 'Unknown error'}`);
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({ error: '' }));
      throw new Error(errorData.error || `Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    const products: Product[] = await response.json() as Product[];
    return products.find((product) => product.id === id) || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error(`Failed to fetch product: ${(error as Error).message || 'Unknown error'}`);
  }
}

export async function createProduct(productData: Omit<Product, 'id' | 'date'>): Promise<Product> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  
  if (!token) {
    throw new Error('Not authenticated: Please log in again');
  }
  
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({ error: '' })) as ApiError;
      throw new Error(errorData.error || `Failed to create product: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error(`Failed to create product: ${(error as Error).message || 'Unknown error'}`);
  }
}

export async function updateProduct(productData: Partial<Product>): Promise<Product> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  
  if (!token) {
    throw new Error('Not authenticated: Please log in again');
  }
  
  try {
    const response = await fetch('/api/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({ error: '' })) as ApiError;
      throw new Error(errorData.error || `Failed to update product: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error(`Failed to update product: ${(error as Error).message || 'Unknown error'}`);
  }
}

export async function deleteProduct(id: number): Promise<{ message: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  
  if (!token) {
    throw new Error('Not authenticated: Please log in again');
  }
  
  try {
    const response = await fetch(`/api/products?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({ error: '' })) as ApiError;
      throw new Error(errorData.error || `Failed to delete product: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as { message: string };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error(`Failed to delete product: ${(error as Error).message || 'Unknown error'}`);
  }
}