import { Product } from '@/types';

let _products: Product[] = [
  {
    id: 'prod1',
    name: 'Floral Maxi Dress',
    description: 'A stylish floral maxi dress, perfect for summer days. Light and airy fabric.',
    price: 75.00,
    imageUrl: 'https://images.unsplash.com/photo-1594665489743-43b593a2b72a?w=500&q=80',
    category: 'Dresses',
    tags: ['floral', 'summer', 'maxi', 'lightweight', 'feminine']
  },
  {
    id: 'prod2',
    name: 'Classic Denim Jacket',
    description: 'A timeless vintage-style denim jacket. A versatile wardrobe staple.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1543087904-142c7924b2a8?w=500&q=80',
    category: 'Outerwear',
    tags: ['denim', 'vintage', 'classic', 'blue', 'versatile']
  },
  {
    id: 'prod3',
    name: 'Graphic Print T-Shirt',
    description: 'A comfortable and cool graphic t-shirt with a unique front print.',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    category: 'Tops',
    tags: ['graphic', 't-shirt', 'casual', 'typography', 'cotton']
  },
  {
    id: 'prod4',
    name: 'High-Waisted Trousers',
    description: 'Elegant high-waisted trousers that offer a flattering silhouette.',
    price: 65.00,
    imageUrl: 'https://images.unsplash.com/photo-1594623930112-127c523d4678?w=500&q=80',
    category: 'Bottoms',
    tags: ['trousers', 'elegant', 'high-waisted', 'formal', 'black']
  },
  {
    id: 'prod5',
    name: 'Cozy Knit Sweater',
    description: 'A soft and cozy knit sweater, perfect for chilly evenings.',
    price: 58.00,
    imageUrl: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500&q=80',
    category: 'Knitwear',
    tags: ['knit', 'sweater', 'cozy', 'winter', 'soft']
  },
  {
    id: 'prod6',
    name: 'Leather Crossbody Bag',
    description: 'A chic and practical leather crossbody bag for your essentials.',
    price: 120.00,
    imageUrl: 'https://images.unsplash.com/photo-1620921798336-a5100a06484d?w=500&q=80',
    category: 'Accessories',
    tags: ['leather', 'bag', 'crossbody', 'black', 'chic']
  },
  {
    id: 'prod7',
    name: 'Minimalist White Sneakers',
    description: 'Crisp, clean white sneakers that go with everything. Crafted with a durable sole and comfortable insole.',
    price: 95.00,
    imageUrl: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&q=80',
    category: 'Footwear',
    tags: ['sneakers', 'white', 'minimalist', 'leather', 'clean']
  },
  {
    id: 'prod8',
    name: 'Flowy A-Line Skirt',
    description: 'A beautiful midi-length A-line skirt with a subtle pattern. Features an elastic waistband for a comfortable fit.',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80',
    category: 'Bottoms',
    tags: ['skirt', 'midi', 'flowy', 'patterned', 'feminine']
  },
  {
    id: 'prod9',
    name: 'Tailored Linen Blazer',
    description: 'A lightweight and breathable linen blazer, perfect for layering. Sharp, tailored fit for a polished look.',
    price: 110.00,
    imageUrl: 'https://images.unsplash.com/photo-1631023412351-a084d2dae83e?w=500&q=80',
    category: 'Outerwear',
    tags: ['blazer', 'linen', 'tailored', 'beige', 'smart-casual']
  },
  {
    id: 'prod10',
    name: 'Chunky Gold Hoops',
    description: 'Make a statement with these chunky gold-plated hoop earrings. Hypoallergenic and lightweight for all-day wear.',
    price: 35.00,
    imageUrl: 'https://images.unsplash.com/photo-1615211912951-805cc9b77507?w=500&q=80',
    category: 'Accessories',
    tags: ['jewelry', 'earrings', 'gold', 'chunky', 'statement']
  },
];

export const products = {
  getAllProducts: (): Product[] => {
    return _products;
  },
  getProductById: (id: string): Product | undefined => {
    return _products.find((product) => product.id === id);
  },
};
