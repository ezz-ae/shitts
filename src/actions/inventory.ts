'use server';

import { db } from '@/server/db';
import { adminDb } from '@/server/firebase-admin';
import { assertAdmin } from '@/server/guards';
import type { Product } from '@/types';

export async function getProductsAction(): Promise<Product[]> {
  return db.products.getAll();
}

export async function getProductsFromFirestore(): Promise<Product[]> {
  return db.products.getAll();
}

/**
 * Real synchronization logic: Populates Firestore if empty.
 */
export async function syncInitialProducts(products: Product[]) {
    try {
        const snapshot = await adminDb.collection('products').limit(1).get();
        if (snapshot.empty) {
            console.log('SIMS: Firestore products empty. Initializing seed data...');
            const batch = adminDb.batch();
            products.forEach((p) => {
                const ref = adminDb.collection('products').doc(p.id);
                batch.set(ref, p);
            });
            await batch.commit();
            console.log('SIMS: Seed data successfully synced.');
        }
    } catch (error) {
        console.error('SIMS: Sync failed', error);
    }
}

export async function addProductAction(product: Omit<Product, 'id'>) {
  await assertAdmin();
  const id = `prod-${Date.now()}`;
  const newProduct = { ...product, id };
  await adminDb.collection('products').doc(id).set(newProduct);
  return newProduct;
}

export async function deleteProductAction(id: string) {
  await assertAdmin();
  await adminDb.collection('products').doc(id).delete();
}
