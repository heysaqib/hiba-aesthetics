import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-brand-charcoal/10 bg-brand-cream pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-2xl tracking-widest uppercase font-semibold text-brand-charcoal">
                Hiba <span className="text-brand-gold">Aesthetics</span>
              </span>
            </Link>
            <p className="text-sm text-brand-charcoal/70 leading-relaxed mb-6">
              Premium online boutique specializing in luxury Pakistani ethnic and bridal wear. Celebrating tradition with modern elegance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-brand-charcoal text-brand-cream flex items-center justify-center hover:bg-brand-gold transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-brand-charcoal text-brand-cream flex items-center justify-center hover:bg-brand-gold transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-brand-charcoal text-brand-cream flex items-center justify-center hover:bg-brand-gold transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Col */}
          <div>
            <h4 className="font-semibold text-xs tracking-widest uppercase mb-6 text-brand-charcoal">Navigation</h4>
            <ul className="space-y-4">
              {['Bridal', 'Formal', 'Pret', 'Unstitched'].map((item) => (
                <li key={item}>
                  <Link href={`/shop?category=${item.toLowerCase()}`} className="text-sm text-brand-charcoal/70 hover:text-brand-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Col */}
          <div>
            <h4 className="font-semibold text-xs tracking-widest uppercase mb-6 text-brand-charcoal">Customers</h4>
            <ul className="space-y-4">
              {['Promotions', 'Delivery', 'Payment', 'Gift Card'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-brand-charcoal/70 hover:text-brand-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Col */}
          <div>
            <h4 className="font-semibold text-xs tracking-widest uppercase mb-6 text-brand-charcoal">About</h4>
            <ul className="space-y-4">
              {['News', 'Public Offer', 'User Agreement', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-brand-charcoal/70 hover:text-brand-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-charcoal/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-charcoal/50">
          <p>&copy; {new Date().getFullYear()} Hiba Aesthetics. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span>Visa</span>
            <span>MasterCard</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
