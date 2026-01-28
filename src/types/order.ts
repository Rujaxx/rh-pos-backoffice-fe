import { MultilingualText } from './common/common.type';

// Order Status Enum matching actual backend values (UPPERCASE)
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FOOD_READY = 'FOOD_READY',
  DISPATCHED = 'DISPATCHED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  RUNNING = 'RUNNING',
  ACTIVE = 'ACTIVE',
}

// Payment Status Enum matching actual backend values (UPPERCASE)
export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  REFUNDED = 'REFUNDED',
}

// Bill/Order Status Enum
export enum BillStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

// Nested DTOs from backend
export interface MenuInfo {
  _id: string;
  name: MultilingualText;
  shortCode: string;
  isActive: boolean;
}

export interface OrderTypeInfo {
  _id: string;
  name: MultilingualText;
  isActive: boolean;
}

export interface RestaurantInfo {
  _id: string;
  name: MultilingualText;
  restoCode?: string;
  isActive: boolean;
}

// Order Item Response (updated to match BillItem)
export interface OrderItemResponse {
  menuItemId: string;
  name: MultilingualText;
  quantity: number;
  price: number;
  taxAmount: number;
  discountAmount: number;
  notes?: string;
}

// Payment Response
export interface PaymentResponse {
  method: string;
  amount: number;
  paymentDate: Date;
}

// Main Order/Bill List Item (matching actual API response)
export interface OrderListItem {
  _id: string;
  billNumber?: string;
  orderNumber: string;
  orderTypeId: string;
  menuId: string;
  tableId?: string;
  waiterId?: string;
  waiterName?: string;
  customerName?: string;
  customerPhone?: string;
  customerId: string;
  restaurantId: string;
  brandId: string;
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  packagingCharges: number;
  totalAmount: number;
  amountPaid: number;
  status: string; // Order/Bill status (PENDING, ACTIVE, COMPLETED, CANCELLED)
  paymentStatus: string; // Payment status (UNPAID, PENDING, PAID, etc.)
  payments: PaymentResponse[];
  items: OrderItemResponse[];
  closedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;

  // Optional populated fields (from populate)
  restaurantDoc?: RestaurantInfo;
  menuDoc?: MenuInfo;
  orderTypeDoc?: OrderTypeInfo;

  platform?: string;
  deliveryBoy?: string;
  countryCode?: string;
  deliveryTip?: number;
  orderNote?: string;
}

// Legacy Order type alias for backward compatibility
export type Order = OrderListItem;

export interface OrderFilterParams {
  // Date range
  from?: string;
  to?: string;

  // Restaurant filter
  restaurantIds?: string[];

  // Advanced filters
  search?: string;
  externalOrderId?: string;
  platform?: string;
  orderLater?: boolean;

  // Any other filters
  [key: string]: unknown;
}

// Update Order DTO for PATCH requests
export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  deliveryBoy?: string;
  orderNote?: string;
}
