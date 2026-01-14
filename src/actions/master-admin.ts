'use server';

import { sims } from '@/server/smart-inventory';
import { cartAnalytics } from '@/server/cart-analytics';
import { financialAnalytics } from '@/server/financial-analytics';
import { orderLogistics } from '@/server/order-logistics';
import { creditManager } from '@/server/credit-manager';
import { db } from '@/server/db';
import { assertAdmin } from '@/server/guards';
import { handleActionError, standardizeResponse } from '@/lib/errors';
import type { Order } from '@/types';

/**
 * MASTER ADMIN COMMAND CENTER
 * The single source of truth for the Back-Office UI.
 */

export async function getMasterAdminData() {
  try {
    await assertAdmin();

    const [inventory, conversion, financial, orders, users] = await Promise.all([
      sims.manage.getInventoryInsights(),
      cartAnalytics.getFunnelReport(),
      financialAnalytics.getFinancialStatus(),
      db.orders.getAllOrders(),
      db.users.getAllUsers()
    ]);

    // URGENCY NOTIFICATION ENGINE
    const notifications = [];
    
    // 1. Inventory Urgency
    if (inventory.bestSellers.some(p => p.unitsSold > 50)) { // Simulated threshold
      notifications.push({ id: 'inv-1', type: 'URGENT', title: 'Best Seller Stock Low', message: 'Denim Jacket is moving fast. Reorder required.' });
    }

    // 2. Logistics Urgency
    const pendingOrders = orders.filter(o => o.status === 'processing');
    if (pendingOrders.length > 5) {
      notifications.push({ id: 'log-1', type: 'WARNING', title: 'Shipping Backlog', message: `${pendingOrders.length} orders awaiting shipment.` });
    }

    // 3. Financial Urgency
    if (financial.overview.totalCreditLiability > 1000) {
      notifications.push({ id: 'fin-1', type: 'CRITICAL', title: 'Credit Liability High', message: 'Total store debt exceeds $1000 threshold.' });
    }

    // 4. Returns
    const returns = orders.filter(o => o.status === 'returned');
    if (returns.length > 0) {
      notifications.push({ id: 'ret-1', type: 'URGENT', title: 'Pending Returns', message: `${returns.length} returns need processing.` });
    }

    return standardizeResponse({
      inventory,
      conversion,
      financial,
      orders,
      users,
      notifications,
      summary: {
        revenue: financial.overview.totalRevenue,
        activeUsers: users.length,
        pendingOrders: pendingOrders.length,
        conversionRate: conversion.funnel.length > 0 ? 12.5 : 0 // Simulated aggregate
      }
    });
  } catch (error) {
    return handleActionError(error);
  }
}

// LOGISTICS COMMANDS
export async function updateOrderLogistics(orderId: string, action: 'ship' | 'deliver' | 'return', metadata?: any) {
    try {
        await assertAdmin();
        if (action === 'ship') await orderLogistics.shipOrder(orderId, metadata?.tracking || `TRK-${Date.now()}`);
        if (action === 'deliver') await orderLogistics.confirmDelivery(orderId);
        if (action === 'return') await orderLogistics.processReturn(orderId, metadata?.reason || 'Customer request');
        return standardizeResponse({ success: true });
    } catch (e) { return handleActionError(e); }
}

// CREDIT COMMANDS
export async function manageUserCredit(userId: string, type: 'grant' | 'revoke', amount: number, reason: string) {
    try {
        await assertAdmin();
        if (type === 'grant') await creditManager.grantCredit(userId, amount, reason);
        if (type === 'revoke') await creditManager.revokeCredit(userId, amount, reason);
        return standardizeResponse({ success: true });
    } catch (e) { return handleActionError(e); }
}

// AI BRAIN COMMAND
export async function askInventoryBrain(question: string) {
    try {
        await assertAdmin();
        const answer = await sims.manage.askBrain(question);
        return standardizeResponse({ answer });
    } catch (e) { return handleActionError(e); }
}
