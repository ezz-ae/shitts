import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

/**
 * ZIINA WEBHOOK HANDLER
 * Goal: Verify payment and update ledger/invoice.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.type;

    // TODO: Verify Z-Signature header here in production
    
    if (eventType === 'payment_intent.succeeded') {
      const data = body.data;
      const providerRef = data.id;
      const orderId = data.external_id;

      console.log(`Processing Ziina payment for Order: ${orderId}`);

      await db.ledger.addEntry({
        type: 'CREDIT',
        amount: data.amount / 100, // Convert back from minor units
        userId: 'system', // Replace with actual user ID
        description: `Ziina Payment: ${providerRef}`,
        metadata: { provider: 'ziina', event: eventType, orderId },
        timestamp: Date.now()
      });

      await db.orders.updateStatus(orderId, 'shipped');
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Ziina Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
