"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-brand-cream">
      {/* Left side Image */}
      <div className="hidden lg:flex w-1/2 relative">
        <Image
          src="/images/products/pakistani_bridal_1_1775023821125.png"
          alt="Login background"
          fill
          className="object-cover object-bottom"
          priority
        />
        <div className="absolute inset-0 bg-brand-charcoal/20" />
        <div className="absolute bottom-16 left-16 right-16 text-white text-center">
          <h2 className="text-3xl font-serif mb-4 drop-shadow-md">Welcome back to elegance</h2>
          <p className="text-sm text-white/80 font-medium tracking-wide">Enter the world of luxury Pakistani ethnic wear.</p>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative pt-32 lg:pt-0">
        <Link href="/" className="absolute top-10 left-10 text-xs tracking-widest font-semibold uppercase hover:text-brand-gold transition-colors flex items-center">
          &larr; Back to Shop
        </Link>
        <div className="w-full max-w-md">
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-serif text-brand-charcoal mb-4">Log in</h1>
            <p className="text-brand-charcoal/60 text-sm">Welcome back. Please enter your credentials.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/40" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full border-b border-brand-charcoal/20 bg-transparent py-3 pl-10 pr-4 outline-none focus:border-brand-charcoal transition-colors placeholder:text-brand-charcoal/30 flex items-center text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal">Password</label>
                <Link href="#" className="text-xs text-brand-charcoal/60 hover:text-brand-charcoal underline transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/40" />
                <input
                  type="password"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full border-b border-brand-charcoal/20 bg-transparent py-3 pl-10 pr-4 outline-none focus:border-brand-charcoal transition-colors placeholder:text-brand-charcoal/30 flex items-center text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-8 flex items-center justify-center space-x-2 bg-brand-charcoal text-white py-4 hover:bg-brand-gold transition-colors group"
            >
              <span className="text-sm uppercase tracking-widest font-medium">Continue</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-12 text-center lg:text-left border-t border-brand-charcoal/10 pt-8">
            <p className="text-sm text-brand-charcoal/60">
              Don't have an account?{' '}
              <Link href="#" className="font-semibold text-brand-charcoal hover:text-brand-gold transition-colors underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
