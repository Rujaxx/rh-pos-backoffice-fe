'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface EditableNumberCellProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: 'currency' | 'integer' | 'decimal';
  isModified?: boolean;
  disabled?: boolean;
}

export const EditableNumberCell: React.FC<EditableNumberCellProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  format = 'decimal',
  isModified = false,
  disabled = false,
}) => {
  const [localValue, setLocalValue] = useState(value.toString());
  const [error, setError] = useState<string>();

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    const numValue = parseFloat(localValue);

    if (isNaN(numValue)) {
      setError('Invalid number');
      setLocalValue(value.toString());
      return;
    }

    if (min !== undefined && numValue < min) {
      setError(`Minimum value is ${min}`);
      setLocalValue(value.toString());
      return;
    }

    if (max !== undefined && numValue > max) {
      setError(`Maximum value is ${max}`);
      setLocalValue(value.toString());
      return;
    }

    setError(undefined);
    onChange(numValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.currentTarget as HTMLElement).blur();
    }
    if (e.key === 'Escape') {
      setLocalValue(value.toString());
      (e.currentTarget as HTMLElement).blur();
    }
  };

  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            'w-full',
            isModified && 'ring-2 ring-orange-400',
            error && 'border-red-500',
          )}
        />
        {isModified && <span className="text-xs text-orange-600">●</span>}
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
};
