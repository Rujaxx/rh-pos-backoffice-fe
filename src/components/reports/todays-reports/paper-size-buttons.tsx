'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Receipt, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaperSize } from '@/types/todays-report.type';

interface PaperSizeButtonsProps {
  activePaperSize: PaperSize;
  onPaperSizeChange: (size: PaperSize) => void;
}

export function PaperSizeButtons({
  activePaperSize,
  onPaperSizeChange,
}: PaperSizeButtonsProps) {
  const paperSizes = [
    {
      id: 'A4' as PaperSize,
      label: 'A4 Paper',
      icon: FileText,
      dimensions: '210 × 297 mm',
    },
    {
      id: '80MM' as PaperSize,
      label: '80mm Thermal',
      icon: Receipt,
      dimensions: '80 mm width',
    },
    {
      id: '58MM' as PaperSize,
      label: '58mm Thermal',
      icon: Receipt,
      dimensions: '58 mm width',
    },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3">Select Paper Size</h3>
        <div className="space-y-2">
          {paperSizes.map((size) => {
            const isActive = activePaperSize === size.id;
            const Icon = size.icon;

            return (
              <button
                key={size.id}
                onClick={() => onPaperSizeChange(size.id)}
                className={cn(
                  'w-full text-left p-3 rounded-lg border transition-all duration-200',
                  'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
                  'bg-white dark:bg-gray-800',
                  isActive
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-muted hover:border-primary/50',
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'p-2 rounded-md',
                        isActive ? 'bg-primary/10' : 'bg-muted',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          isActive ? 'text-primary' : 'text-muted-foreground',
                        )}
                      />
                    </div>

                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'font-medium text-sm',
                            isActive ? 'text-primary' : 'text-foreground',
                          )}
                        >
                          {size.label}
                        </span>
                        {isActive && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {size.dimensions}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
