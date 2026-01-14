import { db } from './db';
import { logger } from '@/lib/logger';
import { sims } from './smart-inventory';
import type { Product, UserIntent, Order } from '@/types';

/**
 * CART & CONVERSION DASHBOARD ENGINE
 * Now with Display Performance Rating
 */
export const cartAnalytics = {
  async getFunnelReport() {
    const products = await db.products.getAll();
    const intents = await db.users.getAllIntents();
    const orders = await db.orders.getAllOrders();
    const inventoryInsights = await sims.manage.getInventoryInsights();

    const stats: Record<string, any> = {};
    products.forEach(p => {
      const isBestSeller = inventoryInsights.bestSellers.some(bs => bs.id === p.id);
      stats[p.id] = { 
        name: p.name, 
        picks: 0, 
        dismissals: 0, 
        cashes: 0, 
        views: 0,
        isBestSeller,
        displayRating: 0 // 0 to 5 scale
      };
    });

    intents.forEach(intent => {
      if (!stats[intent.productId]) return;
      if (intent.type === 'LIKE') stats[intent.productId].picks++;
      if (intent.type === 'DISLIKE') stats[intent.productId].dismissals++;
      if (intent.type === 'DETAIL_VIEW') stats[intent.productId].views++;
    });

    orders.forEach(order => {
      order.items.forEach(item => {
        if (stats[item.product.id]) stats[item.product.id].cashes += item.quantity;
      });
    });

    return {
      funnel: Object.values(stats).map(s => {
        const totalInteractions = s.picks + s.dismissals;
        const conversionRate = totalInteractions > 0 ? (s.cashes / totalInteractions) * 100 : 0;
        
        // DISPLAY RATING CALCULATION (1-5 Scale)
        // Logic: Pick rate (Likes / Total Swipes) + Detail View Bonus
        const pickRate = totalInteractions > 0 ? s.picks / totalInteractions : 0;
        const viewInterest = s.picks > 0 ? s.views / s.picks : 0; // Details opened per like
        
        // Base rating on pick rate (0.2 = 1 star, 0.4 = 2 star, 0.6 = 3 star, 0.8 = 4 star, 1.0 = 5 star)
        let rating = pickRate * 5;
        // Boost slightly if people check details often
        rating += Math.min(viewInterest * 0.5, 0.5);
        
        return {
          ...s,
          conversionRate,
          displayRating: Math.max(1, Math.min(5, Math.round(rating * 10) / 10)) // Rounded to 1 decimal
        };
      }).sort((a, b) => b.displayRating - a.displayRating),
      inventorySync: {
        lowConvertingBestSellers: Object.values(stats).filter(s => s.isBestSeller && s.conversionRate < 5)
      }
    };
  }
};
