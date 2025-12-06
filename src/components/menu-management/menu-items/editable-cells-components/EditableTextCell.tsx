'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface EditableTextCellProps {
  value: string;
  onChange: (value: string) => void;
  validation?: (value: string) => string | undefined;
  isModified?: boolean;
  multiline?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const EditableTextCell: React.FC<EditableTextCellProps> = ({
  value,
  onChange,
  validation,
  isModified = false,
  multiline = false,
  placeholder,
  disabled = false,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (validation) {
      const validationError = validation(localValue);
      setError(validationError);
      if (!validationError) {
        onChange(localValue);
      }
    } else {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      (e.currentTarget as HTMLElement).blur();
    }
    if (e.key === 'Escape') {
      setLocalValue(value);
      (e.currentTarget as HTMLElement).blur();
    }
  };

  const Component = multiline ? Textarea : Input;

  return (
    <div className="flex flex-col gap-1 min-w-[150px]">
      <div className="flex items-center gap-2">
        <Component
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
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
