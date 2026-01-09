'use client';

import Layout from '@/components/common/layout';
import { FilterBar } from '@/components/dashboard/live-order-tracking/filter-bar';
import { LiveOrderSection } from '@/components/dashboard/live-order-tracking/live-order-section';
import { liveStats, liveOrders, liveKots } from '@/mock/live-orders.mock';

export default function DashboardPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <FilterBar />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 items-start">
          {liveStats.map((stat) => {
            const sourceOrders =
              stat.id === 'kot'
                ? liveKots
                : liveOrders.filter((o) => o.type === stat.type);

            const totalOrders = sourceOrders.length;
            const runningOrders = sourceOrders.filter(
              (o) => o.status === 'Running',
            ).length;
            const revenue = sourceOrders.reduce(
              (acc, o) => acc + (o.amount || 0),
              0,
            );

            const calculatedStats = {
              ...stat,
              totalOrders,
              runningOrders,
              revenue,
              items: totalOrders,
            };

            return (
              <LiveOrderSection
                key={stat.id}
                stats={calculatedStats}
                orders={
                  stat.id === 'kot'
                    ? []
                    : sourceOrders.filter((o) => o.status === 'Running')
                }
                className="border-b-2 border-dashed border-gray-200 pb-8 mb-8 last:border-0 last:pb-0 last:mb-0 lg:border-none lg:pb-0 lg:mb-0 dark:border-gray-700"
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
