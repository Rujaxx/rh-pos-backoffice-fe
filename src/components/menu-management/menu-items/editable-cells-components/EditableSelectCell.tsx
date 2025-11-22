"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface EditableSelectCellProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  isLoading?: boolean;
  isModified?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const EditableSelectCell: React.FC<EditableSelectCellProps> = ({
  value,
  options,
  onChange,
  isLoading = false,
  isModified = false,
  placeholder = "Select...",
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-2 min-w-[150px]">
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger
          className={cn("w-full", isModified && "ring-2 ring-orange-400")}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isModified && <span className="text-xs text-orange-600">●</span>}
    </div>
  );
};
