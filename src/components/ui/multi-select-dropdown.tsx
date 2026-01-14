'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select options',
  className,
}: MultiSelectDropdownProps) {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={cn(
          'flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring',
          className,
        )}
      >
        {selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}
        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-50 w-full min-w-[14rem] max-w-xs rounded-md border bg-popover p-1 shadow-md max-h-60 overflow-y-auto"
        align="start"
        style={{
          maxWidth: 'calc(100vw - 2rem)', // Ensure it doesn't go off screen
        }}
      >
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={value.includes(option.value)}
            onCheckedChange={() => handleToggle(option.value)}
            className="flex items-center gap-2 cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent focus:bg-accent focus:outline-none min-w-0"
            style={{
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            <Checkbox
              checked={value.includes(option.value)}
              className="pointer-events-none shrink-0"
            />
            <span className="truncate min-w-0">{option.label}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
