'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PaperSize, TodaysReportFilterState } from '@/types/todays-report.type';
import { ReportHeader } from './report-header';
import { sampleReportData } from './sampleData';

interface ReportLayoutProps {
  paperSize: PaperSize;
  filters: TodaysReportFilterState;
}

export function ReportLayout({ paperSize, filters }: ReportLayoutProps) {
  const isThermal = paperSize === '80MM' || paperSize === '58MM';
  const isNarrow = paperSize === '58MM';

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Apply print styles dynamically
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
            @media print {
                @page {
                    size: ${paperSize === 'A4' ? 'A4' : paperSize === '80MM' ? '80mm' : '58mm'};
                    margin: 0;
                }
                
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    -webkit-print-color-adjust: exact;
                }
                
                .print-container {
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                .print-content {
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    color: black !important;
                    background: white !important;
                }
            }
        `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [paperSize]);

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
    paperSize === 'A4' && 'text-sm leading-tight p-4 dark:text-gray-100',
    paperSize === '80MM' && 'text-xs leading-tight p-3 dark:text-gray-100',
    paperSize === '58MM' && 'text-[11px] leading-tight p-2 dark:text-gray-100',
    isThermal && 'font-mono',
  );

  const lineClasses = cn('border-t border-gray-300 dark:border-gray-700 my-1');

  const sectionTitleClasses = cn(
    'font-bold text-center my-1 text-black dark:text-white',
    paperSize === 'A4' && 'text-sm',
    paperSize === '80MM' && 'text-xs',
    paperSize === '58MM' && 'text-[11px]',
  );

  const sectionContentClasses = cn(
    'text-gray-800 dark:text-gray-200',
    paperSize === 'A4' && 'text-sm',
    paperSize === '80MM' && 'text-xs',
    paperSize === '58MM' && 'text-[11px]',
  );

  // Calculate totals for Bill Summary
  const billSummaryTotals = {
    totalBills: sampleReportData.billSummary.length,
    completedBills: sampleReportData.billSummary.filter(
      (bill) => bill.status === 'Paid',
    ).length,
    pendingBills: sampleReportData.billSummary.filter(
      (bill) => bill.status === 'Pending',
    ).length,
    cancelledBills: sampleReportData.billSummary.filter(
      (bill) => bill.status === 'Cancelled',
    ).length,
    totalAmount: sampleReportData.billSummary.reduce(
      (sum, bill) => sum + bill.amount,
      0,
    ),
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
        {filters.showSalesSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>SALES SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              <div className="flex justify-between">
                <span>Net Sale:</span>
                <span>
                  {formatCurrency(sampleReportData.salesSummary.netSale)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Tax:</span>
                <span>
                  {formatCurrency(sampleReportData.salesSummary.totalTax)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VAT:</span>
                <span>{formatCurrency(sampleReportData.salesSummary.vat)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Sales:</span>
                <span>
                  {formatCurrency(sampleReportData.salesSummary.totalSales)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>
                  {formatCurrency(sampleReportData.salesSummary.discount)}
                </span>
              </div>
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Z Report Summary */}
        {filters.showZReportSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>Z REPORT SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              <div className="flex justify-between">
                <span>Opening:</span>
                <span>{formatCurrency(5000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Closing:</span>
                <span>{formatCurrency(85000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cash Deposit:</span>
                <span>{formatCurrency(80000)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Difference:</span>
                <span>{formatCurrency(5000)}</span>
              </div>
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Order Type Summary */}
        {filters.showOrderTypeSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>ORDER TYPE SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {sampleReportData.orderTypeSummary.map((orderType, index) => (
                <div key={index} className="flex justify-between">
                  <span>{orderType.type}:</span>
                  <span>
                    {orderType.orders} - {formatCurrency(orderType.netSale)}
                  </span>
                </div>
              ))}
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Payment Type Summary */}
        {filters.showPaymentTypeSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>PAYMENT TYPE SUMMARY</div>
            <div
              className={`${sectionContentClasses} grid grid-cols-2 gap-x-2`}
            >
              {sampleReportData.paymentTypeSummary.map((paymentType, index) => (
                <div key={index} className="flex justify-between">
                  <span>{paymentType.method}:</span>
                  <span>{formatCurrency(paymentType.amount)}</span>
                </div>
              ))}
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Discount Summary */}
        {filters.showDiscountSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>DISCOUNT SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              <div className="flex justify-between">
                <span>Bill Discount:</span>
                <span>
                  {formatCurrency(
                    sampleReportData.discountSummary.billDiscount,
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Item Discount:</span>
                <span>
                  {formatCurrency(
                    sampleReportData.discountSummary.itemDiscount,
                  )}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Discount:</span>
                <span>
                  {formatCurrency(
                    sampleReportData.discountSummary.totalDiscount,
                  )}
                </span>
              </div>
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Expense Summary */}
        {filters.showExpenseSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>EXPENSE SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {sampleReportData.expenseSummary.map((expense, index) => (
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
          <div className="mb-2">
            <div className={sectionTitleClasses}>BILL SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              <div className="flex justify-between">
                <span>Total Bills:</span>
                <span>{billSummaryTotals.totalBills}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span>{billSummaryTotals.completedBills}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span>{billSummaryTotals.pendingBills}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Amount:</span>
                <span>{formatCurrency(billSummaryTotals.totalAmount)}</span>
              </div>
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Delivery Boy Summary */}
        {filters.showDeliveryBoySummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>DELIVERY BOY SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {sampleReportData.deliveryBoySummary.map((deliveryBoy, index) => (
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
        {filters.showWaiterSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>WAITER SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {sampleReportData.waiterSummary.map((waiter, index) => (
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
        {filters.showProductGroupSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>PRODUCT GROUP SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {sampleReportData.productGroupSummary.map((group, index) => (
                <div key={index} className="flex justify-between">
                  <span>{group.productGroup}:</span>
                  <span>{formatCurrency(group.amount)}</span>
                </div>
              ))}
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Kitchen Department Summary */}
        {filters.showKitchenDepartmentSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>
              KITCHEN DEPARTMENT SUMMARY
            </div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {sampleReportData.kitchenDepartmentSummary.map(
                (kitchen, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{kitchen.kitchen}:</span>
                    <span>
                      {kitchen.soldItems} - {formatCurrency(kitchen.amount)}
                    </span>
                  </div>
                ),
              )}
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Category Summary */}
        {filters.showCategorySummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>CATEGORY SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {sampleReportData.categorySummary.map((category, index) => (
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
        {filters.showSoldItemsSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>SOLD ITEMS SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {sampleReportData.soldItemsSummary.map((item, index) => (
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
        {filters.showCancelItemsSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>CANCEL ITEMS SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {sampleReportData.cancelItemsSummary.map((item, index) => (
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
        {filters.showWalletSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>WALLET SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              <div className="flex justify-between">
                <span>Transactions:</span>
                <span>{sampleReportData.walletSummary.transactions}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span>
                  {formatCurrency(sampleReportData.walletSummary.totalAmount)}
                </span>
              </div>
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Due Payment Received Summary */}
        {filters.showDuePaymentReceivedSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>DUE PAYMENT RECEIVED</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>
                  {formatCurrency(
                    sampleReportData.duePaymentReceivedSummary.amount,
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transactions:</span>
                <span>{sampleReportData.duePaymentReceivedSummary.count}</span>
              </div>
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Due Payment Receivable Summary */}
        {filters.showDuePaymentReceivableSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>DUE PAYMENT RECEIVABLE</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>
                  {formatCurrency(
                    sampleReportData.duePaymentReceivableSummary.amount,
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transactions:</span>
                <span>
                  {sampleReportData.duePaymentReceivableSummary.count}
                </span>
              </div>
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Payment Variance Summary */}
        {filters.showPaymentVarianceSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>PAYMENT VARIANCE</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {sampleReportData.paymentVarianceSummary.map(
                (variance, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{variance.method}:</span>
                    <span>{formatCurrency(variance.variance)}</span>
                  </div>
                ),
              )}
            </div>
            <div className={lineClasses}></div>
          </div>
        )}

        {/* Currency Denominations Summary */}
        {filters.showCurrencyDenominationsSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>CURRENCY DENOMINATIONS</div>
            <div
              className={`${sectionContentClasses} grid grid-cols-2 gap-x-2`}
            >
              {sampleReportData.currencyDenominationsSummary.map(
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
        {filters.showOrderSourceSummary && (
          <div className="mb-2">
            <div className={sectionTitleClasses}>ORDER SOURCE SUMMARY</div>
            <div className={`${sectionContentClasses} space-y-0.5`}>
              {sampleReportData.orderSourceSummary.map((source, index) => (
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
