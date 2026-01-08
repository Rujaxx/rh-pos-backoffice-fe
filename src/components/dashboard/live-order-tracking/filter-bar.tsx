'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function FilterBar() {
  return (
    <div className="space-y-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <span className="text-black dark:text-white">
            Live Order Tracking
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Brand Name:
          </label>
          <Select defaultValue="kfc">
            <SelectTrigger>
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kfc">Kfc delhi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Outlet Name:
          </label>
          <Select defaultValue="shree">
            <SelectTrigger className="truncate">
              <SelectValue placeholder="Select Outlet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shree">RH pos restaurant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button size="sm" className="bg-[#1e2e2e] text-white">
          Apply
        </Button>
        <Button size="sm" variant="destructive">
          Reset
        </Button>
      </div>
    </div>
  );
}
