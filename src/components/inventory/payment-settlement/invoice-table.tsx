'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { InvoiceType } from '@/types/payment-settlement.type';
import { cn } from '@/lib/utils';

interface InvoicesTableProps {
  invoices: InvoiceType[];
  invoicePayments: Record<string, number>;
  onInvoiceAmountChange: (invoiceId: string, value: string) => void;
  onPayInFull: () => void;
  totalOutstanding: number;
  payInFull: boolean;
  mode: 'single' | 'bulk';
}

export function InvoicesTable({
  invoices,
  invoicePayments,
  onInvoiceAmountChange,
  onPayInFull,
  totalOutstanding,
  payInFull,
  mode,
}: InvoicesTableProps) {
  const { t } = useTranslation();

  if (invoices.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {t('paymentSettlement.invoices.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {mode === 'bulk' && (
                  <TableHead>
                    {t('paymentSettlement.invoices.vendor')}
                  </TableHead>
                )}
                <TableHead>{t('paymentSettlement.invoices.date')}</TableHead>
                <TableHead>
                  {t('paymentSettlement.invoices.invoiceNo')}
                </TableHead>
                <TableHead className="text-right">
                  {t('paymentSettlement.invoices.amount')}
                </TableHead>
                <TableHead className="text-right">
                  {t('paymentSettlement.invoices.paidAmount')}
                </TableHead>
                <TableHead className="text-right">
                  {t('paymentSettlement.invoices.remainingAmount')}
                </TableHead>
                <TableHead className="text-right">
                  {t('paymentSettlement.invoices.payment')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-muted/30">
                  {mode === 'bulk' && (
                    <TableCell className="font-medium">
                      {invoice.vendorName}
                    </TableCell>
                  )}
                  <TableCell>{invoice.invoiceDate}</TableCell>
                  <TableCell className="font-mono">
                    {invoice.invoiceNo}
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.paidAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-destructive">
                    {invoice.remainingAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      value={invoicePayments[invoice.id] || 0}
                      onChange={(e) =>
                        onInvoiceAmountChange(invoice.id, e.target.value)
                      }
                      className="w-24 h-8 text-sm text-right ml-auto"
                      min={0}
                      max={invoice.remainingAmount}
                      step={0.01}
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
              ))}

              {/* Pay in full row */}
              <TableRow className="bg-muted/20">
                <TableCell
                  colSpan={mode === 'bulk' ? 6 : 5}
                  className="text-right"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onPayInFull}
                    className={cn(
                      'text-sm',
                      payInFull && 'text-primary font-medium',
                    )}
                  >
                    {t('paymentSettlement.invoices.payInFull')}
                  </Button>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {totalOutstanding.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
