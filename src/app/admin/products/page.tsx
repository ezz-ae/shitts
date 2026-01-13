import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { products } from '@/lib/products'; // Our simulated backend
import { useRouter } from 'next/navigation';

const AdminProductsPage = () => {
  const router = useRouter();
  const allProducts = products.getAllProducts();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      products.deleteProduct(id);
      router.refresh(); // Refresh the page to show updated list
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-3xl font-headline font-bold">Products</CardTitle>
        <Button asChild>
          <Link href="/admin/products/new">Add New Product</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-body">{product.id}</TableCell>
                <TableCell className="font-body">{product.name}</TableCell>
                <TableCell className="font-body">${product.price.toFixed(2)}</TableCell>
                <TableCell className="font-body">{product.category}</TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/products/${product.id}`}>Edit</Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminProductsPage;
