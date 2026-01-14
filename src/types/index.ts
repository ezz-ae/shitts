export type UserRole = 'user' | 'admin' | 'guest';

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
  attributes?: Record<string, string>;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Order {
  id: string;
  date: string;
  userId?: string;
  items: CartItem[];
  total: number;
  status: 'delivered' | 'processing' | 'shipped' | 'returned' | 'cancelled';
  trackingNumber?: string;
  shippingAddress?: string;
  returnReason?: string;
  issueLog?: { timestamp: number; message: string }[];
}

export interface Invoice {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'unpaid' | 'paid' | 'failed';
  provider: 'paypal' | 'ziina' | 'credit';
  providerRef: string;
  createdAt: number;
  paidAt?: number;
}

export interface LedgerEntry {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  userId: string;
  description: string;
  metadata: Record<string, any>;
  timestamp: number;
}

export interface UserProfileData {
  uid: string;
  role: UserRole;
  name: string;
  phone: string;
  locations: string[];
  paymentCards: { last4: string; brand: string }[];
  credit: number;
  picked: Product[];
  orderHistory: Order[];
  creditHistory: LedgerEntry[]; // Added for detailed wallet tracking
}

export type UserIntent = {
    type: 'DISLIKE' | 'LIKE' | 'DETAIL_VIEW';
    productId: string;
    timestamp: number;
    traits: string[];
};
