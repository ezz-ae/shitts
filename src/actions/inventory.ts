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
 * MASTER SYNC: Forces Firestore to match the provided seed data exactly.
 * This will delete old products and replace them with the new loading ones.
 */
export async function syncInitialProducts(products: Product[]) {
    try {
        console.log('SIMS: Starting Master Sync with fresh assets...');
        
        // 1. Clear existing products to ensure only loading assets exist
        const currentProducts = await adminDb.collection('products').get();
        if (!currentProducts.empty) {
            const deleteBatch = adminDb.batch();
            currentProducts.docs.forEach(doc => deleteBatch.delete(doc.ref));
            await deleteBatch.commit();
            console.log('SIMS: Cleared old inventory.');
        }

        // 2. Upload new products
        const batch = adminDb.batch();
        products.forEach((p) => {
            const ref = adminDb.collection('products').doc(p.id);
            batch.set(ref, p);
        });
        await batch.commit();
        console.log('SIMS: Fresh inventory successfully synced to Firestore.');
        
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
