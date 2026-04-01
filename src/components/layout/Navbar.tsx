"use client";

import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, LogOut, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSession, logout } from "@/features/auth/auth-actions";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/cart-context";
import { useWishlist } from "@/features/products/wishlist-context";

const navLinks = [
  { name: "BRIDAL", href: "/shop?category=bridal" },
  { name: "FORMAL", href: "/shop?category=formal" },
  { name: "PRET", href: "/shop?category=pret" },
  { name: "UNSTITCHED", href: "/shop?category=unstitched" },
];

interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const router = useRouter();
  
  const { totalItems: cartCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch session
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setUser(session as unknown as UserSession);
      }
    };
    fetchSession();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 w-full z-[100010] transition-colors duration-300 ${
          isScrolled || mobileMenuOpen ? "bg-brand-cream/90 backdrop-blur-md border-b border-brand-charcoal/10" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left - Navigation (Desktop) */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium tracking-widest text-brand-charcoal hover:text-brand-gold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-brand-charcoal hover:text-brand-gold transition-colors p-2 -ml-2"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Center - Logo */}
            <Link href="/" className="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center">
              <span className="font-serif text-2xl tracking-widest uppercase font-semibold text-brand-charcoal">
                Hiba <span className="text-brand-gold">Aesthetics</span>
              </span>
            </Link>

            {/* Right - Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button className="text-brand-charcoal hover:text-brand-gold transition-colors" aria-label="Search">
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/profile"
                    className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.2em] text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
                  >
                    Hi, {user.name ? user.name.split(' ')[0] : 'User'}
                  </Link>
                  <Link 
                    href="/profile"
                    className="text-brand-charcoal hover:text-brand-gold transition-colors" 
                    aria-label="Profile"
                  >
                    <User className="w-5 h-5 stroke-[1.5]" />
                  </Link>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:block text-brand-charcoal hover:text-brand-gold transition-colors" aria-label="Account">
                  <User className="w-5 h-5 stroke-[1.5]" />
                </Link>
              )}

              <Link href="/wishlist" className="hidden sm:block text-brand-charcoal hover:text-brand-gold transition-colors relative" aria-label="Wishlist">
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {wishlistCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-brand-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>
              <Link href="/cart" className="text-brand-charcoal hover:text-brand-gold transition-colors relative" aria-label="Cart">
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={cartCount}
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-20 left-0 w-full bg-brand-cream border-b border-brand-charcoal/10 z-[100005] overflow-hidden shadow-xl"
          >
            <div className="px-4 py-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium tracking-wide text-brand-charcoal hover:text-brand-gold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-brand-charcoal/10 flex flex-wrap gap-6">
                {user ? (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-sm font-medium tracking-wide text-brand-charcoal hover:text-brand-gold transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> LOGOUT
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-sm font-medium tracking-wide text-brand-charcoal hover:text-brand-gold transition-colors">
                    <User className="w-4 h-4 mr-2" /> ACCOUNT
                  </Link>
                )}
                <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-sm font-medium tracking-wide text-brand-charcoal hover:text-brand-gold transition-colors">
                  <Heart className="w-4 h-4 mr-2" /> WISHLIST ({wishlistCount})
                </Link>
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-sm font-medium tracking-wide text-brand-charcoal hover:text-brand-gold transition-colors">
                  <ShoppingBag className="w-4 h-4 mr-2" /> CART ({cartCount})
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
