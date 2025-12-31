import { MealTimeReportType } from '@/types/meal-time-report.type';
import { FileText, BarChart, PieChart } from 'lucide-react';

export const MEAL_TIME_REPORT_TYPE_LABELS: Record<MealTimeReportType, string> =
  {
    [MealTimeReportType.MEAL_TIME_SALES]:
      'reports.mealTime.reportTypes.mealTimeSales',
    [MealTimeReportType.MEAL_TIME_DETAILED]:
      'reports.mealTime.reportTypes.mealTimeDetailed',
  };

export const MEAL_TIME_REPORT_BUTTONS = [
  {
    type: MealTimeReportType.MEAL_TIME_SALES,
    icon: FileText,
    translationKey: 'reports.mealTime.reportTypes.mealTimeSales',
  },
  {
    type: MealTimeReportType.MEAL_TIME_DETAILED,
    icon: BarChart,
    translationKey: 'reports.mealTime.reportTypes.mealTimeDetailed',
  },
];
