export interface OrderSummary {
  orderId: string;
  orderNumber: string;
  orderFrom: string; // POS, Online, WhatsApp, Phone
  customerName: string;
  amount: number;
  tax: number;
  discount: number;
  netAmount: number;
  orderDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: string;
  restaurantName: string;
}

export interface OrderTypeStats {
  orderFrom: string;
  orderCount: number;
  totalAmount: number;
  averageAmount: number;
  percentage: number;
  lastOrderDate: string;
}

export interface OrderTypeData {
  id: string;
  orderFrom: string;
  orderCount: number;
  totalAmount: number;
  fulfilled?: number;
  running?: number;
  free?: number;
  cancelled?: number;
  status?: 'Active' | 'Inactive' | 'Pending';
}
