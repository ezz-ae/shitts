import { Product } from '@/types';

let _products: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    description: 'A timeless classic, perfect for any casual occasion.',
    price: 25.00,
    imageUrl: '/placeholder.png',
    imageHint: 'white t-shirt',
    category: 'Apparel',
  },
  {
    id: '2',
    name: 'Denim Slim Fit Jeans',
    description: 'Comfortable and stylish slim-fit jeans for everyday wear.',
    price: 60.00,
    imageUrl: '/placeholder.png',
    imageHint: 'denim jeans',
    category: 'Apparel',
  },
  {
    id: '3',
    name: 'Vintage Leather Jacket',
    description: 'A rugged yet sophisticated leather jacket to complete your look.',
    price: 180.00,
    imageUrl: '/placeholder.png',
    imageHint: 'leather jacket',
    category: 'Outerwear',
  },
  {
    id: '4',
    name: 'Minimalist Sneakers',
    description: 'Clean design, maximum comfort. Your go-to everyday sneakers.',
    price: 90.00,
    imageUrl: '/placeholder.png',
    imageHint: 'white sneakers',
    category: 'Footwear',
  },
  {
    id: '5',
    name: 'Striped Knit Sweater',
    description: 'Soft and warm knit sweater with a classic stripe pattern.',
    price: 55.00,
    imageUrl: '/placeholder.png',
    imageHint: 'striped sweater',
    category: 'Apparel',
  },
];

export const products = {
  getAllProducts: (): Product[] => {
    return _products;
  },

  getProductById: (id: string): Product | undefined => {
    return _products.find((product) => product.id === id);
  },

  addProduct: (product: Omit<Product, 'id'>): Product => {
    const newProduct: Product = { ...product, id: Date.now().toString() }; // Simple ID generation
    _products.push(newProduct);
    return newProduct;
  },

  updateProduct: (id: string, updatedFields: Partial<Product>): Product | undefined => {
    const index = _products.findIndex((product) => product.id === id);
    if (index > -1) {
      _products[index] = { ..._products[index], ...updatedFields };
      return _products[index];
    }
    return undefined;
  },

  deleteProduct: (id: string): boolean => {
    const initialLength = _products.length;
    _products = _products.filter((product) => product.id !== id);
    return _products.length < initialLength;
  },
};
