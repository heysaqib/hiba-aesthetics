'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

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

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return { error: 'Invalid credentials' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return { error: 'Invalid credentials' };
    }

    const token = await new SignJWT({ 
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name || user.email // Fallback to email if name is not set
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(JWT_SECRET);

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

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const mobileNumber = formData.get('mobileNumber') as string;

  if (!email || !password || !mobileNumber) {
    return { error: 'Please provide all required fields' };
  }

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'Email already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      mobileNumber,
      name: '', // Will be updated in profile
    });

    const token = await new SignJWT({ 
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.email
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(JWT_SECRET);

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
    console.error('Signup error:', error);
    return { error: 'An error occurred during signup' };
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

export async function getUserProfile() {
  const session = await getSession();
  if (!session) return null;

  try {
    await connectToDatabase();
    const user = await User.findById(session.id).lean();
    if (!user) return null;
    
    // Convert _id to string for serialization
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    return null;
  }
}

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const name = formData.get('name') as string;
  const mobileNumber = formData.get('mobileNumber') as string;

  try {
    await connectToDatabase();
    await User.findByIdAndUpdate(session.id, {
      name,
      mobileNumber,
    });

    revalidatePath('/profile');
    return { success: true };
  } catch (error: any) {
    return { error: 'Failed to update profile' };
  }
}

export async function addAddress(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const address = {
    name: formData.get('name') as string,
    mobile: formData.get('mobile') as string,
    street: formData.get('street') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zipCode: formData.get('zipCode') as string,
    isDefault: formData.get('isDefault') === 'on',
  };

  try {
    await connectToDatabase();
    const user = await User.findById(session.id);
    
    if (address.isDefault) {
      user.addresses.forEach((addr: any) => addr.isDefault = false);
    }

    user.addresses.push(address);
    await user.save();

    revalidatePath('/profile');
    return { success: true };
  } catch (error: any) {
    return { error: 'Failed to add address' };
  }
}

export async function deleteAddress(addressId: string) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  try {
    await connectToDatabase();
    await User.findByIdAndUpdate(session.id, {
      $pull: { addresses: { _id: addressId } }
    });

    revalidatePath('/profile');
    return { success: true };
  } catch (error: any) {
    return { error: 'Failed to delete address' };
  }
}
