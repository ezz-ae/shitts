import type { Product } from '@/types';
import { PlaceHolderImages } from './placeholder-images';

const productDetails: Omit<Product, 'id' | 'imageUrl' | 'imageHint'>[] = [
  { name: 'Boho Chic Maxi Dress', price: 79.99, description: 'A flowing, floral-print maxi dress perfect for summer days. Made from lightweight, breathable cotton.' },
  { name: 'Vintage Denim Jacket', price: 89.99, description: 'A timeless denim jacket with a worn-in feel. Features button-front closure and two chest pockets.' },
  { name: 'LA Graphic T-Shirt', price: 29.99, description: 'A soft, oversized graphic tee with a vintage-inspired Los Angeles print. Made from 100% organic cotton.' },
  { name: 'High-Waisted Trousers', price: 64.50, description: 'Elegant, tailored trousers with a high waist and wide-leg silhouette. Perfect for office or evening wear.' },
  { name: 'Cozy Knit Sweater', price: 59.99, description: 'A chunky, oversized knit sweater to keep you warm and stylish. Features a classic crew neck and ribbed cuffs.' },
  { name: 'Leather Crossbody Bag', price: 120.00, description: 'A versatile and chic crossbody bag made from genuine leather. Compact size with multiple compartments.' },
  { name: 'Minimalist White Sneakers', price: 95.00, description: 'Crisp, clean white sneakers that go with everything. Crafted with a durable sole and comfortable insole.' },
  { name: 'Flowy A-Line Skirt', price: 49.99, description: 'A beautiful midi-length A-line skirt with a subtle pattern. Features an elastic waistband for a comfortable fit.' },
  { name: 'Tailored Linen Blazer', price: 110.00, description: 'A lightweight and breathable linen blazer, perfect for layering. Sharp, tailored fit for a polished look.' },
  { name: 'Chunky Gold Hoops', price: 35.00, description: 'Make a statement with these chunky gold-plated hoop earrings. Hypoallergenic and lightweight for all-day wear.' },
];

export const products: Product[] = PlaceHolderImages.map((image, index) => ({
  id: image.id,
  imageUrl: image.imageUrl,
  imageHint: image.imageHint,
  ...productDetails[index],
}));
