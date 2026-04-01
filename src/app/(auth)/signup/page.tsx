"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Phone, Loader2 } from "lucide-react";
import { useState } from "react";
import { signup } from "@/features/auth/auth-actions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signup(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      await refreshUser();
      router.push("/profile");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex bg-brand-cream">
      {/* Left side Image */}
      <div className="hidden lg:flex w-1/2 relative">
        <Image
          src="/images/products/pakistani_bridal_1_1775023821125.png"
          alt="Signup background"
          fill
          className="object-cover object-bottom"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-brand-charcoal/20" />
        <div className="absolute bottom-16 left-16 right-16 text-white text-center">
          <h2 className="text-3xl font-serif mb-4 drop-shadow-md">Join the world of elegance</h2>
          <p className="text-sm text-white/80 font-medium tracking-wide">Create an account to experience luxury Pakistani ethnic wear.</p>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative pt-32 lg:pt-0">
        <Link href="/" className="absolute top-10 left-10 text-xs tracking-widest font-semibold uppercase hover:text-brand-gold transition-colors flex items-center">
          &larr; Back to Shop
        </Link>
        <div className="w-full max-w-md">
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-serif text-brand-charcoal mb-4">Sign up</h1>
            <p className="text-brand-charcoal/60 text-sm">Create your account with just a few details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/40" />
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full border-b border-brand-charcoal/20 bg-transparent py-3 pl-10 pr-4 outline-none focus:border-brand-charcoal transition-colors placeholder:text-brand-charcoal/30 flex items-center text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/40" />
                <input
                  name="mobileNumber"
                  type="tel"
                  placeholder="+92 300 1234567"
                  required
                  className="w-full border-b border-brand-charcoal/20 bg-transparent py-3 pl-10 pr-4 outline-none focus:border-brand-charcoal transition-colors placeholder:text-brand-charcoal/30 flex items-center text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/40" />
                <input
                  name="password"
                  type="password"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  required
                  className="w-full border-b border-brand-charcoal/20 bg-transparent py-3 pl-10 pr-4 outline-none focus:border-brand-charcoal transition-colors placeholder:text-brand-charcoal/30 flex items-center text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 flex items-center justify-center space-x-2 bg-brand-gold text-white py-4 hover:bg-brand-charcoal transition-all duration-300 group disabled:opacity-50 shadow-md active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span className="text-xs uppercase tracking-[0.2em] font-bold">Create Account</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center lg:text-left border-t border-brand-charcoal/10 pt-8">
            <p className="text-sm text-brand-charcoal/60">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-brand-charcoal hover:text-brand-gold transition-colors underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
