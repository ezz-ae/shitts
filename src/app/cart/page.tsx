"use client";
import React from 'react';
import { ShoppingCart } from '@/components/cart/ShoppingCart'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/useApp';
import Link from 'next/link';

const CartPage = () => {
  const { cart, checkout } = useApp();
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline font-bold">Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <ShoppingCart />
          {cart.length > 0 && (
            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between font-bold text-xl mb-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button size="lg" className="w-full text-lg" onClick={checkout}>Proceed to Checkout</Button>
            </div>
          )}
           {cart.length === 0 && (
            <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Your cart is empty.</p>
                <Button asChild>
                    <Link href="/">Continue Swiping</Link>
                </Button>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CartPage;
