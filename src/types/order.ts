export interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  externalOrderId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo?: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'pay_later' | 'paytm' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'new' | 'active' | 'fulfilled' | 'cancelled';
  deliveryType: 'pickup' | 'delivery';
  deliveryBoy?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  brandId?: string;
  platform: 'uber_eats' | 'zomato' | 'swiggy' | 'website';
  platformStore?: string;
  orderLater: boolean;
  orderStatus?:
    | 'acknowledged'
    | 'food_ready'
    | 'dispatched'
    | 'fulfilled'
    | 'cancelled';
}
