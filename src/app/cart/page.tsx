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
      <Card className="max-w-2xl mx-auto bg-transparent border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-headline font-bold text-white">Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length > 0 ? (
            <>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center gap-4 text-white">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-md object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-gray-700 pt-6">
                <div className="flex justify-between font-bold text-xl mb-4 text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button size="lg" className="w-full text-lg bg-pink-500 hover:bg-pink-600 text-white" onClick={checkout}>Proceed to Checkout</Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Your cart is empty.</p>
                <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white">
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
