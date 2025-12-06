'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface EditableToggleCellProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  isModified?: boolean;
  label?: string;
}

export const EditableToggleCell: React.FC<EditableToggleCellProps> = ({
  value,
  onChange,
  disabled = false,
  isModified = false,
  label,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
        className={cn(isModified && 'ring-2 ring-orange-400 ring-offset-2')}
      />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      {isModified && <span className="text-xs text-orange-600">●</span>}
    </div>
  );
};
