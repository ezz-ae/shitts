export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
