import { db } from './db';
import { logger } from '@/lib/logger';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { financialAnalytics } from './financial-analytics';
import type { Product, Order } from '@/types';

/**
 * SMART INVENTORY MANAGEMENT SYSTEM (SIMS) v3
 * Cross-System Integration
 */

export const sims = {
  create: {
    async analyzeAndDescribe(imageUrl: string) {
      const { output } = await ai.definePrompt({
          name: 'productDescriberV2',
          input: { schema: z.object({ imageUrl: z.string() }) },
          output: { schema: z.any() },
          prompt: `Analyze {{imageUrl}} and generate fashion metadata.`
      })({ imageUrl });
      return output;
    }
  },

  manage: {
    /**
     * FEEDBACK LOOP: Adjusts inventory ranking based on Financial health.
     */
    async getInventoryInsights() {
      const products = await db.products.getAll();
      const orders = await db.orders.getAllOrders();
      const finance = await financialAnalytics.getFinancialStatus();
      
      const productSales: Record<string, number> = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          productSales[item.product.id] = (productSales[item.product.id] || 0) + item.quantity;
        });
      });

      // CROSS-FEED LOGIC: If 'Lost Opportunity' is high, SIMS flags a "Price Resistance" alert.
      const priceResistanceThreshold = finance.overview.totalLostOpportunity > finance.overview.totalRevenue * 3;

      return {
        overview: {
          totalProducts: products.length,
          priceResistanceAlert: priceResistanceThreshold,
          returnsImpact: finance.overview.totalReturnsValue
        },
        bestSellers: products
          .map(p => ({ ...p, unitsSold: productSales[p.id] || 0 }))
          .sort((a, b) => b.unitsSold - a.unitsSold)
          .slice(0, 5)
      };
    },

    async askBrain(question: string) {
      const insights = await this.getInventoryInsights();
      const finance = await financialAnalytics.getFinancialStatus();
      
      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: `System: You are the SHITTS Brain. 
        INVENTORY DATA: ${JSON.stringify(insights)}
        FINANCIAL DATA: ${JSON.stringify(finance.overview)}
        Goal: Synthesize both to answer the user. If revenue is low and pending is high, suggest credit incentives.
        User Question: ${question}`,
      });
      return response.text;
    }
  }
};
