'use server';

import { createPayPalOrder, createZiinaPayment } from '@/lib/payments';

export async function processPaymentAction(amount: number, method: 'paypal' | 'ziina', orderId: string) {
  try {
    if (method === 'paypal') {
      const order = await createPayPalOrder(amount);
      return { success: true, approvalUrl: order.links.find((l: any) => l.rel === 'approve').href };
    } else {
      const paymentIntent = await createZiinaPayment(amount, orderId);
      return { success: true, approvalUrl: paymentIntent.redirect_url };
    }
  } catch (error) {
    console.error('Payment processing failed:', error);
    return { success: false, error: 'Payment initialization failed' };
  }
}
