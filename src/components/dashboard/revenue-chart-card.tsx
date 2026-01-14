import {
  GenericBarChart,
  formatCompactCurrency,
} from '@/components/ui/generic-bar-chart';
import type { ChartConfig } from '@/components/ui/chart';

const COLORS = {
  dineIn: 'var(--color-dineIn)',
  digital: 'var(--color-digital)',
  takeaway: 'var(--color-takeaway)',
  delivery: 'var(--color-delivery)',
};

interface RevenueData {
  date: string;
  dineIn: number;
  digital: number;
  takeaway: number;
  delivery: number;
  [key: string]: string | number;
}

interface RevenueChartCardProps {
  data: RevenueData[];
  config: ChartConfig;
}

export function RevenueChartCard({ data, config }: RevenueChartCardProps) {
  return (
    <GenericBarChart
      data={data}
      config={config}
      dataKeys={['dineIn', 'digital', 'takeaway', 'delivery']}
      xAxisKey="date"
      title="Day-Wise Revenue Analysis"
      isStacked={true}
      isCollapsible={true}
      defaultOpen={true}
      showXAxis="responsive"
      showLegend={true}
      xAxisFormatter={(value) => {
        return new Date(value).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }}
      yAxisFormatter={formatCompactCurrency}
      height="h-[320px]"
      barRadius={4}
      colors={COLORS}
    />
  );
}
