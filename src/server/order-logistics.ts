import { db } from './db';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors';
import type { Order } from '@/types';

/**
 * FULL ORDERING & LOGISTICS SYSTEM
 * Manages the lifecycle from Shipping to Delivery and Returns.
 */
export const orderLogistics = {
  /**
   * Advances an order to the shipping stage.
   */
  async shipOrder(orderId: string, trackingNumber: string) {
    logger.info('Logistics: Shipping Order', { orderId, trackingNumber });
    return await db.orders.updateStatus(orderId, 'shipped');
  },

  /**
   * Finalizes an order as delivered.
   */
  async confirmDelivery(orderId: string) {
    return await db.orders.updateStatus(orderId, 'delivered');
  },

  /**
   * Records a customer-reported issue for an order.
   */
  async reportOrderIssue(orderId: string, userId: string, message: string) {
    const order = await db.orders.getOrderById(orderId); // We'll add this to db.ts
    if (!order || order.userId !== userId) throw new AppError('Unauthorized or invalid order');

    const logEntry = { timestamp: Date.now(), message };
    const currentLog = order.issueLog || [];
    
    await db.orders.updateOrder(orderId, {
        issueLog: [...currentLog, logEntry]
    });

    logger.warn('Logistics: Issue Reported', { orderId, message });
    return logEntry;
  },

  /**
   * Initiates a return process.
   */
  async processReturn(orderId: string, reason: string) {
    logger.info('Logistics: Initiating Return', { orderId, reason });
    return await db.orders.updateStatus(orderId, 'returned');
  }
};
