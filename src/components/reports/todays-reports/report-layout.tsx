'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  PaperSize,
  TodaysReportFilterState,
  TodaysReportResponseData,
} from '@/types/todays-report.type';
import { ReportHeader } from './report-header';

interface ReportLayoutProps {
  paperSize: PaperSize;
  filters: TodaysReportFilterState;
  data?: TodaysReportResponseData;
}

export function ReportLayout({ paperSize, filters, data }: ReportLayoutProps) {
  const isThermal = paperSize === '80MM' || paperSize === '58MM';
  // const isNarrow = paperSize === '58MM';

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
        No report generated yet. Click Generate Report to view data.
      </div>
    );
  }

  const reportData = data;

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const containerClasses = cn(
    'print-container',
    'bg-white dark:bg-gray-900 text-black dark:text-white',
    paperSize === 'A4' && 'max-w-[210mm] mx-auto',
    paperSize === '80MM' && 'max-w-[80mm] mx-auto',
    paperSize === '58MM' && 'max-w-[58mm] mx-auto',
    isThermal && 'font-mono',
  );

  const contentClasses = cn(
    'print-content',
    paperSize === 'A4' && 'text-sm leading-relaxed dark:text-gray-100',
    paperSize === '80MM' && 'text-xs leading-tight p-3 dark:text-gray-100',
    paperSize === '58MM' && 'text-[11px] leading-tight p-2 dark:text-gray-100',
    isThermal && 'font-mono',
  );

  const lineClasses = cn('border-t border-gray-700 dark:border-gray-700 my-4');

  const sectionTitleClasses = cn(
    'font-bold text-center text-foreground uppercase tracking-widest',
    paperSize === 'A4' && 'text-lg my-4 pb-2 border-b border-gray-700',
    paperSize === '80MM' && 'text-xs my-1',
    paperSize === '58MM' && 'text-[11px] my-1',
  );

  const sectionContentClasses = cn(
    'text-foreground',
    paperSize === 'A4' && 'text-base space-y-2',
    paperSize === '80MM' && 'text-xs space-y-0.5',
    paperSize === '58MM' && 'text-[11px] space-y-0.5',
  );

  // Helper for row items to ensure alignment and styling
  const RowItem = ({
    label,
    value,
    bold = false,
  }: {
    label: string;
    value: React.ReactNode;
    bold?: boolean;
  }) => (
    <div
      className={cn(
        'flex justify-between items-center py-1',
        bold && 'font-bold text-lg',
      )}
    >
      <span className={cn('text-muted-foreground', bold && 'text-foreground')}>
        {label}
      </span>
      <span className={cn('font-medium', bold && 'text-foreground')}>
        {value}
      </span>
    </div>
  );

  // Calculate totals for Bill Summary
  const billSummary = reportData.billSummary || [];
  const billSummaryTotals = {
    totalBills: billSummary.length,
    completedBills: billSummary.filter((bill) => bill.status === 'Paid').length,
    pendingBills: billSummary.filter((bill) => bill.status === 'Pending')
      .length,
    cancelledBills: billSummary.filter((bill) => bill.status === 'Cancelled')
      .length,
    totalAmount: billSummary.reduce((sum, bill) => sum + bill.amount, 0),
  };

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        {/* Report Header */}
        <ReportHeader
          paperSize={paperSize}
          companyName="Restaurant Hub POS"
          address="123 Main Street, Downtown, City - 123456"
          printedDateTime={new Date().toISOString()}
          dateRange={{ from: filters.from || '', to: filters.to || '' }}
        />

        {/* Line separator */}
        <div className={lineClasses}></div>

        {/* Sales Summary */}
        {filters.showSalesSummary && reportData.salesSummary && (
          <div className="mb-6 page-break-inside-avoid">
            <div className={sectionTitleClasses}>SALES SUMMARY</div>
            <div className={sectionContentClasses}>
              <RowItem
                label="Net Sale:"
                value={formatCurrency(reportData.salesSummary.netSale)}
              />
              <RowItem
                label="Total Tax:"
                value={formatCurrency(reportData.salesSummary.totalTax)}
              />
              <RowItem
                label="VAT:"
                value={formatCurrency(reportData.salesSummary.vat)}
              />
              <RowItem
                label="Total Sales:"
                value={formatCurrency(reportData.salesSummary.totalSales)}
                bold
              />
              <RowItem
                label="Discount:"
                value={formatCurrency(reportData.salesSummary.discount)}
              />
            </div>
            {/* <div className={lineClasses}></div> */}
          </div>
        )}

        {/* Order Type Summary */}
        {filters.showOrderTypeSummary && reportData.orderTypeSummary && (
          <div className="mb-6 page-break-inside-avoid">
            <div className={sectionTitleClasses}>ORDER TYPE SUMMARY</div>
            <div className={sectionContentClasses}>
              {reportData.orderTypeSummary.map((orderType, index) => (
                <RowItem
                  key={index}
                  label={orderType.type + ':'}
                  value={`${orderType.orders} - ${formatCurrency(orderType.netSale)}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Payment Type Summary */}
        {filters.showPaymentTypeSummary && reportData.paymentTypeSummary && (
          <div className="mb-6 page-break-inside-avoid">
            <div className={sectionTitleClasses}>PAYMENT TYPE SUMMARY</div>
            <div
              className={cn(
                sectionContentClasses,
                'grid grid-cols-1 md:grid-cols-2 gap-x-8',
              )}
            >
              {reportData.paymentTypeSummary.map((paymentType, index) => (
                <RowItem
                  key={index}
                  label={paymentType.method + ':'}
                  value={formatCurrency(paymentType.amount)}
                />
              ))}
            </div>
            {/* <div className={lineClasses}></div> */}
          </div>
        )}

        {/* Discount Summary */}
        {filters.showDiscountSummary && reportData.discountSummary && (
          <div className="mb-6 page-break-inside-avoid">
            <div className={sectionTitleClasses}>DISCOUNT SUMMARY</div>
            <div className={sectionContentClasses}>
              <RowItem
                label="Bill Discount:"
                value={formatCurrency(reportData.discountSummary.billDiscount)}
              />
              <RowItem
                label="Item Discount:"
                value={formatCurrency(reportData.discountSummary.itemDiscount)}
              />
              <RowItem
                label="Total Discount:"
                value={formatCurrency(reportData.discountSummary.totalDiscount)}
                bold
              />
            </div>
            {/* <div className={lineClasses}></div> */}
          </div>
        )}

        {/* Expense Summary */}
        {filters.showExpenseSummary && reportData.expenseSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>EXPENSE SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {reportData.expenseSummary.map((expense, index) => (
                <div key={index} className="flex justify-between">
                  <span>{expense.category}:</span>
                  <span>{formatCurrency(expense.amount)}</span>
                </div>
              ))}
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Bill Summary */}
        {filters.showBillSummary && (
          <div className="mb-6 page-break-inside-avoid">
            <div className={sectionTitleClasses}>BILL SUMMARY</div>
            <div className={sectionContentClasses}>
              <RowItem
                label="Total Bills:"
                value={billSummaryTotals.totalBills}
              />
              <RowItem
                label="Completed:"
                value={billSummaryTotals.completedBills}
              />
              <RowItem
                label="Pending:"
                value={billSummaryTotals.pendingBills}
              />
              <RowItem
                label="Cancelled:"
                value={billSummaryTotals.cancelledBills}
              />
              <RowItem
                label="Total Amount:"
                value={formatCurrency(billSummaryTotals.totalAmount)}
                bold
              />
            </div>
            {/* <div className={lineClasses}></div> */}
          </div>
        )}

        {/* Delivery Boy Summary */}
        {filters.showDeliveryBoySummary && reportData.deliveryBoySummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>DELIVERY BOY SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {reportData.deliveryBoySummary.map((deliveryBoy, index) => (
                <div key={index} className="flex justify-between">
                  <span>{deliveryBoy.name}:</span>
                  <span>
                    {deliveryBoy.deliveries} -{' '}
                    {formatCurrency(deliveryBoy.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Waiter Summary */}
        {filters.showWaiterSummary && reportData.waiterSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>WAITER SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {reportData.waiterSummary.map((waiter, index) => (
                <div key={index} className="flex justify-between">
                  <span>{waiter.name}:</span>
                  <span>
                    {waiter.tables} - {formatCurrency(waiter.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Product Group Summary */}
        {filters.showProductGroupSummary && reportData.productGroupSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>PRODUCT GROUP SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {reportData.productGroupSummary.map((group, index) => (
                <div key={index} className="flex justify-between">
                  <span>{group.taxProductGroup}:</span>
                  <span>{formatCurrency(group.amount)}</span>
                </div>
              ))}
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Kitchen Department Summary */}
        {filters.showKitchenDepartmentSummary &&
          reportData.kitchenDepartmentSummary && (
            <div className="mb-2">
              <div className={sectionTitleClasses}>
                KITCHEN DEPARTMENT SUMMARY
              </div>
              <div className={`${sectionContentClasses} space-y-0.5`}>
                {reportData.kitchenDepartmentSummary.map((kitchen, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{kitchen.kitchen}:</span>
                    <span>
                      {kitchen.soldItems} - {formatCurrency(kitchen.amount)}
                    </span>
                  </div>
                ))}
              </div>
              <div className={lineClasses}></div>
            </div>
          )}

        {/* Category Summary */}
        {filters.showCategorySummary && reportData.categorySummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>CATEGORY SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {reportData.categorySummary.map((category, index) => (
                <div key={index} className="flex justify-between">
                  <span>{category.category}:</span>
                  <span>
                    {category.soldItems} - {formatCurrency(category.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Sold Items Summary */}
        {filters.showSoldItemsSummary && reportData.soldItemsSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>SOLD ITEMS SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {reportData.soldItemsSummary.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.itemName}:</span>
                  <span>
                    {item.quantity} x{' '}
                    {formatCurrency(item.amount / item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Cancel Items Summary */}
        {filters.showCancelItemsSummary && reportData.cancelItemsSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>CANCEL ITEMS SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {reportData.cancelItemsSummary.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.itemName}:</span>
                  <span>
                    {item.quantity} - {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Wallet Summary */}
        {filters.showWalletSummary && reportData.walletSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>WALLET SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              <div className="flex justify-between">
                <span>Transactions:</span>
                <span>{reportData.walletSummary.transactions}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span>
                  {formatCurrency(reportData.walletSummary.totalAmount)}
                </span>
              </div>
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Due Payment Received Summary */}
        {filters.showDuePaymentReceivedSummary &&
          reportData.duePaymentReceivedSummary && (
            <div className="mb-2">
              <div className={sectionTitleClasses}>DUE PAYMENT RECEIVED</div>
              <div className={`${sectionContentClasses} space-y-0.5`}>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>
                    {formatCurrency(
                      reportData.duePaymentReceivedSummary.amount,
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Transactions:</span>
                  <span>{reportData.duePaymentReceivedSummary.count}</span>
                </div>
              </div>
              <div className={lineClasses}></div>
            </div>
          )}

        {/* Due Payment Receivable Summary */}
        {filters.showDuePaymentReceivableSummary &&
          reportData.duePaymentReceivableSummary && (
            <div className="mb-2">
              <div className={sectionTitleClasses}>DUE PAYMENT RECEIVABLE</div>
              <div className={`${sectionContentClasses} space-y-0.5`}>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>
                    {formatCurrency(
                      reportData.duePaymentReceivableSummary.amount,
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Transactions:</span>
                  <span>{reportData.duePaymentReceivableSummary.count}</span>
                </div>
              </div>
              <div className={lineClasses}></div>
            </div>
          )}

        {/* Payment Variance Summary */}
        {filters.showPaymentVarianceSummary &&
          reportData.paymentVarianceSummary && (
            <div className="mb-2">
              <div className={sectionTitleClasses}>PAYMENT VARIANCE</div>
              <div className={`${sectionContentClasses} space-y-0.5`}>
                {reportData.paymentVarianceSummary.map((variance, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{variance.method}:</span>
                    <span>{formatCurrency(variance.variance)}</span>
                  </div>
                ))}
              </div>
              <div className={lineClasses}></div>
            </div>
          )}

        {/* Currency Denominations Summary */}
        {filters.showCurrencyDenominationsSummary &&
          reportData.currencyDenominationsSummary && (
            <div className="mb-2">
              <div className={sectionTitleClasses}>CURRENCY DENOMINATIONS</div>
              <div
                className={`${sectionContentClasses} grid grid-cols-2 gap-x-2`}
              >
                {reportData.currencyDenominationsSummary.map(
                  (denomination, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{denomination.denomination}:</span>
                      <span>{denomination.count}</span>
                    </div>
                  ),
                )}
              </div>
              <div className={lineClasses}></div>
            </div>
          )}

        {/* Order Source Summary */}
        {filters.showOrderSourceSummary && reportData.orderSourceSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>ORDER SOURCE SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {reportData.orderSourceSummary.map((source, index) => (
                <div key={index} className="flex justify-between">
                  <span>{source.source}:</span>
                  <span>
                    {source.orders} - {formatCurrency(source.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Report Footer */}
        <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-700 text-center text-xs dark:text-gray-300">
          <p className="font-medium dark:text-white">*** End of Report ***</p>
          <p className="mt-0.5 dark:text-gray-300">
            Generated by Restaurant Hub POS System
          </p>
          <p className="mt-0.5 text-[10px] dark:text-gray-400">Page 1 of 1</p>
        </div>
      </div>
    </div>
  );
}
