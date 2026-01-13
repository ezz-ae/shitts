import React from 'react';
import { products } from '@/lib/products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ProductDetailPageProps {
  params: { id: string };
}

const ProductDetailPage = ({ params }: ProductDetailPageProps) => {
  const product = products.getProductById(params.id);

  if (!product) {
    return <div className="container mx-auto p-4 text-center text-red-500">Product not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="flex flex-col md:flex-row gap-6 p-6">
        <div className="md:w-1/2">
          <Image
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            width={500}
            height={500}
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-between">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-4xl font-headline font-bold mb-2">{product.name}</CardTitle>
            <CardDescription className="text-2xl text-primary font-semibold">${product.price.toFixed(2)}</CardDescription>
          </CardHeader>
          <CardContent className="px-0 flex-grow">
            <p className="text-lg text-foreground leading-relaxed mb-4">{product.description || 'No description available.'}</p>
            {/* Add more product details here, e.g., sizes, colors, materials */}
          </CardContent>
          <Button className="w-full py-6 text-lg">Add to Cart</Button>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
