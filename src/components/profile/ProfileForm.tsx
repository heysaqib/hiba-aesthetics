"use client";

import { useState } from "react";
import { updateProfile } from "@/features/auth/auth-actions";
import { Loader2, Check, AlertCircle } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  mobileNumber: string;
}

export default function ProfileForm({ user }: { user: UserProfile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const mobileNumber = formData.get("mobileNumber") as string;

    // Client-side validation
    if (!name || name.length < 3) {
      setError("Please enter your full name (minimum 3 characters)");
      setIsLoading(false);
      return;
    }

    if (!mobileNumber || mobileNumber.length < 10) {
      setError("Please enter a valid mobile number");
      setIsLoading(false);
      return;
    }

    const result = await updateProfile(formData);

    setIsLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to update profile");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
      {error && (
        <div className="flex items-center space-x-2 text-red-500 bg-red-50/50 p-4 border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="text-[10px] uppercase tracking-widest font-bold">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-charcoal/30">Full Name</label>
          <input
            name="name"
            defaultValue={user.name}
            required
            className="w-full border-b border-brand-charcoal/10 bg-transparent py-2 outline-none focus:border-brand-gold transition-colors text-sm font-medium"
            placeholder="E.g. Hiba Khan"
          />
        </div>

        <div className="space-y-1 opacity-50">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-charcoal/30">Email Address</label>
          <div className="w-full py-2 text-sm font-medium">
            {user.email}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-charcoal/30">Mobile Number</label>
          <input
            name="mobileNumber"
            type="tel"
            defaultValue={user.mobileNumber}
            required
            className="w-full border-b border-brand-charcoal/10 bg-transparent py-2 outline-none focus:border-brand-gold transition-colors text-sm font-medium"
            placeholder="+92 300 1234567"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center space-x-3 bg-brand-gold text-white px-8 py-3.5 hover:bg-brand-charcoal transition-all duration-300 disabled:opacity-50 group shadow-md"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        ) : success ? (
          <>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Profile Secured</span>
            <Check className="w-4 h-4 text-white" />
          </>
        ) : (
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Secure Changes</span>
        )}
      </button>
    </form>
  );
}
