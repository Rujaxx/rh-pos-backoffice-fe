'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreditCard, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Vendor } from '@/types/payment-settlement.type';
import { Invoice } from '@/types/payment-settlement.type';
import { PaymentFilters } from '@/components/inventory/payment-settlement/payment-filters';
import { InvoicesTable } from '@/components/inventory/payment-settlement/invoice-table';

// Mock data
const mockVendors: Vendor[] = [
  { _id: '1', name: 'ABC Vegetables PVT. LTD.' },
  { _id: '2', name: 'XYZ Supplies' },
];

const mockRestaurants = [
  { _id: '1', name: 'Main Restaurant' },
  { _id: '2', name: 'Downtown Branch' },
];

const mockKitchens = [
  { _id: '1', name: 'Main Kitchen' },
  { _id: '2', name: 'Prep Kitchen' },
];

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    vendorId: '1',
    vendorName: 'ABC Vegetables PVT. LTD.',
    invoiceDate: '19 Jun 2023',
    invoiceNo: 'PO-2024-001',
    amount: 10400,
    paidAmount: 0,
    remainingAmount: 10400,
  },
  {
    id: 'INV-002',
    vendorId: '1',
    vendorName: 'ABC Vegetables PVT. LTD.',
    invoiceDate: '15 Jun 2023',
    invoiceNo: 'PO-2024-002',
    amount: 8500,
    paidAmount: 5000,
    remainingAmount: 3500,
  },
  {
    id: 'INV-003',
    vendorId: '2',
    vendorName: 'XYZ Supplies',
    invoiceDate: '18 Jun 2023',
    invoiceNo: 'PO-2024-003',
    amount: 15000,
    paidAmount: 0,
    remainingAmount: 15000,
  },
];

type FromType = 'vendor' | 'restaurant' | 'kitchen';

interface FilterState {
  fromType: FromType;
  selectedVendorId?: string;
  selectedRestaurantId?: string;
  selectedKitchenId?: string;
  startDate: string;
  endDate: string;
}

