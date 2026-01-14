import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  imageUrl: z.string().url(),
  price: z.number().positive(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isCreditCard: z.boolean().optional(),
  creditAmount: z.number().optional()
});

export const CartItemSchema = z.object({
  product: ProductSchema,
  quantity: z.number().int().positive()
});

export const OrderSchema = z.object({
  id: z.string(),
  date: z.string(),
  items: z.array(CartItemSchema),
  total: z.number().nonnegative(),
  status: z.enum(['delivered', 'processing', 'shipped'])
});

export const UserProfileSchema = z.object({
  uid: z.string(),
  role: z.enum(['user', 'admin', 'guest']),
  name: z.string().min(1),
  phone: z.string(),
  locations: z.array(z.string()),
  credit: z.number().nonnegative(),
  wishlist: z.array(ProductSchema),
  orderHistory: z.array(OrderSchema)
});

export const InvoiceSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  userId: z.string(),
  amount: z.number().positive(),
  currency: z.string(),
  status: z.enum(['unpaid', 'paid', 'failed']),
  provider: z.enum(['paypal', 'ziina']),
  providerRef: z.string(),
  createdAt: z.number(),
  paidAt: z.number().optional()
});
