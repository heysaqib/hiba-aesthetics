"use client";

import { logout } from "@/features/auth/auth-actions";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useCart } from "@/features/cart/cart-context";
import { useWishlist } from "@/features/products/wishlist-context";

export default function LogoutButton() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { clearWishlist } = useWishlist();

  async function handleLogout() {
    // Clear local data first to protect privacy
    clearCart();
    clearWishlist();
    
    await logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <button 
      onClick={handleLogout}
      className="inline-flex items-center space-x-2 text-brand-charcoal/20 hover:text-brand-gold transition-all duration-300 group px-4 py-2 border border-brand-charcoal/5 hover:border-brand-gold/20 bg-white/50"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Log out</span>
      <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}
