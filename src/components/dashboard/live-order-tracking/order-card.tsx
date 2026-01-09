import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Truck, Utensils } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface OrderCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  order: any;
  type: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TYPE_ICONS: Record<string, any> = {
  'dine-in': Utensils,
  pickup: ShoppingBag,
  delivery: Truck,
};

export function OrderCard({ order, type }: OrderCardProps) {
  const Icon = TYPE_ICONS[type] || ShoppingBag;

  let timeDisplay = '';
  try {
    if (order.createdAt) {
      timeDisplay = formatDistanceToNow(new Date(order.createdAt), {
        addSuffix: true,
      });
    } else {
      timeDisplay = order.time || '';
    }
  } catch (e) {
    timeDisplay = order.time || '';
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="flex items-start gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{order.table || order.customer}</span>
            <span className="text-xs text-green-500 font-medium italic">
              {order.status}
            </span>
          </div>
          <div className="text-sm font-semibold text-muted-foreground">
            {order.id}
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm font-bold">
              <span className="text-xs font-normal text-muted-foreground mr-1">
                AED
              </span>
              {order.amount.toFixed(2)}
            </div>
            <span className="text-xs italic text-muted-foreground">
              {timeDisplay}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
