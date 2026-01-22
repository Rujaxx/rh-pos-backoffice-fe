'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Printer, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
import { OrderListItem, OrderStatus, PaymentStatus } from '@/types/order';

interface OrderDetailsModalProps {
  order: OrderListItem;
  isOpen: boolean;
  onClose: () => void;
  onAction: (orderId: string, action: string, data?: unknown) => void;
  isProcessing?: boolean;
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onAction,
  isProcessing = false,
}: OrderDetailsModalProps) {
  const { t } = useTranslation();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Badge variant="default">{t('orders.pending')}</Badge>;
      case OrderStatus.CONFIRMED:
        return <Badge variant="default">{t('orders.confirmed')}</Badge>;
      case OrderStatus.FOOD_READY:
        return <Badge variant="secondary">{t('orders.foodReady')}</Badge>;
      case OrderStatus.FULFILLED:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {t('orders.fulfilled')}
          </Badge>
        );
      case OrderStatus.CANCELLED:
        return <Badge variant="destructive">{t('orders.cancelled')}</Badge>;
      default:
        return <Badge variant="default">{order.status}</Badge>;
    }
  };

  const getPaymentStatusText = () => {
    switch (order.paymentStatus) {
      case PaymentStatus.UNPAID:
        return t('payment.unpaid');
      case PaymentStatus.PENDING:
        return t('payment.pending');
      case PaymentStatus.PAID:
        return t('payment.paid');
      case PaymentStatus.FAILED:
        return t('payment.failed');
      default:
        return order.paymentStatus;
    }
  };

  const totalTax = order.items.reduce((sum, item) => sum + item.taxAmount, 0);
  const totalDiscount = order.items.reduce(
    (sum, item) => sum + item.discountAmount,
    0,
  );
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.orderNumber}</span>
            <span className="text-sm text-muted-foreground font-normal">
              {format(new Date(order.createdAt), 'PPP p')}
            </span>
          </DialogTitle>
          <DialogDescription>
            Order Type: {order.orderTypeDoc?.name.en || 'N/A'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* From Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('orders.from')}
            </h3>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {order.restaurantDoc?.name.en?.charAt(0) || 'R'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">
                  {order.restaurantDoc?.name.en || 'N/A'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {order.restaurantDoc?.restoCode || ''}
                </p>
              </div>
            </div>
          </div>

          {/* To Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('orders.to')}
            </h3>
            <div>
              <h4 className="font-medium">{order.customerName || 'N/A'}</h4>
              <p className="text-sm text-muted-foreground">
                {order.customerPhone || ''}
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('orders.details')}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t('orders.billNo')}</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('orders.status')}</span>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('orders.orderType')}</span>
                <span className="font-medium capitalize">
                  {order.orderTypeDoc?.name.en || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Items Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('orders.items')}</h3>
          <div className="border rounded-md">
            <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
              <div className="col-span-2">Item Name</div>
              <div>Quantity</div>
              <div>Price</div>
              <div>Discount</div>
              <div>Tax</div>
            </div>
            {order.items.map((item, index) => (
              <div
                key={`${item.menuItemId}-${index}`}
                className="grid grid-cols-6 gap-4 p-4 border-b"
              >
                <div className="col-span-2">
                  {item.name?.en || item.name?.ar}
                </div>
                <div>{item.quantity}</div>
                <div>${item.price.toFixed(2)}</div>
                <div>${item.discountAmount.toFixed(2)}</div>
                <div>${item.taxAmount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">
            {t('orders.paymentSummary')}
          </h3>
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                {t('orders.subtotal')}
              </span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                {t('orders.discount')}
              </span>
              <span className="font-medium text-red-600">
                -${totalDiscount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('orders.tax')}</span>
              <span className="font-medium">${totalTax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg font-bold pt-2">
              <span>{t('orders.totalAmount')}</span>
              <span className="text-primary">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{t('orders.paymentMethod')}</span>
              <span className="capitalize">
                {order.payments?.[0]?.method || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{t('orders.paymentStatus')}</span>
              <span
                className={`capitalize ${
                  order.paymentStatus === 'PAID'
                    ? 'text-green-600'
                    : order.paymentStatus === 'FAILED'
                      ? 'text-red-600'
                      : 'text-amber-600'
                }`}
              >
                {getPaymentStatusText()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onAction(order._id, 'print_kot')}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Printer className="h-4 w-4 mr-2" />
              )}
              {t('orders.printKOT')}
            </Button>
            <Button
              variant="default"
              onClick={() => onAction(order._id, 'print_bill')}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Printer className="h-4 w-4 mr-2" />
              )}
              {t('orders.printBill')}
            </Button>
          </div>
          <Button variant="ghost" onClick={onClose} disabled={isProcessing}>
            {t('common.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
