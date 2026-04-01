'use server';

import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/features/auth/auth-actions';
import { CartItem, WishlistItem } from '@/types/product';
import { revalidatePath } from 'next/cache';

export async function syncCart(items: CartItem[]) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  try {
    await connectToDatabase();
    await User.findByIdAndUpdate(session.id, {
      cart: items.map(item => ({
        ...item,
        // Ensure id is stored consistently (MongoDB might expect _id but we use id)
        id: item.id
      }))
    });
    return { success: true };
  } catch (error) {
    console.error('Sync cart error:', error);
    return { error: 'Failed to sync cart' };
  }
}

export async function syncWishlist(items: WishlistItem[]) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  try {
    await connectToDatabase();
    await User.findByIdAndUpdate(session.id, {
      wishlist: items.map(item => ({
        ...item,
        id: item.id
      }))
    });
    return { success: true };
  } catch (error) {
    console.error('Sync wishlist error:', error);
    return { error: 'Failed to sync wishlist' };
  }
}

export async function getCartAndWishlist() {
  const session = await getSession();
  if (!session) return null;

  try {
    await connectToDatabase();
    const user = await User.findById(session.id).select('cart wishlist').lean();
    if (!user) return null;

    return {
      cart: JSON.parse(JSON.stringify(user.cart || [])),
      wishlist: JSON.parse(JSON.stringify(user.wishlist || []))
    };
  } catch (error) {
    console.error('Get cart/wishlist error:', error);
    return null;
  }
}
