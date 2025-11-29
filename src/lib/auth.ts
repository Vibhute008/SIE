// Utility functions for authentication

export function verifyToken(token: string): { userId: number; email: string; name: string; exp: number } | null {
  try {
    // Check if token is provided
    if (!token) {
      return null;
    }
    
    // Decode the base64 token
    const decodedStr = Buffer.from(token, 'base64').toString('utf-8');
    const decoded = JSON.parse(decodedStr);
    
    // Check if token has required fields
    if (!decoded.userId || !decoded.email || !decoded.exp) {
      return null;
    }
    
    // Check if token has expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      exp: decoded.exp
    };
  } catch (error) {
    // Log error for debugging but don't expose to client
    console.error('Token verification error:', error);
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('adminToken');
  if (!token) return false;
  
  return verifyToken(token) !== null;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
  }
}

// Get user info from token
export function getUserInfo(): { userId: number; email: string; name: string } | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) return null;
    
    const decoded = verifyToken(token);
    if (!decoded) return null;
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name
    };
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
}