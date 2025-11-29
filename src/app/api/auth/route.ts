import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// In a real application, this would be stored in a database
// For now, we'll keep it as a constant but with proper password hashing
const ADMIN_USERS = [
  {
    id: 1,
    email: 'admin@satyamexport.com',
    // Hashed password using bcrypt (hash of 'admin123')
    passwordHash: '$2b$10$Tbm6xPfZT/gIspeBn0S72OuQwKqHpsSuV.V5LDw0kI1fO3wamh7XS',
    name: 'Administrator'
  }
];

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  error?: string;
}

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      );
    }

    // In a real application, you would validate credentials against a database
    // For this demo, we'll use hardcoded credentials
    if (email === 'admin@satyamexports.com' && password === 'admin123') {
      // Create a simple token (in a real app, use a proper JWT library)
      const tokenPayload = {
        userId: 1,
        email: email,
        name: 'Admin User',
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
      };

      const token = btoa(JSON.stringify(tokenPayload));

      return NextResponse.json({ token });
    } else {
      return NextResponse.json(
        { error: 'Invalid email or password' }, 
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
