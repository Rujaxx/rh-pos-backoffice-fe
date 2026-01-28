export enum SocketEvent {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_ERROR = 'connect_error',
  RECONNECT = 'reconnect',
  RECONNECT_ATTEMPT = 'reconnect_attempt',
  RECONNECT_ERROR = 'reconnect_error',
  RECONNECT_FAILED = 'reconnect_failed',

  // Backend event - simplified (new)
  NEW_ORDER = 'newOrder',
  POS_ORDER_UPDATE = 'posOrderUpdate',
}

// Order Actions
export enum OrderAction {
  CREATED = 'created',
  UPDATED = 'updated',
  STATUS_CHANGED = 'status_changed',
  CANCELLED = 'cancelled',
  PAYMENT_UPDATED = 'payment_updated',
}

// Connection State
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

// Event Payloads
export interface NewOrderPayload {
  orderId: string; // Backend sends just the order ID
}

export interface OrderEventPayload {
  orderId: string;
  orderNumber: string;
  action: OrderAction;
  data?: unknown;
  timestamp: string;
  restaurantId?: string;
  brandId?: string;
}

export interface OrderStatusChangedPayload {
  orderId: string;
  orderNumber: string;
  oldStatus: string;
  newStatus: string;
  updatedBy?: string;
  timestamp: string;
}

export interface PaymentEventPayload {
  orderId: string;
  orderNumber: string;
  paymentStatus: string;
  amount: number;
  method: string;
  timestamp: string;
}

export interface SubscribeOrdersPayload {
  restaurantId?: string;
  brandId?: string;
  orderTypeId?: string;
}

// Socket Service Types
export interface SocketServiceConfig {
  url: string;
  path?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  reconnectionDelayMax?: number;
  timeout?: number;
}

export type SocketEventCallback<T = unknown> = (data: T) => void;

export interface SocketEventMap {
  [SocketEvent.CONNECT]: () => void;
  [SocketEvent.DISCONNECT]: (reason: string) => void;
  [SocketEvent.CONNECT_ERROR]: (error: Error) => void;
  [SocketEvent.RECONNECT]: (attemptNumber: number) => void;
  [SocketEvent.RECONNECT_ATTEMPT]: (attemptNumber: number) => void;
  [SocketEvent.RECONNECT_ERROR]: (error: Error) => void;
  [SocketEvent.RECONNECT_FAILED]: () => void;
  [SocketEvent.NEW_ORDER]: (orderId: string) => void;
}
