import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChangeIndicator } from './change-indicator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function KpiCard({ kpi, t }: any) {
  const Icon = kpi.icon;

  const currancy = '₹';
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{t(kpi.title)}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currancy}
          {kpi.value}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ChangeIndicator value={kpi.change} type={kpi.changeType} />
        </div>
      </CardContent>
    </Card>
  );
}
