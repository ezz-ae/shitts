import { db } from './db';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors';

/**
 * COMPREHENSIVE CREDIT MANAGER
 * Handles all logic for the Style Credit economy.
 */
export const creditManager = {
  /**
   * Directly gives credit to a user (e.g., Marketing Bonus)
   */
  async grantCredit(userId: string, amount: number, reason: string) {
    logger.info('Credit: Granting reward', { userId, amount, reason });
    return await db.ledger.addEntry({
      type: 'CREDIT',
      amount,
      userId,
      description: `Admin Grant: ${reason}`,
      metadata: { source: 'admin_manual' },
      timestamp: Date.now()
    });
  },

  /**
   * Removes credit from a user (e.g., Correction)
   */
  async revokeCredit(userId: string, amount: number, reason: string) {
    const profile = await db.users.getProfile(userId);
    if (!profile || profile.credit < amount) {
      throw new AppError('Insufficient credit balance to revoke');
    }
    return await db.ledger.addEntry({
      type: 'DEBIT',
      amount,
      userId,
      description: `Revocation: ${reason}`,
      metadata: { source: 'admin_manual' },
      timestamp: Date.now()
    });
  },

  /**
   * Handles payment using credit. Supports partial payments.
   */
  async applyCreditToOrder(userId: string, orderId: string, orderTotal: number) {
    const profile = await db.users.getProfile(userId);
    if (!profile || profile.credit <= 0) return { applied: 0, remaining: orderTotal };

    const amountToApply = Math.min(profile.credit, orderTotal);
    
    await db.ledger.addEntry({
      type: 'DEBIT',
      amount: amountToApply,
      userId,
      description: `Payment for Order ${orderId}`,
      metadata: { orderId },
      timestamp: Date.now()
    });

    return {
      applied: amountToApply,
      remaining: orderTotal - amountToApply,
      isFullyPaid: (orderTotal - amountToApply) <= 0
    };
  }
};
