import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && useAuthStore.getState().refreshToken) {
      original._retry = true;
      try {
        refreshing = refreshing || axios.post(`${API_BASE}/auth/refresh`, {
          refreshToken: useAuthStore.getState().refreshToken,
        });
        const { data } = await refreshing;
        refreshing = null;
        useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        refreshing = null;
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
