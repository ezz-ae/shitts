import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

/**
 * PAYPAL WEBHOOK HANDLER
 * Goal: Verify payment and update ledger/invoice.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type;

    // TODO: Verify PayPal-Auth-Algo and PayPal-Signature headers here in production
    
    if (eventType === 'CHECKOUT.ORDER.APPROVED' || eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = body.resource;
      const providerRef = resource.id;
      
      // Look up invoice by provider reference
      // (In production, you'd query Firestore for invoice where providerRef == providerRef)
      // For this demo, let's assume the invoice ID is passed or identifiable
      const orderId = resource.purchase_units?.[0]?.reference_id || resource.id;
      
      console.log(`Processing PayPal payment for Order: ${orderId}`);

      // 1. Update Invoice status
      // 2. Update Order status to 'shipped' (or next step)
      // 3. Write to Ledger
      await db.ledger.addEntry({
        type: 'CREDIT',
        amount: parseFloat(resource.amount?.value || '0'),
        userId: 'system', // Replace with actual user ID from invoice
        description: `PayPal Payment: ${providerRef}`,
        metadata: { provider: 'paypal', event: eventType, orderId },
        timestamp: Date.now()
      });

      await db.orders.updateStatus(orderId, 'shipped');
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
