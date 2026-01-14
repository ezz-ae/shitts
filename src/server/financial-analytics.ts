import { db } from './db';
import { logger } from '@/lib/logger';
import type { Product, UserIntent, Order } from '@/types';

/**
 * FINANCIAL ANALYTICS ENGINE
 * Deep analysis of Revenue, Pending Carts, and Lost Opportunities.
 */
export const financialAnalytics = {
  /**
   * Generates a comprehensive financial health report.
   */
  async getFinancialStatus() {
    const products = await db.products.getAll();
    const orders = await db.orders.getAllOrders();
    const intents = await db.users.getAllIntents();
    const users = await db.users.getAllUsers();

    // 1. REVENUE (CASHED)
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    // 2. PENDING REVENUE (CARTS)
    let totalPendingRevenue = 0;
    const orderProductIds = new Set(orders.flatMap(o => o.items.map(i => i.product.id)));
    
    intents.forEach(intent => {
      if (intent.type === 'LIKE' && !orderProductIds.has(intent.productId)) {
        const product = products.find(p => p.id === intent.productId);
        if (product) totalPendingRevenue += product.price;
      }
    });

    // 3. LOST OPPORTUNITY (DISMISSALS)
    let totalLostOpportunity = 0;
    intents.forEach(intent => {
      if (intent.type === 'DISLIKE') {
        const product = products.find(p => p.id === intent.productId);
        if (product) totalLostOpportunity += product.price;
      }
    });

    // 4. CREDIT LIABILITY
    const totalCreditLiability = users.reduce((sum, user) => sum + (user.credit || 0), 0);

    // 5. RETURNS IMPACT (Feeding from Logistics)
    const totalReturnsValue = orders
      .filter(o => o.status === 'returned')
      .reduce((sum, o) => sum + o.total, 0);

    return {
      overview: {
        totalRevenue,
        netRevenue: totalRevenue - (totalRevenue * 0.05) - totalReturnsValue,
        totalPendingRevenue,
        totalLostOpportunity,
        totalCreditLiability,
        totalReturnsValue
      },
      logs: {
        recentDismissals: intents
          .filter(i => i.type === 'DISLIKE')
          .slice(-10)
          .map(i => {
             const p = products.find(prod => prod.id === i.productId);
             return { product: p?.name, amount: p?.price, time: new Date(i.timestamp).toLocaleString() };
          })
      }
    };
  }
};
