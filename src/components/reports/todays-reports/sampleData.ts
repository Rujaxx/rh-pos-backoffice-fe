// src/components/reports/todays-reports/sampleData.ts

import {
  SalesSummaryData,
  OrderTypeSummaryData,
  PaymentTypeSummaryData,
  BillSummaryData,
  ProductGroupSummaryData,
  KitchenDepartmentSummaryData,
  CategorySummaryData,
  SoldItemsSummaryData,
  DiscountSummaryData,
  ExpenseSummaryData,
  DeliveryBoySummaryData,
  WaiterSummaryData,
  CancelItemsSummaryData,
  WalletSummaryData,
  DuePaymentSummaryData,
  PaymentVarianceData,
  CurrencyDenominationData,
  OrderSourceData,
} from '@/types/todays-report.type';

export const sampleSalesSummary: SalesSummaryData = {
  netSale: 125000,
  totalTax: 15000,
  vat: 6250,
  totalSales: 140000,
  roundOff: 50,
  discount: 7500,
  charges: 1200,
  cancelledOrders: 3,
  pendingOrders: 8,
  deletedOrders: 2,
  duePayments: 4500,
};

export const sampleOrderTypeSummary: OrderTypeSummaryData[] = [
  {
    type: 'Dine In',
    orders: 45,
    charges: 1200,
    discount: 2500,
    netSale: 48000,
    grossSale: 51700,
  },
  {
    type: 'Pickup',
    orders: 32,
    charges: 800,
    discount: 1800,
    netSale: 32000,
    grossSale: 34600,
  },
  {
    type: 'Delivery',
    orders: 28,
    charges: 1400,
    discount: 3200,
    netSale: 35000,
    grossSale: 39600,
  },
];

export const samplePaymentTypeSummary: PaymentTypeSummaryData[] = [
  { method: 'Cash', count: 65, amount: 75000 },
  { method: 'Card', count: 25, amount: 35000 },
  { method: 'UPI', count: 15, amount: 30000 },
  { method: 'Wallet', count: 8, amount: 15000 },
  { method: 'Credit', count: 2, amount: 5000 },
];

export const sampleBillSummary: BillSummaryData[] = [
  {
    billNo: 'B1001',
    qty: 4,
    tax: 480,
    discount: 200,
    amount: 2800,
    status: 'Paid',
    payMode: 'Cash',
  },
  {
    billNo: 'B1002',
    qty: 2,
    tax: 240,
    discount: 100,
    amount: 1400,
    status: 'Paid',
    payMode: 'UPI',
  },
  {
    billNo: 'B1003',
    qty: 3,
    tax: 360,
    discount: 150,
    amount: 2100,
    status: 'Pending',
    payMode: 'Card',
  },
  {
    billNo: 'B1004',
    qty: 5,
    tax: 600,
    discount: 250,
    amount: 3500,
    status: 'Paid',
    payMode: 'Cash',
  },
  {
    billNo: 'B1005',
    qty: 2,
    tax: 240,
    discount: 100,
    amount: 1400,
    status: 'Cancelled',
    payMode: 'Wallet',
  },
];

export const sampleProductGroupSummary: ProductGroupSummaryData[] = [
  { productGroup: 'Beverages', amount: 12500, discount: 1250 },
  { productGroup: 'Appetizers', amount: 18500, discount: 1850 },
  { productGroup: 'Main Course', amount: 45000, discount: 4500 },
  { productGroup: 'Desserts', amount: 9500, discount: 950 },
];

export const sampleKitchenDepartmentSummary: KitchenDepartmentSummaryData[] = [
  { kitchen: 'Main Kitchen', soldItems: 95, amount: 65000 },
  { kitchen: 'Bar', soldItems: 45, amount: 18000 },
  { kitchen: 'Dessert Section', soldItems: 25, amount: 9500 },
];

export const sampleCategorySummary: CategorySummaryData[] = [
  { category: 'Vegetarian', soldItems: 95, amount: 32000 },
  { category: 'Non-Vegetarian', soldItems: 75, amount: 45000 },
  { category: 'Vegan', soldItems: 35, amount: 12000 },
];

