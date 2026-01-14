import { adminDb } from './firebase-admin';
import type { Product, Order, UserProfileData, UserIntent, Invoice, LedgerEntry, WebhookEvent } from '@/types';
import { FieldValue } from 'firebase-admin/firestore';

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
    async getAllUsers(): Promise<UserProfileData[]> {
      const snapshot = await adminDb.collection('users').get();
      return snapshot.docs.map(doc => doc.data() as UserProfileData);
    },
    async getProfile(userId: string): Promise<UserProfileData | undefined> {
      const doc = await adminDb.collection('users').doc(userId).get();
      return doc.exists ? doc.data() as UserProfileData : undefined;
    },
    async updateProfile(userId: string, data: Partial<UserProfileData>) {
      await adminDb.collection('users').doc(userId).set(data, { merge: true });
    },
    async getAllIntents(): Promise<UserIntent[]> {
      const snapshot = await adminDb.collectionGroup('intents').get();
      return snapshot.docs.map(doc => doc.data() as UserIntent);
    }
  },
  orders: {
    async getAllOrders(): Promise<Order[]> {
        const snapshot = await adminDb.collection('orders').get();
        return snapshot.docs.map(doc => doc.data() as Order);
    },
    async getOrderById(id: string): Promise<Order | undefined> {
        const doc = await adminDb.collection('orders').doc(id).get();
        return doc.exists ? doc.data() as Order : undefined;
    },
    async create(userId: string, order: Order) {
      const batch = adminDb.batch();
      const orderRef = adminDb.collection('orders').doc(order.id);
      const userOrderRef = adminDb.collection('users').doc(userId).collection('orders').doc(order.id);
      batch.set(orderRef, { ...order, userId });
      batch.set(userOrderRef, order);
      await batch.commit();
    },
    async updateOrder(id: string, updates: Partial<Order>) {
        await adminDb.collection('orders').doc(id).update(updates);
    },
    async updateStatus(orderId: string, status: Order['status']) {
      const orderRef = adminDb.collection('orders').doc(orderId);
      const orderDoc = await orderRef.get();
      if (!orderDoc.exists) return;
      const userId = orderDoc.data()?.userId;
      const batch = adminDb.batch();
      batch.update(orderRef, { status });
      if (userId) {
        const userOrderRef = adminDb.collection('users').doc(userId).collection('orders').doc(orderId);
        batch.update(userOrderRef, { status });
      }
      await batch.commit();
    }
  },
  invoices: {
    async create(invoice: Invoice) {
      await adminDb.collection('invoices').doc(invoice.id).set(invoice);
    },
    async getById(id: string): Promise<Invoice | undefined> {
      const doc = await adminDb.collection('invoices').doc(id).get();
      return doc.exists ? doc.data() as Invoice : undefined;
    },
    async getByProviderRef(provider: string, providerRef: string): Promise<Invoice | undefined> {
      const snapshot = await adminDb.collection('invoices')
        .where('provider', '==', provider)
        .where('providerRef', '==', providerRef)
        .limit(1)
        .get();
      if (snapshot.empty) return undefined;
      return snapshot.docs[0].data() as Invoice;
    },
    async updateStatus(invoiceId: string, status: Invoice['status'], patch: Partial<Invoice> = {}) {
      await adminDb.collection('invoices').doc(invoiceId).update({ status, ...patch });
    },
    async attachLedgerEntry(invoiceId: string, ledgerEntryId: string) {
      await adminDb.collection('invoices').doc(invoiceId).update({
        ledgerEntries: FieldValue.arrayUnion(ledgerEntryId)
      });
    }
  },
  ledger: {
    async existsByProviderEvent(provider: string, eventId: string): Promise<boolean> {
      const docId = `${provider}_${eventId}`;
      const doc = await adminDb.collection('webhook_events').doc(docId).get();
      return doc.exists;
    },
    async addEntryIdempotent(entry: Omit<LedgerEntry, 'id'>, provider: string, eventId: string) {
      const eventDocId = `${provider}_${eventId}`;
      
      return await adminDb.runTransaction(async (transaction) => {
        const eventRef = adminDb.collection('webhook_events').doc(eventDocId);
        const eventDoc = await transaction.get(eventRef);
        
        if (eventDoc.exists) {
          return null; // Already processed
        }

        const entryRef = adminDb.collection('ledger').doc();
        const newEntry = { ...entry, id: entryRef.id };
        
        transaction.set(entryRef, newEntry);
        transaction.set(eventRef, {
          provider,
          eventId,
          processedAt: Date.now()
        } as WebhookEvent);

        if (entry.userId && entry.userId !== 'system') {
          const userRef = adminDb.collection('users').doc(entry.userId);
          const increment = entry.type === 'CREDIT' ? entry.amount : -entry.amount;
          transaction.update(userRef, { credit: FieldValue.increment(increment) });
        }

        return newEntry;
      });
    }
  }
};
