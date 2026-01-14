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
  },
  {
    id: 'prod_urban_1',
    name: 'Urban Explorer Jacket',
    description: 'A versatile jacket for the modern commuter. Water-resistant and packed with features.',
    price: 120.00,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-1603398986-376a2.firebasestorage.app/o/turtleneck-pullover-mockup-of-a-man-posing-by-a-concrete-wall-23223.PNG?alt=media&token=7d31b3e9-5147-493e-9080-5a337a6b2297',
    category: 'Outerwear',
    tags: ['jacket', 'urban', 'techwear', 'black'],
    attributes: { 'Material': 'Nylon', 'Fit': 'Regular' }
    },
    {
    id: 'prod_casual_1',
    name: 'Everyday Crewneck',
    description: 'A soft, comfortable crewneck for daily wear. Your new favorite sweater.',
    price: 55.00,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-1603398986-376a2.firebasestorage.app/o/crewneck-sweatshirt-mockup-of-a-man-at-a-studio-23170.PNG?alt=media&token=26d1a99b-d790-449b-98f5-7c093e8e7c10',
    category: 'Tops',
    tags: ['crewneck', 'sweater', 'casual', 'heather'],
    attributes: { 'Material': 'Cotton/Poly Blend', 'Fit': 'Relaxed' }
    },
    {
    id: 'prod_street_2',
    name: 'Graffiti Art Hoodie',
    description: 'A bold statement hoodie featuring custom artwork. Limited edition.',
    price: 85.00,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-1603398986-376a2.firebasestorage.app/o/hoodie-mockup-of-a-man-posing-in-a-graffiti-scenery-23218.PNG?alt=media&token=9698d254-8c88-4665-a83a-4ff18408f61c',
    category: 'Outerwear',
    tags: ['hoodie', 'streetwear', 'art', 'limited'],
    attributes: { 'Material': 'Fleece', 'Fit': 'Oversized' }
    },
    {
    id: 'prod_denim_1',
    name: 'Classic Denim Jacket',
    description: 'A timeless denim jacket that only gets better with age. A wardrobe essential.',
    price: 95.00,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-1603398986-376a2.firebasestorage.app/o/denim-jacket-mockup-of-a-man-posing-against-a-customizable-background-23169.PNG?alt=media&token=7c7d2c3b-1e5b-4e5c-9c7a-9e2c696e5d7c',
    category: 'Outerwear',
    tags: ['denim', 'jacket', 'classic', 'blue'],
    attributes: { 'Material': '100% Cotton Denim', 'Fit': 'Regular' }
    },
    {
    id: 'prod_tshirt_1',
    name: 'Basic Pocket Tee',
    description: 'A simple, well-made pocket tee. The foundation of any great outfit.',
    price: 25.00,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-1603398986-376a2.firebasestorage.app/o/t-shirt-mockup-of-a-man-with-a-big-beard-posing-in-a-studio-23168.PNG?alt=media&token=0b6a2e4c-1e2a-4c2d-8e8e-9d2a6a6f6c9d',
    category: 'Tops',
    tags: ['tshirt', 'basic', 'pocket', 'black'],
    attributes: { 'Material': '100% Cotton', 'Fit': 'Regular' }
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
