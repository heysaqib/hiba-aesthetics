"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Facebook, X, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-foreground">
      <main className="flex w-full max-w-2xl flex-col items-center text-center space-y-12">
        {/* Logo Placeholder */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-playfair)] tracking-tighter font-bold uppercase italic">
            Hiba Aesthetics
          </h1>
          <p className="text-muted-foreground tracking-[0.3em] uppercase text-sm font-sans">
            Elegance in Every Thread
          </p>
        </div>

        {/* Hero Content */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-balance">
            Our new collection is arriving soon.
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            We are working hard to bring you a curated selection of premium aesthetics. 
            Join our exclusive list to be the first to know when we launch.
          </p>
        </div>

        {/* Notify Me Form */}
        <div className="w-full max-w-md space-y-4">
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="h-12 flex-1"
              required
            />
            <Button size="lg" className="h-12 px-8">
              Notify Me
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">
            Be the first to receive updates, exclusive offers, and early access.
          </p>
        </div>

        {/* Social Links */}
        <div className="pt-8 space-y-6">
          <div className="flex items-center justify-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
              <Instagram className="size-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
              <Facebook className="size-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="X">
              <X className="size-6" />
            </a>
            <a href="mailto:info@hiba-aesthetics.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
              <Mail className="size-6" />
            </a>
          </div>
          <p className="text-sm font-light text-muted-foreground">
            © 2026 Hiba Aesthetics. All rights reserved.
          </p>
        </div>
      </main>

      {/* Aesthetic Accents (Optional) */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
    </div>
  );
}
