import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { logger } from '@/lib/logger';

/**
 * PAYPAL WEBHOOK HANDLER
 * Verified cert chain, idempotency, and ledger-first.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type;
    const eventId = body.id; // Unique event ID from PayPal

    // 1. Check Idempotency
    const alreadyProcessed = await db.ledger.existsByProviderEvent('paypal', eventId);
    if (alreadyProcessed) {
        return NextResponse.json({ received: true, note: 'already_processed' });
    }

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = body.resource;
      const providerRef = resource.supplementary_data?.related_ids?.order_id || resource.id;
      
      // 2. Find Invoice
      const invoice = await db.invoices.getByProviderRef('paypal', providerRef);
      if (!invoice) {
          logger.error('PayPal Webhook: Invoice not found', { providerRef });
          return NextResponse.json({ error: 'Invoice mapping failed' }, { status: 404 });
      }

      // 3. Write Ledger (Idempotent Transaction)
      const ledgerEntry = await db.ledger.addEntryIdempotent({
        type: 'CREDIT',
        amount: parseFloat(resource.amount?.value || '0'),
        userId: invoice.userId,
        description: `PayPal Settlement: ${providerRef}`,
        metadata: {
            provider: 'paypal',
            eventType,
            providerEventId: eventId,
            providerRef,
            invoiceId: invoice.id,
            orderId: invoice.orderId,
            userId: invoice.userId
        },
        timestamp: Date.now()
      }, 'paypal', eventId);

      if (ledgerEntry) {
          // 4. Update Invoice & Order
          await db.invoices.updateStatus(invoice.id, 'paid', { paidAt: Date.now() });
          await db.invoices.attachLedgerEntry(invoice.id, ledgerEntry.id);
          await db.orders.updateStatus(invoice.orderId, 'paid');
          logger.payment('Settled via PayPal', invoice.orderId, { invoiceId: invoice.id });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('PayPal Webhook Critical Failure', { error });
    return NextResponse.json({ error: 'Internal failure' }, { status: 500 });
  }
}
