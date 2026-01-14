'use server';

import { createPayPalOrder, createZiinaPayment } from '@/lib/payments';
import { requireSession } from '@/server/auth';
import { db } from '@/server/db';
import type { CartItem, Invoice } from '@/types';

export async function processCheckoutAction(cart: CartItem[], method: 'paypal' | 'ziina') {
  try {
    const session = await requireSession();
    
    // Server-side calculation
    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const orderId = `ORD-${Date.now()}`;
    const invoiceId = `INV-${Date.now()}`;

    let approvalUrl = '';
    let providerRef = '';

    if (method === 'paypal') {
      const order = await createPayPalOrder(total);
      approvalUrl = order.links.find((l: any) => l.rel === 'approve').href;
      providerRef = order.id;
    } else {
      const paymentIntent = await createZiinaPayment(total, orderId);
      approvalUrl = paymentIntent.redirect_url;
      providerRef = paymentIntent.id;
    }

    // 1. Create the Order
    await db.orders.create(session.uid, {
        id: orderId,
        date: new Date().toLocaleDateString(),
        items: cart,
        total,
        status: 'processing'
    });

    // 2. Create the Invoice (PHASE 3 Backbone)
    const invoice: Invoice = {
      id: invoiceId,
      orderId,
      userId: session.uid,
      amount: total,
      currency: method === 'paypal' ? 'USD' : 'AED',
      status: 'unpaid',
      provider: method,
      providerRef,
      createdAt: Date.now()
    };
    await db.invoices.create(invoice);

    return { success: true, approvalUrl };
  } catch (error: any) {
    console.error('Checkout failed:', error);
    return { success: false, error: error.message || 'Payment initialization failed' };
  }
}
