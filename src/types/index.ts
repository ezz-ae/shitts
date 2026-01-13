export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description?: string; // Added for admin panel
  category?: string;    // Added for admin panel
  imageHint?: string;
}
