export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
