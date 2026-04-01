"use client";

import { useState } from "react";
import { updateProfile } from "@/features/auth/auth-actions";
import { Loader2, Check } from "lucide-react";

export default function ProfileForm({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError(null);

    const formData = new FormData(event.currentTarget);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-600 text-xs uppercase tracking-widest font-semibold">{error}</div>
      )}
      
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-charcoal/40">Full Name</label>
        <input
          name="name"
          defaultValue={user.name}
          className="w-full border-b border-brand-charcoal/20 bg-transparent py-2 outline-none focus:border-brand-charcoal transition-colors text-sm font-medium"
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-charcoal/40">Email Address</label>
        <div className="w-full py-2 text-sm font-medium text-brand-charcoal/60 cursor-not-allowed">
          {user.email}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-charcoal/40">Mobile Number</label>
        <input
          name="mobileNumber"
          defaultValue={user.mobileNumber}
          className="w-full border-b border-brand-charcoal/20 bg-transparent py-2 outline-none focus:border-brand-charcoal transition-colors text-sm font-medium"
          placeholder="Enter your mobile number"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center space-x-2 bg-brand-charcoal text-white py-4 hover:bg-brand-gold transition-colors group disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : success ? (
          <>
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Updated</span>
            <Check className="w-4 h-4" />
          </>
        ) : (
          <span className="text-xs uppercase tracking-[0.2em] font-bold">Update Profile</span>
        )}
      </button>
    </form>
  );
}
