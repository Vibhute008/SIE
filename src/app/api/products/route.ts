import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// In a real application, this would be stored in a database
let products: any[] = [];

// Initialize with some sample data if empty
if (products.length === 0) {
  products = [
    {
      id: 1,
      name: "Nashik Red Onion",
      category: "Vegetables",
      price: "₹45/kg",
      status: "Published",
      imageUrl: "https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Premium red onions from the fertile lands of Nashik, known for their sharp taste and high quality.",
      specifications: "Size: 45mm+, Color: Red, Moisture: 85% max",
      packaging: "25kg PP bags, 10kg mesh bags",
      minOrder: "1000 kg",
      delivery: "2-3 weeks after order"
    },
    {
      id: 2,
      name: "Fresh Lemons",
      category: "Fruits",
      price: "₹80/kg",
      status: "Published",
      imageUrl: "https://images.unsplash.com/photo-1597402873505-8529fbba32de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Juicy and tangy lemons sourced directly from orchards, perfect for culinary uses and beverages.",
      specifications: "Size: 65-75mm, Color: Yellow, Juice Content: 40% min",
      packaging: "10kg corrugated boxes, 5kg cartons",
      minOrder: "500 kg",
      delivery: "2-3 weeks after order"
    },
    {
      id: 3,
      name: "Basmati Rice",
      category: "Grains",
      price: "₹120/kg",
      status: "Published",
      imageUrl: "https://images.unsplash.com/photo-1596295467872-9a2db4c1a7d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Premium aged basmati rice with distinctive aroma and elongated grains, perfect for special occasions.",
      specifications: "Grain Length: 8mm+, Aroma: Distinctive, Moisture: 14% max",
      packaging: "25kg jute bags, 10kg vacuum sealed packs",
      minOrder: "1000 kg",
      delivery: "2-3 weeks after order"
    },
    {
      id: 4,
      name: "Black Mustard Seeds",
      category: "Spices",
      price: "₹180/kg",
      status: "Published",
      imageUrl: "https://images.unsplash.com/photo-1598449383139-0e089e40fc97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      description: "Organic black mustard seeds with strong flavor and aroma, ideal for pickles and cooking.",
      specifications: "Color: Dark Brown, Oil Content: 30% min, Impurities: 2% max",
      packaging: "25kg laminated bags, 5kg glass jars",
      minOrder: "500 kg",
      delivery: "2-3 weeks after order"
    }
  ];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authToken = request.headers.get('authorization')?.split(' ')[1];
  
  // For public access (no auth needed for fetching products)
  if (!authToken) {
    return NextResponse.json(products);
  }
  
  // For admin access, verify token
  const userData = verifyToken(authToken);
  if (!userData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const authToken = request.headers.get('authorization')?.split(' ')[1];
  
  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }
  
  const userData = verifyToken(authToken);
  if (!userData) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
  
  try {
    const productData = await request.json();
    
    // Validate required fields
    if (!productData.name || !productData.category) {
      return NextResponse.json({ error: 'Product name and category are required' }, { status: 400 });
    }
    
    // Generate new ID
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = { ...productData, id: newId };
    
    products.push(newProduct);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON format in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create product: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authToken = request.headers.get('authorization')?.split(' ')[1];
  
  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }
  
  const userData = verifyToken(authToken);
  if (!userData) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
  
  try {
    const productData = await request.json();
    
    if (!productData.id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    const index = products.findIndex(p => p.id === productData.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Validate required fields
    if (!productData.name || !productData.category) {
      return NextResponse.json({ error: 'Product name and category are required' }, { status: 400 });
    }
    
    products[index] = { ...products[index], ...productData };
    
    return NextResponse.json(products[index]);
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON format in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update product: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authToken = request.headers.get('authorization')?.split(' ')[1];
  
  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }
  
  const userData = verifyToken(authToken);
  if (!userData) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    
    if (!idParam) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
    }
    
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    products.splice(index, 1);
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}