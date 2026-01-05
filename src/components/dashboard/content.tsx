'use client';

import { useState, useEffect } from 'react';
import { ChartConfig } from '@/components/ui/chart';

import { useTranslation } from '@/hooks/useTranslation';
import {
  kpis,
  orderTypesData,
  paymentStatistics,
  revenueData,
  taxData,
} from '@/mock/chart.data.mock';
import { KpiCard } from './kpi-card';
import { PaymentStatistics } from './payment-stat-list';
import { RevenueChartCard } from './revenue-chart-card';

import { Button } from '../ui/button';
import { ChefHat, TrendingUp, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DashboardContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showXAxis, setShowXAxis] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setShowXAxis(window.matchMedia('(min-width: 1024px)').matches);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const revenueChartConfig = {
    dineIn: {
      label: 'Dine In',
      theme: {
        light: 'hsl(270 70% 55%)',
        dark: 'hsl(270 70% 65%)',
      },
    },
    digital: {
      label: 'Digital Order',
      theme: {
        light: 'hsl(190 85% 45%)',
        dark: 'hsl(190 85% 55%)',
      },
    },
    takeaway: {
      label: 'Pickup',
      theme: {
        light: 'hsl(35 85% 55%)',
        dark: 'hsl(35 85% 65%)',
      },
    },
    delivery: {
      label: 'Delivery',
      theme: {
        light: 'hsl(215 90% 55%)',
        dark: 'hsl(215 90% 65%)',
      },
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/menu-management/menu')}
        >
          <ChefHat className="mr-2 h-4 w-4" />
          {t('dashboard.manageMenu')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/employees/all')}
        >
          <Users className="mr-2 h-4 w-4" />
          {t('dashboard.viewStaff')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/taxgroup/tax-product-group')}
        >
          <Users className="mr-2 h-4 w-4" />
          {t('dashboard.manageTaxGroup')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/reports/sales-reports')}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          {t('dashboard.viewReports')}
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('dashboard.salesSummary')}</h2>
      </div>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} kpi={kpi} t={t} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <PaymentStatistics data={paymentStatistics} t={t} />
      </section>

      <RevenueChartCard data={revenueData} config={revenueChartConfig} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {t('dashboard.orderTypeSummary')}
        </h2>
      </div>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {orderTypesData.map((item) => (
          <KpiCard key={item.title} kpi={item} t={t} />
        ))}
      </section>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('dashboard.taxSummary')}</h2>
      </div>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {taxData.map((item) => (
          <KpiCard key={item.title} kpi={item} t={t} />
        ))}
      </section>
    </div>
  );
}
