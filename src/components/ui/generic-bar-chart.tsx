'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';

export function formatCompactCurrency(value: number) {
  if (value >= 1_000_000_000) return `₹${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `₹${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`;
  return `₹${value}`;
}

function useResponsiveBarSize() {
  const [barSize, setBarSize] = useState(100);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setBarSize(16);
      else if (window.innerWidth < 1024) setBarSize(32);
      else setBarSize(80);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return barSize;
}

interface ChartDataItem {
  [key: string]: string | number | undefined;
  color?: string;
}

interface GenericBarChartProps<T extends ChartDataItem = ChartDataItem> {
  // Required props
  data: T[];
  config: ChartConfig;

  // Chart configuration
  dataKeys: string[]; // Array of keys to chart (e.g., ['dineIn', 'digital'] or ['amount'])
  xAxisKey: string; // Key for X-axis (e.g., 'date' or 'name')

  // Optional customization
  title?: string;
  description?: string;
  isStacked?: boolean; // Whether to stack bars or show individual
  isCollapsible?: boolean; // Whether the card can collapse
  defaultOpen?: boolean; // Default collapsed state
  showXAxis?: boolean | 'responsive'; // Show X-axis labels
  showLegend?: boolean; // Show legend

  // Formatting functions
  xAxisFormatter?: (value: string | number) => string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (
    value: string | number | (string | number)[],
    name: string | number,
    item: { payload?: T },
  ) => React.ReactNode;

  // Styling
  height?: string; // Chart height (e.g., '320px')
  barRadius?: [number, number, number, number] | number;
  colors?: Record<string, string>; // Custom colors per dataKey
  className?: string;
}

export function GenericBarChart<T extends ChartDataItem = ChartDataItem>({
  data,
  config,
  dataKeys,
  xAxisKey,
  title,
  description,
  isStacked = false,
  isCollapsible = true,
  defaultOpen = true,
  showXAxis = 'responsive',
  showLegend = true,
  xAxisFormatter,
  yAxisFormatter = formatCompactCurrency,
  tooltipFormatter,
  height = '320px',
  barRadius = 4,
  colors,
  className,
}: GenericBarChartProps<T>) {
  const [open, setOpen] = useState(defaultOpen);
  const barSize = useResponsiveBarSize();
  const [displayXAxis, setDisplayXAxis] = useState(false);

  useEffect(() => {
    if (showXAxis === 'responsive') {
      const checkScreenSize = () => {
        setDisplayXAxis(window.matchMedia('(min-width: 1024px)').matches);
      };
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    } else {
      setDisplayXAxis(showXAxis);
    }
  }, [showXAxis]);

  // Determine bar radius for stacked vs individual
  const getBarRadius = (
    index: number,
    total: number,
  ): number | [number, number, number, number] => {
    const radiusTuple: [number, number, number, number] =
      typeof barRadius === 'number'
        ? [barRadius, barRadius, barRadius, barRadius]
        : barRadius;

    if (!isStacked) {
      return [radiusTuple[0], radiusTuple[1], 0, 0];
    }

    // For stacked bars
    if (index === 0) {
      return [radiusTuple[0], radiusTuple[1], 0, 0];
    } else if (index === total - 1) {
      return [0, 0, radiusTuple[2], radiusTuple[3]];
    }
    return [0, 0, 0, 0];
  };

  const chartContent = (
    <ChartContainer
      config={config}
      className={cn(height, 'sm:h-[360px] w-full')}
    >
      <BarChart data={data} barSize={barSize} margin={{ left: -10 }}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          className="opacity-50"
        />

        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
          hide={!displayXAxis}
          tickFormatter={xAxisFormatter}
          interval={0}
        />

        <YAxis
          tickFormatter={yAxisFormatter}
          tickLine={false}
          axisLine={false}
          width={72}
        />

        <ChartTooltip
          content={
            tooltipFormatter ? (
              <ChartTooltipContent formatter={tooltipFormatter} />
            ) : (
              <ChartTooltipContent />
            )
          }
        />

        {showLegend && <ChartLegend content={<ChartLegendContent />} />}

        {dataKeys.map((key, index) => {
          const color = colors?.[key] || `var(--color-${key})`;
          const radius = getBarRadius(index, dataKeys.length);

          return (
            <Bar
              key={key}
              dataKey={key}
              stackId={isStacked ? 'a' : undefined}
              fill={color}
              radius={radius}
            >
              {!isStacked &&
                data.map((entry, cellIndex) => (
                  <Cell key={`cell-${cellIndex}`} fill={entry.color || color} />
                ))}
            </Bar>
          );
        })}
      </BarChart>
    </ChartContainer>
  );

  if (!isCollapsible) {
    return (
      <Card className={cn('transition-shadow hover:shadow-sm', className)}>
        {(title || description) && (
          <CardHeader>
            {title && (
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </CardHeader>
        )}
        <CardContent className={!title && !description ? 'pt-6' : 'pt-2'}>
          {chartContent}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('transition-shadow hover:shadow-sm', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          {title && (
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((v) => !v)}
          className="h-8 w-8"
        >
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-300 ease-out',
              open && 'rotate-180',
            )}
          />
        </Button>
      </CardHeader>

      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <CardContent className="pt-2">{chartContent}</CardContent>
        </div>
      </div>
    </Card>
  );
}
