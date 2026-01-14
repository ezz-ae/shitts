export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description?: string;
  category?: string;
  tags?: string[];
  imageHint?: string;
  isCreditCard?: boolean;
  creditAmount?: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'delivered' | 'processing' | 'shipped';
}

export interface UserProfileData {
  name: string;
  phone: string;
  locations: string[];
  paymentCards: { last4: string; brand: string }[];
  credit: number;
  wishlist: Product[];
  orderHistory: Order[];
}

export type UserIntent = {
    type: 'DISLIKE' | 'LIKE' | 'DETAIL_VIEW';
    productId: string;
    timestamp: number;
    traits: string[];
};
