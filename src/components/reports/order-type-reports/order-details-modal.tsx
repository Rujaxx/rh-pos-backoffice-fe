'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrderTypeReportItem } from '@/types/report.type';

interface OrderTypeDetailsModalProps {
  item: OrderTypeReportItem | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

const getSafeNumber = (value: number | undefined): number => value ?? 0;

export function OrderTypeDetailsModal({
  item,
  isOpen,
  onClose,
}: OrderTypeDetailsModalProps) {
  if (!item) return null;

  const totalOrders = item.itemCount;

  const orderTypeText =
    typeof item.orderType === 'string' ? item.orderType : item.orderType.en;

  const statusMetrics = [
    { label: 'Placed', value: getSafeNumber(item.placed) },
    { label: 'Pending', value: getSafeNumber(item.pending) },
    { label: 'Confirmed', value: getSafeNumber(item.confirmed) },
    { label: 'Food Ready', value: getSafeNumber(item.foodReady) },
    { label: 'Dispatched', value: getSafeNumber(item.dispatched) },
    { label: 'Fulfilled', value: getSafeNumber(item.fulfilled) },
    { label: 'Running', value: getSafeNumber(item.running) },
    { label: 'Cancelled', value: getSafeNumber(item.cancelled) },
    { label: 'Free', value: getSafeNumber(item.free) },
    { label: 'Deleted', value: getSafeNumber(item.deleted) },
    { label: 'Pending Delivery', value: getSafeNumber(item.pendingDelivery) },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {orderTypeText} - Status Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Summary Row */}
          <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">
                Total Orders
              </div>
              <div className="text-lg font-bold text-foreground">
                {formatNumber(totalOrders)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">
                Total Amount
              </div>
              <div className="text-lg font-bold text-green-600 dark:text-green-500">
                {formatCurrency(item.amount)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">
                Avg Order Value
              </div>
              <div className="text-lg font-bold text-foreground">
                {formatCurrency(
                  totalOrders > 0 ? item.amount / totalOrders : 0,
                )}
              </div>
            </div>
          </div>

          {/* Status Grid - Clean and Simple */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {statusMetrics.map((status) => (
              <div
                key={status.label}
                className="p-3 border rounded-lg bg-card hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {status.label}
                </div>
                <div className="text-base font-bold text-foreground">
                  {formatNumber(status.value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
