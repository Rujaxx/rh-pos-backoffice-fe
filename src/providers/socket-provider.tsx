'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '@/services/socket/socket.service';
import { getToken } from '@/services/auth.service';
import { ConnectionState, SocketEvent } from '@/services/socket/socket.types';
import { toast } from 'sonner';

interface SocketContextValue {
  connectionState: ConnectionState;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

/**
 * Play error sound
 */
const playErrorSound = () => {
  try {
    const audio = new Audio('/sounds/error.mp3');
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.warn('Failed to play error sound:', err);
    });
  } catch (error) {
    console.warn('Error sound not available:', error);
  }
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.DISCONNECTED,
  );
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    // Connect on mount (after login)
    const token = getToken();
    if (!token) {
      console.warn('[SocketProvider] No token, skipping connection');
      return;
    }

    socketService.connect(token);

    // Setup global connection listeners
    const handleConnect = () => {
      setConnectionState(ConnectionState.CONNECTED);
      setErrorCount(0); // Reset error count on successful connection
      toast.success('Connected to server', {
        duration: 2000,
        id: 'socket-connected',
      });
    };

    const handleDisconnect = (reason: string) => {
      console.warn(`[SocketProvider] Disconnected: ${reason}`);
      setConnectionState(ConnectionState.DISCONNECTED);
    };

    const handleError = (error: Error) => {
      setConnectionState(ConnectionState.ERROR);
      setErrorCount((prev) => prev + 1);

      // Play error sound (only for first few errors to avoid spam)
      if (errorCount < 3) {
        playErrorSound();
      }

      // Show error toast with details
      toast.error('Socket connection error', {
        description: error.message || 'Failed to connect to server',
        duration: 5000,
        id: 'socket-error',
      });
    };

    const handleReconnecting = (attemptNumber: number) => {
      setConnectionState(ConnectionState.RECONNECTING);

      // Show reconnecting toast
      toast.loading('Reconnecting to server...', {
        duration: Infinity,
        id: 'socket-reconnecting',
      });
    };

    const handleReconnectFailed = () => {
      toast.error('Connection failed', {
        description:
          'Unable to connect to server. Please check your internet connection.',
        duration: 10000,
        id: 'socket-reconnect-failed',
      });
      playErrorSound();
    };

    socketService.on(SocketEvent.CONNECT, handleConnect);
    socketService.on(SocketEvent.DISCONNECT, handleDisconnect);
    socketService.on(SocketEvent.CONNECT_ERROR, handleError);
    socketService.on(SocketEvent.RECONNECT_ATTEMPT, handleReconnecting);
    socketService.on(SocketEvent.RECONNECT_FAILED, handleReconnectFailed);

    // IMPORTANT: NO cleanup! Socket stays connected
    return () => {
      // Only remove listeners, DON'T disconnect
      socketService.off(SocketEvent.CONNECT, handleConnect);
      socketService.off(SocketEvent.DISCONNECT, handleDisconnect);
      socketService.off(SocketEvent.CONNECT_ERROR, handleError);
      socketService.off(SocketEvent.RECONNECT_ATTEMPT, handleReconnecting);
      socketService.off(SocketEvent.RECONNECT_FAILED, handleReconnectFailed);
    };
  }, []);

  const value: SocketContextValue = {
    connectionState,
    isConnected: connectionState === ConnectionState.CONNECTED,
    connect: () => {
      const token = getToken();
      if (token) {
        socketService.connect(token);
      }
    },
    disconnect: () => {
      socketService.disconnect();
    },
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
}
