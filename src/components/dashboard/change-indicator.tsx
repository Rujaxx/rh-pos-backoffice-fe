import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChangeIndicator({
  value,
  type,
}: {
  value: string;
  type: 'positive' | 'negative';
}) {
  const Icon = type === 'positive' ? TrendingUp : TrendingDown;

  return (
    <div className="flex items-center gap-1 text-xs">
      <Icon
        className={cn(
          'h-4 w-4',
          type === 'positive' ? 'text-green-500' : 'text-red-500',
        )}
      />
      <span
        className={cn(type === 'positive' ? 'text-green-500' : 'text-red-500')}
      >
        {value}
      </span>
    </div>
  );
}
