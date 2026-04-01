"use client";

import { logout } from "@/features/auth/auth-actions";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center space-x-2 text-brand-charcoal/40 hover:text-brand-gold transition-colors"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Log out</span>
      <LogOut className="w-4 h-4" />
    </button>
  );
}
