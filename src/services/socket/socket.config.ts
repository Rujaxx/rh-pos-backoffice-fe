import { SocketServiceConfig } from './socket.types';

// Socket.IO Configuration - Matches test client setup
export const SOCKET_CONFIG: SocketServiceConfig = {
  url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000',
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
};

// Socket enabled flag
export const SOCKET_ENABLED =
  process.env.NEXT_PUBLIC_SOCKET_ENABLED === 'true' || false;

// Socket namespaces
export const SOCKET_NAMESPACES = {
  ORDERS: '/orders',
  NOTIFICATIONS: '/notifications',
  EVENTS: '/events',
} as const;
