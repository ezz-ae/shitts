"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { products } from '@/lib/products'; // Our simulated backend
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

interface AdminProductFormPageProps {
  params: { id: string };
}

const AdminProductFormPage = ({ params }: AdminProductFormPageProps) => {
  const router = useRouter();
  const isNewProduct = params.id === 'new';
  const existingProduct = products.getProductById(params.id);

  const [productData, setProductData] = React.useState<Partial<Product>>(
    existingProduct || { name: '', description: '', price: 0, imageUrl: '', category: '', imageHint: '' }
  );

  React.useEffect(() => {
    if (!isNewProduct && !existingProduct) {
      router.push('/admin/products'); // Redirect if editing a non-existent product
    }
  }, [isNewProduct, existingProduct, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [id]: id === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isNewProduct) {
      // Ensure all required fields for a new product are present and correctly typed
      if (!productData.name || !productData.imageUrl || productData.price === undefined) {
        alert('Please fill in all required fields: Name, Image URL, and Price.');
        return;
      }
      const newProduct: Omit<Product, 'id'> = {
        name: productData.name,
        description: productData.description || '',
        price: productData.price,
        imageUrl: productData.imageUrl,
        category: productData.category || '',
        imageHint: productData.imageHint || '',
      };
      products.addProduct(newProduct);
    } else if (existingProduct) {
      products.updateProduct(params.id, productData);
    }
    router.push('/admin/products');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-headline font-bold">
          {isNewProduct ? 'Add New Product' : `Edit Product: ${existingProduct?.name}`}
        </CardTitle>
        <CardDescription className="font-body">
          {isNewProduct ? 'Fill in the details for a new product.' : 'Update the product details below.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="font-body">Product Name</Label>
            <Input id="name" value={productData.name || ''} onChange={handleChange} required className="font-body" />
          </div>
          <div>
            <Label htmlFor="description" className="font-body">Description</Label>
            <Textarea id="description" value={productData.description || ''} onChange={handleChange} className="font-body" />
          </div>
          <div>
            <Label htmlFor="price" className="font-body">Price</Label>
            <Input id="price" type="number" value={productData.price || 0} onChange={handleChange} required className="font-body" />
          </div>
          <div>
            <Label htmlFor="imageUrl" className="font-body">Image URL</Label>
            <Input id="imageUrl" value={productData.imageUrl || ''} onChange={handleChange} required className="font-body" />
          </div>
          <div>
            <Label htmlFor="category" className="font-body">Category</Label>
            <Input id="category" value={productData.category || ''} onChange={handleChange} className="font-body" />
          </div>
          <div>
            <Label htmlFor="imageHint" className="font-body">Image Hint (for AI)</Label>
            <Input id="imageHint" value={productData.imageHint || ''} onChange={handleChange} className="font-body" />
          </div>
          <Button type="submit" size="lg">
            {isNewProduct ? 'Create Product' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminProductFormPage;
