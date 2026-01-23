import { ItemReportTabConfig, ItemReportType } from '@/types/item-report.type';
import { BarChart3, Gift, Receipt, ListChecks } from 'lucide-react';

export const ITEM_REPORT_TABS: ItemReportTabConfig[] = [
  {
    id: 'sold-items',
    label: 'reports.itemReport.tabs.soldItems',
    description: 'reports.itemReport.tabs.soldItemsDesc',
    reportType: ItemReportType.SOLD_ITEMS_DETAILS,
    icon: BarChart3,
  },
  {
    id: 'complimentary',
    label: 'reports.itemReport.tabs.complementary',
    description: 'reports.itemReport.tabs.complementaryDesc',
    reportType: ItemReportType.COMPLEMENTARY_ITEMS,
    icon: Gift,
  },
  {
    id: 'kot-items',
    label: 'reports.itemReport.tabs.kotItems',
    description: 'reports.itemReport.tabs.kotItemsDesc',
    reportType: ItemReportType.KOT_ITEMS_REPORT,
    icon: Receipt,
  },
  {
    id: 'bill-details',
    label: 'reports.itemReport.tabs.billDetails',
    description: 'reports.itemReport.tabs.billDetailsDesc',
    reportType: ItemReportType.BILL_DETAILS_REPORT,
    icon: ListChecks,
  },
];

export const REPORT_TYPE_BUTTONS = [
  {
    type: ItemReportType.SOLD_ITEMS_DETAILS,
    translationKey: 'reports.itemReport.reportTypes.soldItems',
    icon: BarChart3,
  },
  {
    type: ItemReportType.COMPLEMENTARY_ITEMS,
    translationKey: 'reports.itemReport.reportTypes.complementary',
    icon: Gift,
  },
  {
    type: ItemReportType.KOT_ITEMS_REPORT,
    translationKey: 'reports.itemReport.reportTypes.kotItems',
    icon: Receipt,
  },
  {
    type: ItemReportType.BILL_DETAILS_REPORT,
    translationKey: 'reports.itemReport.reportTypes.billDetails',
    icon: ListChecks,
  },
  {
    type: ItemReportType.CONSOLIDATED_ITEM_REPORT,
    translationKey: 'reports.itemReport.reportTypes.consolidated',
    icon: BarChart3,
  },
] as const;

// Quality options
export const QUALITY_OPTIONS = [
  { value: 'premium', label: 'Premium' },
  { value: 'standard', label: 'Standard' },
  { value: 'economy', label: 'Economy' },
];

// Order Type options
export const ORDER_TYPE_OPTIONS = [
  { value: 'dine-in', label: 'Dine-in' },
  { value: 'takeaway', label: 'Takeaway' },
  { value: 'delivery', label: 'Delivery' },
];

// Status options
export const STATUS_OPTIONS = [
  { value: 'placed', label: 'Placed' },
  { value: 'settled', label: 'Settled' },
  { value: 'cancelled', label: 'Cancelled' },
];
