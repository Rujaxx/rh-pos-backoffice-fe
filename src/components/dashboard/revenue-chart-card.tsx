import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
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

    update(); // initial calculation
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return barSize;
}
const COLORS = {
  dineIn: 'var(--color-dineIn)',
  digital: 'var(--color-digital)',
  takeaway: 'var(--color-takeaway)',
  delivery: 'var(--color-delivery)',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RevenueChartCard({ data, config }: any) {
  const [open, setOpen] = useState(true);
  const barSize = useResponsiveBarSize();
  const [showXAxis, setShowXAxis] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setShowXAxis(window.matchMedia('(min-width: 1024px)').matches);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Day-Wise Revenue Analysis
        </CardTitle>

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
          <CardContent className="pt-2">
            <ChartContainer
              config={config}
              className="h-[320px] sm:h-[360px] w-full"
            >
              <BarChart data={data} barSize={barSize} margin={{ left: -10 }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="opacity-50"
                />

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  hide={!showXAxis}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                  interval={0}
                />

                <YAxis
                  tickFormatter={formatCompactCurrency}
                  tickLine={false}
                  axisLine={false}
                  width={72}
                />

                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />

                <Bar
                  dataKey="dineIn"
                  stackId="a"
                  fill={COLORS.dineIn}
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="digital" stackId="a" fill={COLORS.digital} />
                <Bar dataKey="takeaway" stackId="a" fill={COLORS.takeaway} />
                <Bar
                  dataKey="delivery"
                  stackId="a"
                  fill={COLORS.delivery}
                  radius={[0, 0, 4, 4]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