export const sampleSoldItemsSummary: SoldItemsSummaryData[] = [
  { itemName: 'Chicken Biryani', quantity: 45, amount: 18000 },
  { itemName: 'Paneer Butter Masala', quantity: 38, amount: 15200 },
  { itemName: 'Coke', quantity: 65, amount: 3250 },
  { itemName: 'Chocolate Brownie', quantity: 28, amount: 5600 },
  { itemName: 'Garlic Naan', quantity: 42, amount: 6300 },
  { itemName: 'Mango Lassi', quantity: 35, amount: 5250 },
];

// Mock data for other sections not in your types yet
export const sampleDiscountSummary: DiscountSummaryData = {
  billDiscount: 4500,
  itemDiscount: 3000,
  totalDiscount: 7500,
};

export const sampleExpenseSummary: ExpenseSummaryData[] = [
  { category: 'Groceries', amount: 4500 },
  { category: 'Utilities', amount: 2500 },
  { category: 'Maintenance', amount: 1500 },
];

export const sampleDeliveryBoySummary: DeliveryBoySummaryData[] = [
  { name: 'John Doe', deliveries: 15, amount: 12000 },
  { name: 'Jane Smith', deliveries: 12, amount: 9500 },
  { name: 'Mike Johnson', deliveries: 8, amount: 6500 },
];

export const sampleWaiterSummary: WaiterSummaryData[] = [
  { name: 'Robert Brown', tables: 10, amount: 18000 },
  { name: 'Emily Davis', tables: 8, amount: 15000 },
  { name: 'David Wilson', tables: 6, amount: 12000 },
];

export const sampleCancelItemsSummary: CancelItemsSummaryData[] = [
  { itemName: 'Chicken Tikka', quantity: 3, amount: 1200 },
  { itemName: 'Garlic Naan', quantity: 5, amount: 750 },
  { itemName: 'Mango Lassi', quantity: 2, amount: 300 },
];

export const sampleWalletSummary: WalletSummaryData = {
  transactions: 25,
  totalAmount: 8500,
};

export const sampleDuePaymentReceivedSummary: DuePaymentSummaryData = {
  amount: 7500,
  count: 12,
};

export const sampleDuePaymentReceivableSummary: DuePaymentSummaryData = {
  amount: 12000,
  count: 8,
};

export const samplePaymentVarianceSummary: PaymentVarianceData[] = [
  { method: 'Cash', variance: 250 },
  { method: 'Card', variance: 150 },
  { method: 'UPI', variance: 100 },
];

export const sampleCurrencyDenominationsSummary: CurrencyDenominationData[] = [
  { denomination: '2000', count: 25, amount: 50000 },
  { denomination: '500', count: 45, amount: 22500 },
  { denomination: '200', count: 60, amount: 12000 },
  { denomination: '100', count: 85, amount: 8500 },
  { denomination: '50', count: 120, amount: 6000 },
  { denomination: '20', count: 200, amount: 4000 },
  { denomination: '10', count: 150, amount: 1500 },
];

export const sampleOrderSourceSummary: OrderSourceData[] = [
  { source: 'Quick-Bill', orders: 65, amount: 85000 },
  { source: 'Dine-in', orders: 25, amount: 32000 },
  { source: 'Takeaway', orders: 18, amount: 24000 },
  { source: 'Delivery', orders: 12, amount: 15000 },
];

export const sampleReportData = {
  salesSummary: sampleSalesSummary,
  orderTypeSummary: sampleOrderTypeSummary,
  paymentTypeSummary: samplePaymentTypeSummary,
  billSummary: sampleBillSummary,
  discountSummary: sampleDiscountSummary,
  expenseSummary: sampleExpenseSummary,
  deliveryBoySummary: sampleDeliveryBoySummary,
  waiterSummary: sampleWaiterSummary,
  productGroupSummary: sampleProductGroupSummary,
  kitchenDepartmentSummary: sampleKitchenDepartmentSummary,
  categorySummary: sampleCategorySummary,
  soldItemsSummary: sampleSoldItemsSummary,
  cancelItemsSummary: sampleCancelItemsSummary,
  walletSummary: sampleWalletSummary,
  duePaymentReceivedSummary: sampleDuePaymentReceivedSummary,
  duePaymentReceivableSummary: sampleDuePaymentReceivableSummary,
  paymentVarianceSummary: samplePaymentVarianceSummary,
  currencyDenominationsSummary: sampleCurrencyDenominationsSummary,
  orderSourceSummary: sampleOrderSourceSummary,
};
