import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LeftPage = () => {
  // Placeholder for disliked but available products
  const dislikedProducts = []; 

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-headline font-bold mb-2">Left Swipes: Still Available</CardTitle>
          <CardDescription className="font-body">Products you disliked but might reconsider.</CardDescription>
        </CardHeader>
        <CardContent>
          {dislikedProducts.length === 0 ? (
            <p className="text-center text-muted-foreground font-body">No items in your 'Left' pile yet. Keep swiping!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Render ProductCard components for disliked products here */}
              {/* Example: {dislikedProducts.map(product => <ProductCard key={product.id} product={product} />)} */}
              <p className="font-body">[Disliked Products List Placeholder]</p>
            </div>
          )}
          <div className="flex justify-center mt-6">
            <Button onClick={() => console.log("Explore more")} size="lg">
              Back to Swiping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeftPage;
