import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const METHOD_COLORS: Record<string, string> = {
  cash: 'bg-emerald-500',
  card: 'bg-blue-500',
  upi: 'bg-violet-500',
  wallet: 'bg-amber-500',
  online: 'bg-cyan-500',
  split: 'bg-red-500',
  pending: 'bg-red-500',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PaymentStatistics({ data, t }: any) {
  const parseValue = (val: string) => {
    return parseFloat(val.replace(/[^0-9.-]+/g, ''));
  };

  const totalRevenue = data.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: number, item: any) => acc + parseValue(item.value),
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.paymentStatistics')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {data.map((item: any) => {
          const value = parseValue(item.value);
          const percentage =
            totalRevenue > 0 ? (value / totalRevenue) * 100 : 0;

          return (
            <div
              key={item.id}
              className="flex flex-col space-y-2 rounded-lg border p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    className={METHOD_COLORS[item.method] ?? 'bg-gray-400'}
                  >
                    {item.method}
                  </Badge>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium">{item.total}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.time}
                  </div>
                </div>
              </div>

              {/* Progress Bar Section */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t('dashboard.revenueShare') || 'Revenue Share'}</span>
                  <span>{percentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full ${METHOD_COLORS[item.method] ?? 'bg-gray-400'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
