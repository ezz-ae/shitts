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

export type OrderStatus = 'delivered' | 'processing' | 'shipped' | 'returned' | 'cancelled' | 'paid' | 'payment_confirmed' | 'pending_payment';

export interface Order {
  id: string;
  date: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  shippingAddress?: string;
  returnReason?: string;
  issueLog?: { timestamp: number; message: string }[];
}

export type InvoiceStatus = 'draft' | 'issued' | 'pending' | 'paid' | 'failed' | 'refunded';

export interface Invoice {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  provider: 'paypal' | 'ziina' | 'credit';
  providerRef: string;
  ledgerEntries: string[]; // IDs of ledger entries
  createdAt: number;
  paidAt?: number;
  metadata?: Record<string, any>;
}

export interface LedgerEntry {
  id: string;
  type: 'CREDIT' | 'DEBIT' | 'REFUND';
  amount: number;
  userId: string;
  description: string;
  metadata: {
    provider?: 'paypal' | 'ziina' | 'credit';
    eventType?: string;
    providerEventId?: string;
    providerRef?: string;
    invoiceId?: string;
    orderId?: string;
    [key: string]: any;
  };
  timestamp: number;
}

export interface WebhookEvent {
  id: string; // provider_eventId
  provider: 'paypal' | 'ziina';
  eventId: string;
  processedAt: number;
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
  creditHistory: LedgerEntry[];
}

export type UserIntent = {
    type: 'DISLIKE' | 'LIKE' | 'DETAIL_VIEW';
    productId: string;
    timestamp: number;
    traits: string[];
};
