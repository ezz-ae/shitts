import { adminDb } from './firebase-admin';
import type { Product, Order, UserProfileData, UserIntent } from '@/types';

/**
 * DB Service: Centralized, server-side only data access.
 * This replaces direct Firestore calls in the UI.
 */
export const db = {
  products: {
    async getAll(): Promise<Product[]> {
      const snapshot = await adminDb.collection('products').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    },
    async getById(id: string): Promise<Product | undefined> {
      const doc = await adminDb.collection('products').doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } as Product : undefined;
    }
  },
  users: {
    async getProfile(userId: string): Promise<UserProfileData | undefined> {
      const doc = await adminDb.collection('users').doc(userId).get();
      return doc.exists ? doc.data() as UserProfileData : undefined;
    },
    async updateProfile(userId: string, data: Partial<UserProfileData>) {
      await adminDb.collection('users').doc(userId).set(data, { merge: true });
    },
    async logIntent(userId: string, intent: UserIntent) {
      await adminDb.collection('users').doc(userId).collection('intents').add(intent);
    }
  },
  orders: {
    async create(userId: string, order: Order) {
      const batch = adminDb.batch();
      const orderRef = adminDb.collection('orders').doc(order.id);
      const userOrderRef = adminDb.collection('users').doc(userId).collection('orders').doc(order.id);
      
      batch.set(orderRef, { ...order, userId });
      batch.set(userOrderRef, order);
      
      await batch.commit();
    }
  }
};
