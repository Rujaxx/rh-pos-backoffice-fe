'use client';

import React, { useState } from 'react';
import { Vendor, PaymentMethod } from '@/types/vendors.type';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { ReportQueryParams } from '@/types/report.type';

interface VendorPaymentSettlementModalProps {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Mock invoices - actual mein API se aayega
const mockInvoices = [
  {
    id: 'INV-001',
    invoiceDate: '19 Jun 2023',
    invoiceNo: 'PO-2024-001',
    amount: 10400,
    paidAmount: 0,
    remainingAmount: 10400,
  },
  {
    id: 'INV-002',
    invoiceDate: '15 Jun 2023',
    invoiceNo: 'PO-2024-002',
    amount: 8500,
    paidAmount: 5000,
    remainingAmount: 3500,
  },
];

export const VendorPaymentSettlementModal: React.FC<
  VendorPaymentSettlementModalProps
> = ({ vendor, isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();

  // Report filters state
  const [filters, setFilters] = useState<ReportQueryParams>({
    from: new Date('2024-06-12T12:00:00').toISOString(),
    to: new Date('2024-06-19T12:00:00').toISOString(),
    brandIds: [],
    restaurantIds: [],
  });

  // Payment state
  const [paymentMode, setPaymentMode] = useState<PaymentMethod>(
    PaymentMethod.CASH,
  );
  const [paymentAmount, setPaymentAmount] = useState<number>(10400);
  const [payInFull, setPayInFull] = useState(true);
  const [invoicePayments, setInvoicePayments] = useState<
    Record<string, number>
  >(
    mockInvoices.reduce(
      (acc, inv) => {
        acc[inv.id] = inv.remainingAmount;
        return acc;
      },
      {} as Record<string, number>,
    ),
  );

  if (!vendor) return null;

  // Calculations
  const totalOutstanding = mockInvoices.reduce(
    (sum, inv) => sum + inv.remainingAmount,
    0,
  );

  const totalPaymentAmount = Object.values(invoicePayments).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  const excessAmount = totalPaymentAmount - totalOutstanding;

  const handlePayInFull = () => {
    setPayInFull(true);
    const fullPayments: Record<string, number> = {};
    mockInvoices.forEach((inv) => {
      fullPayments[inv.id] = inv.remainingAmount;
    });
    setInvoicePayments(fullPayments);
    setPaymentAmount(totalOutstanding);
  };

  const handleInvoiceAmountChange = (invoiceId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const invoice = mockInvoices.find((inv) => inv.id === invoiceId);

    if (invoice) {
      const validAmount = Math.min(
        Math.max(numValue, 0),
        invoice.remainingAmount,
      );
      setInvoicePayments((prev) => ({
        ...prev,
        [invoiceId]: validAmount,
      }));
      setPayInFull(false);

      const newTotal = Object.values({
        ...invoicePayments,
        [invoiceId]: validAmount,
      }).reduce((sum, amt) => sum + amt, 0);
      setPaymentAmount(newTotal);
    }
  };

  const handlePaymentAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setPaymentAmount(numValue);
    setPayInFull(false);

    const totalRemaining = mockInvoices.reduce(
      (sum, inv) => sum + inv.remainingAmount,
      0,
    );
    if (totalRemaining > 0 && numValue > 0) {
      const ratio = Math.min(numValue / totalRemaining, 1);
      const newPayments: Record<string, number> = {};
      mockInvoices.forEach((inv) => {
        newPayments[inv.id] = Math.min(
          inv.remainingAmount,
          Math.round(inv.remainingAmount * ratio * 100) / 100,
        );
      });
      setInvoicePayments(newPayments);
    }
  };

  const handleFilterChange = (newFilters: ReportQueryParams) => {
    setFilters(newFilters);
    // API call to fetch invoices based on filters
    console.log('Fetch invoices with:', newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      from: undefined,
      to: undefined,
      brandIds: [],
      restaurantIds: [],
    });
  };

  const handleGenerateReport = () => {
    // Fetch invoices based on filters
    console.log('Generate report with filters:', filters);
  };

