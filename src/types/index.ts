export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description?: string;
  category?: string;
  imageHint?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}
