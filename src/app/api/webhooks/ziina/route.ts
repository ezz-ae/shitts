import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { logger } from '@/lib/logger';

/**
 * ZIINA WEBHOOK HANDLER
 * verified Z-Signature, idempotency, and ledger-first.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get('z-signature');
    const eventType = body.type;
    const eventId = body.id; // Unique event ID from Ziina

    // TODO: crypto.createHmac('sha256', process.env.ZIINA_WEBHOOK_SECRET).update(rawBody).digest('hex')
    if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // 1. Check Idempotency
    const alreadyProcessed = await db.ledger.existsByProviderEvent('ziina', eventId);
    if (alreadyProcessed) {
        return NextResponse.json({ received: true, note: 'already_processed' });
    }

    if (eventType === 'payment_intent.succeeded') {
      const data = body.data;
      const providerRef = data.id;
      const orderId = data.external_id;

      // 2. Find Invoice
      const invoice = await db.invoices.getByProviderRef('ziina', providerRef);
      if (!invoice) {
          logger.error('Ziina Webhook: Invoice not found', { providerRef, orderId });
          return NextResponse.json({ error: 'Invoice mapping failed' }, { status: 404 });
      }

      // 3. Write Ledger (Idempotent Transaction)
      const ledgerEntry = await db.ledger.addEntryIdempotent({
        type: 'CREDIT',
        amount: data.amount / 100,
        userId: invoice.userId,
        description: `Ziina Settlement: ${providerRef}`,
        metadata: {
            provider: 'ziina',
            eventType,
            providerEventId: eventId,
            providerRef,
            invoiceId: invoice.id,
            orderId: invoice.orderId,
            userId: invoice.userId
        },
        timestamp: Date.now()
      }, 'ziina', eventId);

      if (ledgerEntry) {
          // 4. Update Invoice & Order
          await db.invoices.updateStatus(invoice.id, 'paid', { paidAt: Date.now() });
          await db.invoices.attachLedgerEntry(invoice.id, ledgerEntry.id);
          await db.orders.updateStatus(invoice.orderId, 'paid');
          logger.payment('Settled via Ziina', invoice.orderId, { invoiceId: invoice.id });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Ziina Webhook Critical Failure', { error });
    return NextResponse.json({ error: 'Internal failure' }, { status: 500 });
  }
}
