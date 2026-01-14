import { Product } from '@/types';

// Updated with the new live Firebase Storage URLs provided
let _products: Product[] = [
  {
    id: 'prod_selfie_1',
    name: 'Round Neck Selfie Tee',
    description: 'A premium cotton round neck t-shirt featuring a perfect fit for self-expression. High-quality fabric designed for everyday comfort.',
    price: 35.00,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-1603398986-376a2.firebasestorage.app/o/girl-doing-a-sexy-face-while-taking-a-selfie-wearing-a-round-neck-tshirt-mockup-a17013.PNG?alt=media&token=6eca3d77-01a0-432e-a364-62317d6a8a37',
    category: 'Tops',
    tags: ['tshirt', 'round-neck', 'cotton', 'white', 'streetwear'],
    attributes: { 'Material': '100% Cotton', 'Fit': 'Regular' }
  },
  {
    id: 'prod_smile_1',
    name: 'Transparent Smile Tee',
    description: 'Lightweight, semi-transparent designer tee that balances elegance with a modern streetwear edge.',
    price: 42.00,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-1603398986-376a2.firebasestorage.app/o/transparent-tee-mockup-of-a-young-woman-smiling-to-the-camera-22965.PNG?alt=media&token=87b40d1b-2296-47af-95b1-2d0e25a34d16',
    category: 'Tops',
    tags: ['transparent', 'designer', 'minimalist', 'white'],
    attributes: { 'Material': 'Cotton Blend', 'Fit': 'Slim' }
  },
  {
    id: 'prod_vid_1',
    name: 'Dynamic Motion Piece',
    description: 'Experience fashion in motion. This piece is designed for those who never stand still.',
    price: 55.00,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-1603398986-376a2.firebasestorage.app/o/ScreenRecording_04-09-2025%2018-40-37_1.mov?alt=media&token=a55bef0e-05c9-493d-9bd3-db3012779a69',
    category: 'Active',
    tags: ['motion', 'video', 'exclusive', 'premium'],
    attributes: { 'Type': 'Limited Edition' }
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
