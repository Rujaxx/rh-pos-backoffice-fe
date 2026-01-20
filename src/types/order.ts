import { MultilingualText } from './common/common.type';

// Order Status Enum matching actual backend values (UPPERCASE)
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FOOD_READY = 'FOOD_READY',
  DISPATCHED = 'DISPATCHED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
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
  isActive?: boolean;
}

// Order Item from backend response
export interface OrderItemResponse {
  _id: string;
  menuItemId: string;
  name: MultilingualText;
  quantity: number;
  unitPrice: number;
  price: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

// Payment Response from backend
export interface PaymentResponse {
  _id: string;
  paymentMethod: string;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
}

// Main Order List Item matching OrderListResponseDto
export interface OrderListItem {
  _id: string;
  orderNumber: string;
  brandId: string;
  restaurantId: string;
  restaurantDoc?: RestaurantInfo;
  customerId?: string;
  menuId: string;
  menuDoc?: MenuInfo;
  orderTypeId: string;
  orderTypeDoc?: OrderTypeInfo;
  tableId?: string;
  customerName?: string;
  countryCode?: string;
  customerPhone?: string;
  items: OrderItemResponse[];
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryTip: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  payments: PaymentResponse[];
  orderStatus: OrderStatus;
  orderNote?: string;
  platform: string;
  deliveryBoy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// export interface Order extends OrderListItem {}
