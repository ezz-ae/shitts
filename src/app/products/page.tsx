import React from 'react';
import { ProductCard } from '@/components/swiping/ProductCard';
import { products } from '@/lib/products'; // Assuming this file exists and exports product data
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProductsPage = () => {
  const allProducts = products.getAllProducts();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-headline font-bold mb-8 text-center">Our Latest Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