export default function PaymentSettlementContent() {
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const preselectedVendorId = searchParams.get('vendorId');

  const [filters, setFilters] = useState<FilterState>({
    fromType: 'vendor',
    selectedVendorId: preselectedVendorId || undefined,
    startDate: '12 Jun 2023',
    endDate: '19 Jun 2023',
  });

  const [searched, setSearched] = useState(!!preselectedVendorId);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [payInFull, setPayInFull] = useState(true);
  const [invoicePayments, setInvoicePayments] = useState<
    Record<string, number>
  >({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (preselectedVendorId) {
      const vendor = mockVendors.find((v) => v._id === preselectedVendorId);
      if (vendor) {
        setSelectedVendor(vendor);
        setFilters((prev) => ({
          ...prev,
          fromType: 'vendor',
          selectedVendorId: preselectedVendorId,
        }));
        setSearched(true);

        const vendorInvoices = mockInvoices.filter(
          (inv) => inv.vendorId === preselectedVendorId,
        );
        const initialPayments: Record<string, number> = {};
        vendorInvoices.forEach((inv) => {
          initialPayments[inv.id] = inv.remainingAmount;
        });
        setInvoicePayments(initialPayments);
        setPaymentAmount(
          vendorInvoices.reduce((sum, inv) => sum + inv.remainingAmount, 0),
        );
      }
    }
  }, [preselectedVendorId]);

  const handleSearch = () => {
    if (filters.fromType === 'vendor' && filters.selectedVendorId) {
      const vendor = mockVendors.find(
        (v) => v._id === filters.selectedVendorId,
      );
      if (vendor) {
        setSelectedVendor(vendor);
        setSearched(true);

        const vendorInvoices = mockInvoices.filter(
          (inv) => inv.vendorId === vendor._id,
        );
        const initialPayments: Record<string, number> = {};
        vendorInvoices.forEach((inv) => {
          initialPayments[inv.id] = inv.remainingAmount;
        });
        setInvoicePayments(initialPayments);
        setPaymentAmount(
          vendorInvoices.reduce((sum, inv) => sum + inv.remainingAmount, 0),
        );

        toast.success(
          t('paymentSettlement.messages.showingInvoices', {
            name: vendor.name,
          }),
        );
      } else {
        toast.error(t('paymentSettlement.messages.selectVendor'));
      }
    } else {
      toast.info(
        t('paymentSettlement.messages.searchingBy', { type: filters.fromType }),
      );
    }
  };

  const handleFromTypeChange = (type: FromType) => {
    setFilters((prev) => ({
      ...prev,
      fromType: type,
      selectedVendorId: undefined,
      selectedRestaurantId: undefined,
      selectedKitchenId: undefined,
    }));
    setSelectedVendor(null);
    setSearched(false);
    setInvoicePayments({});
    setPaymentAmount(0);
  };

  const handlePayInFull = () => {
    setPayInFull(true);
    const fullPayments: Record<string, number> = {};
    relevantInvoices.forEach((inv) => {
      fullPayments[inv.id] = inv.remainingAmount;
    });
    setInvoicePayments(fullPayments);
    setPaymentAmount(totalOutstanding);
  };

  const handleInvoiceAmountChange = (invoiceId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const invoice = relevantInvoices.find((inv) => inv.id === invoiceId);

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

    const totalRemaining = relevantInvoices.reduce(
      (sum, inv) => sum + inv.remainingAmount,
      0,
    );
    if (totalRemaining > 0 && numValue > 0) {
      const ratio = Math.min(numValue / totalRemaining, 1);
      const newPayments: Record<string, number> = {};
      relevantInvoices.forEach((inv) => {
        newPayments[inv.id] = Math.min(
          inv.remainingAmount,
          Math.round(inv.remainingAmount * ratio * 100) / 100,
        );
      });
      setInvoicePayments(newPayments);
    }
  };

  const handleSubmitPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      toast.success(t('paymentSettlement.messages.paymentSuccess'));

      setSelectedVendor(null);
      setSearched(false);
      setInvoicePayments({});
      setPaymentAmount(0);
      setPayInFull(true);
      setIsProcessing(false);
    }, 1000);
  };

  const handleReset = () => {
    setSelectedVendor(null);
    setSearched(false);
    setFilters((prev) => ({
      ...prev,
      selectedVendorId: undefined,
    }));
  };

  const relevantInvoices = useMemo(() => {
    if (!selectedVendor) return [];
    return mockInvoices
      .filter((inv) => inv.vendorId === selectedVendor._id)
      .map((inv) => ({
        ...inv,
        payment: invoicePayments[inv.id] || 0,
      }));
  }, [selectedVendor, invoicePayments]);

  const totalOutstanding = relevantInvoices.reduce(
    (sum, inv) => sum + inv.remainingAmount,
    0,
  );
  const totalPaymentAmount = Object.values(invoicePayments).reduce(
    (sum, amount) => sum + amount,
    0,
  );
  const excessAmount = totalPaymentAmount - totalOutstanding;

  return (
    <Layout>
      <div className="flex flex-1 flex-col min-h-screen">
        <div className="flex-1 space-y-6 p-6 pb-32">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('paymentSettlement.title')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t('paymentSettlement.subtitle')}
            </p>
          </div>

          {/* Filters Component */}
          <PaymentFilters
            filters={filters}
            vendors={mockVendors}
            restaurants={mockRestaurants}
            kitchens={mockKitchens}
            onFromTypeChange={handleFromTypeChange}
            onVendorChange={(value) =>
              setFilters((prev) => ({ ...prev, selectedVendorId: value }))
            }
            onRestaurantChange={(value) =>
              setFilters((prev) => ({ ...prev, selectedRestaurantId: value }))
            }
            onKitchenChange={(value) =>
              setFilters((prev) => ({ ...prev, selectedKitchenId: value }))
            }
            onStartDateChange={(value) =>
              setFilters((prev) => ({ ...prev, startDate: value }))
            }
            onEndDateChange={(value) =>
              setFilters((prev) => ({ ...prev, endDate: value }))
            }
            onSearch={handleSearch}
            searchDisabled={
              !filters.selectedVendorId && filters.fromType === 'vendor'
            }
          />

          {/* Selected Vendor Summary */}
          {selectedVendor && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-4 gap-8">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {t('paymentSettlement.summary.from')}
                      </div>
                      <div className="font-medium mt-1 capitalize">
                        {filters.fromType}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {t('paymentSettlement.summary.supplier')}
                      </div>
                      <div className="font-medium mt-1">
                        {selectedVendor.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {t('paymentSettlement.summary.startDate')}
                      </div>
                      <div className="font-medium mt-1">
                        {filters.startDate}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {t('paymentSettlement.summary.endDate')}
                      </div>
                      <div className="font-medium mt-1">{filters.endDate}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-8"
                  >
                    <X className="h-4 w-4 mr-1" />
                    {t('paymentSettlement.summary.newSearch')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invoices Table Component */}
          {selectedVendor && relevantInvoices.length > 0 && (
            <InvoicesTable
              invoices={relevantInvoices}
              invoicePayments={invoicePayments}
              onInvoiceAmountChange={handleInvoiceAmountChange}
              onPayInFull={handlePayInFull}
              totalOutstanding={totalOutstanding}
              payInFull={payInFull}
              mode="single"
            />
          )}

          {/* No results message */}
          {searched && !selectedVendor && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                {t('paymentSettlement.messages.noVendorFound')}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer - Payment Controls */}
        {selectedVendor && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Stats */}
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {t('paymentSettlement.footer.totalOutstanding')}
                    </div>
                    <div className="text-xl font-bold">
                      {totalOutstanding.toFixed(2)}
                    </div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {t('paymentSettlement.footer.toPay')}
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {totalPaymentAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {t('paymentSettlement.footer.excess')}
                    </div>
                    <div
                      className={cn(
                        'text-xl font-bold',
                        excessAmount > 0
                          ? 'text-orange-600'
                          : 'text-muted-foreground',
                      )}
                    >
                      {Math.max(excessAmount, 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  <Select value={paymentMode} onValueChange={setPaymentMode}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue
                        placeholder={t('paymentSettlement.footer.paymentMode')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="CHEQUE">Cheque</SelectItem>
                      <SelectItem value="BANK_TRANSFER">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="CARD">Card</SelectItem>
                      <SelectItem value="ONLINE">Online</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) =>
                        handlePaymentAmountChange(e.target.value)
                      }
                      placeholder="0.00"
                      className="w-[180px] h-9 pl-7 text-right"
                      min={0}
                      max={totalOutstanding}
                      step={0.01}
                    />
                  </div>

                  <Button
                    onClick={handleSubmitPayment}
                    className="h-9 px-6 bg-green-600 hover:bg-green-700"
                    disabled={totalPaymentAmount <= 0 || isProcessing}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {isProcessing
                      ? t('paymentSettlement.footer.processing')
                      : t('paymentSettlement.footer.payAmount')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