  const handleSubmitPayment = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t('vendors.payment.title') || 'Purchase Invoice Settlement'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Filters Component - Exactly like your existing filter */}
          <ReportFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onSubmit={handleGenerateReport}
            showDownloadButton={false}
          >
            {/* Supplier Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {t('vendors.payment.supplier') || 'Supplier'}
                </div>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted text-sm flex items-center">
                  {vendor.name}
                  <span className="text-xs text-muted-foreground ml-1">
                    [{t('vendors.payment.supplierTag') || 'Supplier'}]
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {t('vendors.payment.from') || 'From'}
                </div>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted text-sm flex items-center">
                  {t('vendors.payment.supplierType') || 'Supplier/Third Party'}
                </div>
              </div>
            </div>
          </ReportFilters>

          {/* Payment Summary Card */}
          <div className="border rounded-lg overflow-hidden mt-6">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>{t('vendors.payment.from') || 'From'}</TableHead>
                  <TableHead>
                    {t('vendors.payment.paymentDate') || 'Payment Date'}
                  </TableHead>
                  <TableHead>
                    {t('vendors.payment.paymentMode') || 'Payment Mode'}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('vendors.payment.total') || 'Total (₹)'}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('vendors.payment.paidAmount') || 'Paid Amount (₹)'}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('vendors.payment.remainingAmount') ||
                      'Remaining Amount (₹)'}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('vendors.payment.enterAmount') || 'Enter Amount (₹)'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    {vendor.name}
                    <span className="text-xs text-muted-foreground ml-1">
                      [{t('vendors.payment.supplierTag') || 'Supplier'}]
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date()
                      .toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                      .replace(/ /g, ' ')}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={paymentMode}
                      onValueChange={(v) => setPaymentMode(v as PaymentMethod)}
                    >
                      <SelectTrigger className="w-28 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PaymentMethod.CASH}>
                          {t('common.paymentMethod.cash') || 'Cash'}
                        </SelectItem>
                        <SelectItem value={PaymentMethod.CHEQUE}>
                          {t('common.paymentMethod.cheque') || 'Cheque'}
                        </SelectItem>
                        <SelectItem value={PaymentMethod.BANK_TRANSFER}>
                          {t('common.paymentMethod.bankTransfer') ||
                            'Bank Transfer'}
                        </SelectItem>
                        <SelectItem value={PaymentMethod.CARD}>
                          {t('common.paymentMethod.card') || 'Card'}
                        </SelectItem>
                        <SelectItem value={PaymentMethod.ONLINE}>
                          {t('common.paymentMethod.online') || 'Online'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    {totalOutstanding.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">0.00</TableCell>
                  <TableCell className="text-right">
                    {totalOutstanding.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) =>
                        handlePaymentAmountChange(e.target.value)
                      }
                      className="w-28 h-8 text-right ml-auto"
                      min={0}
                      max={totalOutstanding}
                      step={0.01}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Invoices Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>
                    {t('vendors.payment.invoiceDate') || 'Invoice Date'}
                  </TableHead>
                  <TableHead>
                    {t('vendors.payment.invoiceNo') || 'Invoice No.'}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('vendors.payment.amount') || 'Amount'}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('vendors.payment.paidAmount') || 'Paid Amount'}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('vendors.payment.remainingAmount') || 'Remaining Amount'}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('vendors.payment.amount') || 'Amount'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceDate}</TableCell>
                    <TableCell>{invoice.invoiceNo}</TableCell>
                    <TableCell className="text-right">
                      {invoice.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.paidAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.remainingAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={invoicePayments[invoice.id] || 0}
                        onChange={(e) =>
                          handleInvoiceAmountChange(invoice.id, e.target.value)
                        }
                        className="w-28 h-8 text-right ml-auto"
                        min={0}
                        max={invoice.remainingAmount}
                        step={0.01}
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {/* Pay in full row */}
                <TableRow className="bg-muted/20">
                  <TableCell colSpan={5} className="text-right font-medium">
                    <Button
                      variant="link"
                      onClick={handlePayInFull}
                      className={payInFull ? 'font-bold text-primary' : ''}
                    >
                      {t('vendors.payment.payInFull') || 'Pay in full'}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {totalOutstanding.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Payment Summary */}
          <div className="flex justify-end">
            <div className="w-96 space-y-3 border rounded-lg p-4 bg-muted/20">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('vendors.payment.total') || 'Total:'}
                </span>
                <span className="font-bold">{totalOutstanding.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('vendors.payment.amountPaid') || 'Amount Paid:'}
                </span>
                <span className="font-medium">
                  {totalPaymentAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('vendors.payment.amountUsed') ||
                    'Amount used for Payments:'}
                </span>
                <span className="font-medium">
                  {totalPaymentAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('vendors.payment.amountInExcess') || 'Amount in Excess:'}
                </span>
                <span
                  className={
                    excessAmount > 0
                      ? 'text-orange-600 font-medium'
                      : 'text-muted-foreground'
                  }
                >
                  {Math.max(excessAmount, 0).toFixed(2)}
                </span>
              </div>
              <div className="pt-4">
                <Button
                  onClick={handleSubmitPayment}
                  className="w-full h-10 bg-green-600 hover:bg-green-700"
                  disabled={totalPaymentAmount <= 0}
                >
                  {t('vendors.payment.payAmount') || 'Pay Amount'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
