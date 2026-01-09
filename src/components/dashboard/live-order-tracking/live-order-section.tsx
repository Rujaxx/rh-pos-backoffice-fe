'use client';

import { Card, CardContent } from '@/components/ui/card';
import { OrderCard } from './order-card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveOrderSectionProps {
  className?: string;
  stats: {
    id: string;
    title: string;
    revenue?: number;
    totalOrders: number;
    runningOrders: number;
    items?: number;
    icon: LucideIcon;
    type: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orders: any[];
}

export function LiveOrderSection({
  stats,
  orders,
  className,
}: LiveOrderSectionProps) {
  const Icon = stats.icon;
  const isKOT = stats.id === 'kot';

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header Stat Card */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="font-semibold">{stats.title}</div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            {!isKOT ? (
              <>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="font-bold">{stats.totalOrders}</span>
                </div>
                <div className="flex flex-col border-l border-r px-2">
                  <span className="text-xs text-muted-foreground">Running</span>
                  <span className="font-bold">{stats.runningOrders}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Revenue</span>
                  <span className="font-bold">
                    AED {stats.revenue?.toFixed(0)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="font-bold">{stats.totalOrders}</span>
                </div>
                <div className="flex flex-col border-l border-r px-2">
                  <span className="text-xs text-muted-foreground">Running</span>
                  <span className="font-bold">{stats.runningOrders}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Items</span>
                  <span className="font-bold">{stats.items}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} type={stats.type} />
        ))}
      </div>
    </div>
  );
}
