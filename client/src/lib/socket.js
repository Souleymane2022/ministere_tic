import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/auth';

let socket = null;

export function getSocket() {
  const token = useAuthStore.getState().accessToken;
  if (!token) return null;

  if (!socket) {
    const socketUrl = import.meta.env.VITE_API_URL || '/';
    socket = io(socketUrl, {
      auth: { token },
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
