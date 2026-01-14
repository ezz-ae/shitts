'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';
import type { Product } from '@/types';

const PRODUCTS_COLLECTION = 'products';

export async function getProductsFromFirestore(): Promise<Product[]> {
  try {
    const productsCol = collection(db, PRODUCTS_COLLECTION);
    const productSnapshot = await getDocs(productsCol);
    return productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return [];
  }
}

export async function syncInitialProducts(products: Product[]) {
    try {
        const productsCol = collection(db, PRODUCTS_COLLECTION);
        const snapshot = await getDocs(productsCol);
        
        if (snapshot.empty) {
            console.log('Firestore inventory empty, syncing initial data...');
            for (const product of products) {
                await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
            }
        }
    } catch (error) {
        console.error('Error syncing initial products:', error);
    }
}

export async function addProductToFirestore(product: Omit<Product, 'id'>) {
    const id = `prod-${Date.now()}`;
    const newProduct = { ...product, id };
    await setDoc(doc(db, PRODUCTS_COLLECTION, id), newProduct);
    return newProduct;
}

export async function updateProductInFirestore(id: string, updates: Partial<Product>) {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(productRef, updates);
}

export async function deleteProductFromFirestore(id: string) {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}
