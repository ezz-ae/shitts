import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const RightPage = () => {
  // Placeholder for cart items with refinement options
  const preCartItems = [
    { id: '1', name: 'Stylish T-Shirt', price: 29.99, quantity: 1, imageUrl: '/placeholder.png' },
    { id: '2', name: 'Designer Jeans', price: 89.99, quantity: 2, imageUrl: '/placeholder.png' },
  ];

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-headline font-bold mb-2">Your Smart Pre-Cart</CardTitle>
          <CardDescription className="font-body">Review and refine your selections before checkout.</CardDescription>
        </CardHeader>
        <CardContent>
          {preCartItems.length === 0 ? (
            <p className="text-center text-muted-foreground font-body">Your pre-cart is empty. Start adding items!</p>
          ) : (
            <div className="space-y-4">
              {preCartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                  <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="rounded-md object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg font-body">{item.name}</h3>
                    <p className="text-primary font-medium">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">-</Button>
                    <Input type="number" value={item.quantity} className="w-16 text-center" readOnly />
                    <Button variant="outline" size="sm">+</Button>
                    <Button variant="destructive" size="sm">Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 flex flex-col gap-4">
            <Button onClick={() => console.log("Proceed to Checkout")} size="lg">
              Proceed to Checkout
            </Button>
            <Button variant="secondary" onClick={() => console.log("Continue Swiping")} size="lg">
              Continue Swiping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightPage;
