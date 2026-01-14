import { Product } from '@/types';

// Using the provided live Firebase Storage assets
let _products: Product[] = [
  {
    id: 'prod_selfie_1',
    name: 'Streetwear Selfie Tee',
    description: 'A premium cotton round neck t-shirt with a modern fit. Designed for those who live for the moment.',
    price: 35.00,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-1603398986-376a2.firebasestorage.app/o/girl-doing-a-sexy-face-while-taking-a-selfie-wearing-a-round-neck-tshirt-mockup-a17013.PNG?alt=media&token=6eca3d77-01a0-432e-a364-62317d6a8a37',
    category: 'Tops',
    tags: ['tshirt', 'cotton', 'white', 'streetwear', 'essentials'],
    attributes: { 'Material': '100% Cotton', 'Fit': 'Regular' }
  },
  {
    id: 'prod_smile_1',
    name: 'Sheer Horizon Tee',
    description: 'Lightweight, semi-transparent designer tee. A minimalist staple with an avant-garde touch.',
    price: 45.00,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-1603398986-376a2.firebasestorage.app/o/transparent-tee-mockup-of-a-young-woman-smiling-to-the-camera-22965.PNG?alt=media&token=87b40d1b-2296-47af-95b1-2d0e25a34d16',
    category: 'Tops',
    tags: ['transparent', 'designer', 'minimalist', 'white', 'editorial'],
    attributes: { 'Material': 'Technical Mesh', 'Fit': 'Slim' }
  },
  {
    id: 'prod_vid_1',
    name: 'Core Motion Campaign',
    description: 'Dynamic fashion captured in movement. Our signature piece for the season.',
    price: 65.00,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-1603398986-376a2.firebasestorage.app/o/ScreenRecording_04-09-2025%2018-40-37_1.mov?alt=media&token=a55bef0e-05c9-493d-9bd3-db3012779a69',
    category: 'Active',
    tags: ['motion', 'campaign', 'video', 'exclusive', 'black'],
    attributes: { 'Collection': 'Genesis', 'Style': 'Activewear' }
  },
  {
    id: 'prod_selfie_v2',
    name: 'Round Neck Archive',
    description: 'Re-imagined classic round neck. Built for durability and style.',
    price: 39.00,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-1603398986-376a2.firebasestorage.app/o/girl-doing-a-sexy-face-while-taking-a-selfie-wearing-a-round-neck-tshirt-mockup-a17013.PNG?alt=media&token=6eca3d77-01a0-432e-a364-62317d6a8a37',
    category: 'Tops',
    tags: ['tshirt', 'classic', 'white', 'archival'],
    attributes: { 'Material': 'Heavyweight Cotton', 'Fit': 'Boxy' }
  },
  {
    id: 'prod_smile_v2',
    name: 'Studio Mesh Top',
    description: 'The ultimate studio piece. High breathability with a high-fashion silhouette.',
    price: 49.00,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-1603398986-376a2.firebasestorage.app/o/transparent-tee-mockup-of-a-young-woman-smiling-to-the-camera-22965.PNG?alt=media&token=87b40d1b-2296-47af-95b1-2d0e25a34d16',
    category: 'Active',
    tags: ['transparent', 'active', 'minimalist', 'studio'],
    attributes: { 'Material': 'Performance Mesh', 'Fit': 'Athletic' }
  }
];

export const products = {
  getAllProducts: (): Product[] => {
    return _products;
  },
  getProductById: (id: string): Product | undefined => {
    return _products.find((product) => product.id === id);
  },
};
