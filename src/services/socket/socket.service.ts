import { io, Socket } from 'socket.io-client';
import { SOCKET_CONFIG, SOCKET_NAMESPACES } from './socket.config';
import {
  ConnectionState,
  SocketEvent,
  SocketEventCallback,
} from './socket.types';
import { toast } from 'sonner';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private eventListeners: Map<string, Set<SocketEventCallback>> = new Map();
  private connectionAttempts: number = 0; // Track total connection attempts

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.connectionAttempts++;

    const url = SOCKET_CONFIG.url + SOCKET_NAMESPACES.EVENTS;

    this.socket = io(url, {
      autoConnect: false,
      transports: ['polling'],
      reconnection: true,
      reconnectionAttempts: SOCKET_CONFIG.reconnectionAttempts,
      reconnectionDelay: SOCKET_CONFIG.reconnectionDelay,
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    });

    this.setupCoreListeners();

    this.socket.connect();
  }

  /**
   * Setup core connection listeners with comprehensive debugging
   */
  private setupCoreListeners(): void {
    if (!this.socket) return;

    this.socket.on(SocketEvent.CONNECT, () => {
      this.connectionState = ConnectionState.CONNECTED;
    });

    this.socket.on(SocketEvent.DISCONNECT, (reason: string) => {
      this.connectionState = ConnectionState.DISCONNECTED;

      // Detailed disconnect reasons
      if (reason === 'io server disconnect') {
        toast.error(
          'Server initiated disconnect - may need to reconnect manually',
        );
      } else if (reason === 'transport close') {
        toast.error('Network connection lost - will auto-reconnect');
      }
    });

    this.socket.on(SocketEvent.CONNECT_ERROR, () => {
      this.connectionState = ConnectionState.ERROR;
    });

    this.socket.on(SocketEvent.RECONNECT_ATTEMPT, () => {
      this.connectionState = ConnectionState.RECONNECTING;
    });

    this.socket.io.on('reconnect', () => {
      this.connectionState = ConnectionState.CONNECTED;
    });

    this.socket.on(SocketEvent.RECONNECT_ERROR, () => {});

    this.socket.on(SocketEvent.RECONNECT_FAILED, () => {});

    this.socket.onAny(() => {});
  }

  /**
   * Register event listener with proper typing
   */
  on<T = unknown>(event: string, cb: (data: T) => void): void {
    if (!this.socket) {
      toast.error(
        `[SocketService] Cannot register '${event}': socket not initialized`,
      );
      return;
    }

    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }

    this.eventListeners.get(event)!.add(cb as SocketEventCallback);
    this.socket.on(event, cb as SocketEventCallback);
  }

  /**
   * Unregister event listener
   */
  off<T = unknown>(event: string, cb?: (data: T) => void): void {
    if (!this.socket) return;

    if (cb) {
      this.eventListeners.get(event)?.delete(cb as SocketEventCallback);
      this.socket.off(event, cb as SocketEventCallback);
    } else {
      this.eventListeners.delete(event);
      this.socket.off(event);
    }
  }

  /**
   * Emit event to server
   */
  emit<T = unknown>(event: string, data?: T): void {
    if (!this.socket?.connected) {
      console.warn('[SocketService] Cannot emit: not connected');
      return;
    }
    this.socket.emit(event, data);
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    if (!this.socket) return;

    this.socket.disconnect();
    this.socket = null;
    this.connectionState = ConnectionState.DISCONNECTED;
    this.eventListeners.clear();
  }

  getConnectionAttempts(): number {
    return this.connectionAttempts;
  }

  resetConnectionAttempts(): void {
    this.connectionAttempts = 0;
  }
}

export const socketService = SocketService.getInstance();
