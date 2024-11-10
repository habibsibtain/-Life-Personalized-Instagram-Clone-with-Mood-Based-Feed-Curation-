// middleware/authenticate.ts
import User from '@/models/userSchema'; // Adjust path as necessary
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

// Create a custom type for the request to include user information
export interface AuthenticatedRequest extends NextRequest {
  user?: any;
}

export const authMiddleware = async (req: AuthenticatedRequest) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }; // Use correct type
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Attach user to the request
    (req as AuthenticatedRequest ) .user = user;

    return undefined
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
};
