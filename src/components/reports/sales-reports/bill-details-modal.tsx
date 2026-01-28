'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Bill,
  PaymentMethods,
  Payment,
  PaymentMethodsEnum,
  PaymentStatus,
} from '@/types/bill.type';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Receipt,
  User,
  Phone,
  Calendar,
  CreditCard,
  Package,
  ShoppingCart,
  Plus,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface BillDetailsModalProps {
  bill: Bill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateBill: (billId: string, data: Partial<Bill>) => Promise<void>;
}

export function BillDetailsModal({
  bill,
  open,
  onOpenChange,
  onUpdateBill,
}: BillDetailsModalProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  const [isEditing, setIsEditing] = useState(false);
  const [editedPayments, setEditedPayments] = useState<Payment[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize edited payments when bill changes
  React.useEffect(() => {
    if (bill) {
      setEditedPayments(bill.payments || []);
    }
  }, [bill]);

  if (!bill) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleString(locale);
  };

  const paymentModeOptions = Object.values(PaymentMethods).map((mode) => ({
    label: t(`paymentMethods.${mode.label}`),
    value: mode.value,
  }));

  const getPaymentMethodLabel = (method: PaymentMethodsEnum) => {
    const labels: Record<PaymentMethodsEnum, string> = {
      [PaymentMethodsEnum.CASH]: t('paymentMethods.CASH'),
      [PaymentMethodsEnum.CARD]: t('paymentMethods.CARD'),
      [PaymentMethodsEnum.UPI]: t('paymentMethods.UPI'),
      [PaymentMethodsEnum.PAYTM]: t('paymentMethods.PAYTM'),
      [PaymentMethodsEnum.GOOGLE_PAY]: t('paymentMethods.GOOGLE_PAY'),
      [PaymentMethodsEnum.FREE_CHARGE]: t('paymentMethods.FREE_CHARGE'),
    };
    return labels[method] || method;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-500';
      case 'Completed':
        return 'bg-green-500';
      case 'Cancelled':
        return 'bg-red-500';
      case 'Paid':
        return 'bg-green-500';
      case 'Unpaid':
        return 'bg-red-500';
      case 'PartiallyPaid':
        return 'bg-yellow-500';
      case 'Refunded':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAddPayment = () => {
    const newPayment: Payment = {
      method: PaymentMethodsEnum.CASH,
      amount: 0,
      paymentDate: new Date().toISOString(),
    };
    setEditedPayments([...editedPayments, newPayment]);
  };

  const handleRemovePayment = (index: number) => {
    setEditedPayments(editedPayments.filter((_, i) => i !== index));
  };

  const handlePaymentChange = (
    index: number,
    field: keyof Payment,
    value: string | number | PaymentMethodsEnum,
  ) => {
    const updated = [...editedPayments];
    updated[index] = { ...updated[index], [field]: value };
    setEditedPayments(updated);
  };

  const calculateTotalPaid = () => {
    return editedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const handleSavePayments = async () => {
    setIsSaving(true);
    try {
      const totalPaid = calculateTotalPaid();
      let paymentStatus = bill.paymentStatus;

      // Auto-calculate payment status
      if (totalPaid === 0) {
        paymentStatus = PaymentStatus.UNPAID;
      } else if (totalPaid >= bill.totalAmount) {
        paymentStatus = PaymentStatus.PAID;
      } else {
        paymentStatus = PaymentStatus.PARTIALLY_PAID;
      }

      await onUpdateBill(bill._id, {
        payments: editedPayments,
        amountPaid: totalPaid,
        paymentStatus,
      });

      toast.success('Payments updated successfully');
      setIsEditing(false);
      onOpenChange(false); // Close the modal
    } catch {
      toast.error('Failed to update payments');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedPayments(bill.payments || []);
    setIsEditing(false);
  };
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'PAID':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'UNPAID':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'PARTIALLY_PAID':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-2xl">
              <Receipt className="h-6 w-6" />
              {t('reports.billDetails.title') || 'Bill Details'} -{' '}
              {bill.billNumber}
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {t('reports.billDetails.editPayments') || 'Edit Payments'}
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {/* Order Status */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">
                {t('bill.status') || 'Order Status'}
              </span>
              <span className="text-muted-foreground">|</span>
              <Badge
                variant="outline"
                className={getStatusClasses(bill.status)}
                title="Order status"
              >
                {t(`bill.status.${bill.status}`)}
              </Badge>
            </div>

            {/* Payment Status */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">
                {t('bill.paymentStatus') || 'Payment Status'}
              </span>
              <span className="text-muted-foreground">|</span>
              <Badge
                variant="outline"
                className={getStatusClasses(bill.paymentStatus)}
                title="Payment status"
              >
                {bill.paymentStatus}
              </Badge>
            </div>
          </div>

          {/* Customer & Waiter Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('reports.billDetails.customerInfo') ||
                    'Customer Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('reports.table.customerName') || 'Name'}:
                  </span>
                  <span className="font-medium">
                    {bill.customerName || '-'}
                  </span>
                </div>
                {bill.customerPhone && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Phone:
                    </span>
                    <span className="font-medium">{bill.customerPhone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('reports.billDetails.waiterInfo') || 'Waiter Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('reports.table.waiter') || 'Waiter'}:
                  </span>
                  <span className="font-medium">{bill.waiterName || '-'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Bill Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                {t('reports.billDetails.items') || 'Items'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {t('reports.billDetails.itemName') || 'Item'}
                    </TableHead>
                    <TableHead className="text-right">
                      {t('reports.billDetails.quantity') || 'Qty'}
                    </TableHead>
                    <TableHead className="text-right">
                      {t('reports.billDetails.price') || 'Price'}
                    </TableHead>
                    <TableHead className="text-right">
                      {t('reports.billDetails.tax') || 'Tax'}
                    </TableHead>
                    <TableHead className="text-right">
                      {t('reports.billDetails.total') || 'Total'}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bill.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {item.name[locale] || item.name.en || '-'}
                          </div>
                          {item.notes && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.taxAmount || 0)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(
                          (item.price || 0) * item.quantity +
                            (item.taxAmount || 0),
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Separator />

          {/* Bill Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                {t('reports.billDetails.summary') || 'Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('reports.billDetails.subtotal') || 'Subtotal'}:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(bill.subTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('reports.billDetails.discount') || 'Discount'}:
                  </span>
                  <span className="font-medium text-red-500">
                    -{formatCurrency(bill.discountAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('reports.billDetails.taxAmount') || 'Tax'}:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(bill.taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('reports.billDetails.packaging') || 'Packaging'}:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(bill.packagingCharges)}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>
                  {t('reports.billDetails.totalAmount') || 'Total Amount'}:
                </span>
                <span>{formatCurrency(bill.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('reports.billDetails.amountPaid') || 'Amount Paid'}:
                </span>
                <span className="font-medium text-green-600">
                  {formatCurrency(
                    isEditing ? calculateTotalPaid() : bill.amountPaid,
                  )}
                </span>
              </div>
              {(isEditing
                ? bill.totalAmount - calculateTotalPaid()
                : bill.totalAmount - bill.amountPaid) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('reports.billDetails.balance') || 'Balance'}:
                  </span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(
                      isEditing
                        ? bill.totalAmount - calculateTotalPaid()
                        : bill.totalAmount - bill.amountPaid,
                    )}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payments Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {t('reports.billDetails.payments') || 'Payments'}
                </div>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddPayment}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {t('reports.billDetails.addPayment') || 'Add Payment'}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isEditing ? (
                // Edit Mode
                <div className="space-y-3">
                  {editedPayments.map((payment, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="space-y-2">
                            <Label>
                              {t('reports.billDetails.paymentMethod') ||
                                'Payment Method'}
                            </Label>
                            <Select
                              value={payment.method}
                              onValueChange={(value) =>
                                handlePaymentChange(
                                  index,
                                  'method',
                                  value as PaymentMethodsEnum,
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {paymentModeOptions.map((method) => (
                                  <SelectItem
                                    key={method.value}
                                    value={method.value}
                                  >
                                    {method.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>
                              {t('reports.billDetails.amount') || 'Amount'}
                            </Label>
                            <Input
                              type="number"
                              value={payment.amount}
                              onChange={(e) =>
                                handlePaymentChange(
                                  index,
                                  'amount',
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              min={0}
                              step={0.01}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>
                              {t('reports.billDetails.transactionId') ||
                                'Transaction ID'}
                            </Label>
                            <Input
                              value={payment.transactionId || ''}
                              onChange={(e) =>
                                handlePaymentChange(
                                  index,
                                  'transactionId',
                                  e.target.value,
                                )
                              }
                              placeholder="Enter transaction ID"
                            />
                          </div>

                          <div className="flex items-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemovePayment(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {editedPayments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {t('reports.billDetails.noPayments') ||
                        'No payments added. Click "Add Payment" to add one.'}
                    </div>
                  )}
                </div>
              ) : (
                // View Mode
                <div className="space-y-2">
                  {bill.payments && bill.payments.length > 0 ? (
                    bill.payments.map((payment, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-lg bg-muted/50"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">
                            {getPaymentMethodLabel(payment.method)}
                          </p>
                          {payment.transactionId && (
                            <p className="text-xs text-muted-foreground">
                              ID: {payment.transactionId}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(payment.paymentDate)}
                          </p>
                        </div>
                        <span className="font-bold text-lg">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {t('reports.billDetails.noPayments') ||
                        'No payments recorded'}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {t('reports.billDetails.createdAt') || 'Created'}:{' '}
                {formatDate(bill.createdAt)}
              </span>
            </div>
            {bill.closedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {t('reports.billDetails.closedAt') || 'Closed'}:{' '}
                  {formatDate(bill.closedAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-2" />
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button onClick={handleSavePayments} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
