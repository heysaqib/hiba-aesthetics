'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-development'
);

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please provide both email and password' };
  }

  try {
    await connectToDatabase();

    // 1. Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return { error: 'Invalid credentials' };
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return { error: 'Invalid credentials' };
    }

    // 3. Generate JWT
    const token = await new SignJWT({ 
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(JWT_SECRET);

    // 4. Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true };

  } catch (error: any) {
    console.error('Login error:', error);
    return { error: 'An error occurred during login' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return { success: true };
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session.value, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}
