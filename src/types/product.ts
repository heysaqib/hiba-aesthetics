export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  description?: string;
  availableSizes?: string[];
  availableColors?: { id: string; hex: string; name: string }[];
  availableDesigns?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: { id: string; hex: string; name: string };
  selectedDesign?: string;
}

// For Wishlist, we might want to save the intent/preference if they selected it
export interface WishlistItem extends Product {
  selectedSize?: string;
  selectedColor?: { id: string; hex: string; name: string };
  selectedDesign?: string;
}
