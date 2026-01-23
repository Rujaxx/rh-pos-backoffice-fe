import { FileText, Package } from 'lucide-react';

export const REPORT_TYPE_BUTTONS = [
  {
    type: 'DISCOUNT_SUMMARY',
    icon: FileText,
    translationKey: 'reports.discount.summaryReport',
  },
  {
    type: 'DISCOUNT_ITEM_WISE',
    icon: Package,
    translationKey: 'reports.discount.itemWiseReport',
  },
] as const;
