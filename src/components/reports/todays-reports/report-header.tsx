'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { PaperSize } from '@/types/todays-report.type';

interface ReportHeaderProps {
  paperSize: PaperSize;
  companyName: string;
  address: string;
  printedDateTime: string;
  dateRange: { from: string; to: string };
}

export function ReportHeader({
  paperSize,
  companyName,
  address,
  printedDateTime,
  dateRange,
}: ReportHeaderProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const isThermal = paperSize === '80MM' || paperSize === '58MM';

  return (
    <div
      className={cn(
        'border-b pb-4 mb-6 print:border-b print:pb-2 print:mb-4 text-center',
        isThermal && 'text-center',
        !isThermal && 'text-left',
      )}
    >
      {/* Company Name */}
      <h1
        className={cn(
          'font-bold mb-2',
          paperSize === 'A4' && 'text-2xl',
          paperSize === '80MM' && 'text-lg',
          paperSize === '58MM' && 'text-base',
        )}
      >
        {companyName}
      </h1>

      {/* Report Title */}
      <h2
        className={cn(
          'font-semibold mb-3 text-primary',
          paperSize === 'A4' && 'text-xl',
          paperSize === '80MM' && 'text-base',
          paperSize === '58MM' && 'text-sm',
        )}
      >
        TODAY&apos;S REPORT
      </h2>

      {/* Address */}
      <p
        className={cn(
          'text-muted-foreground mb-3',
          paperSize === 'A4' && 'text-base',
          paperSize === '80MM' && 'text-sm',
          paperSize === '58MM' && 'text-xs',
        )}
      >
        {address}
      </p>

      {/* Date Information */}
      <div
        className={cn(
          'flex flex-wrap gap-4 text-sm justify-center',
          isThermal && 'flex-col gap-1',
        )}
      >
        <div>
          <span className="font-medium">Printed: </span>
          {formatDateTime(printedDateTime)}
        </div>

        <div>
          <span className="font-medium">Period: </span>
          {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
        </div>
      </div>
    </div>
  );
}
