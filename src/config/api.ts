import axios from 'axios';
import config from './constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 401 refresh queue ---

type QueueEntry = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueEntry[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

// --- Request interceptor: inject Authorization ---

api.interceptors.request.use((axiosConfig) => {
  const token = localStorage.getItem(config.STORAGE.ACCESS_TOKEN);
  if (token) {
    axiosConfig.headers.Authorization = `Bearer ${token}`;
  }
  return axiosConfig;
});

// --- Response interceptor: handle 401 ---

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    // Refresh endpoint itself returned 401 → give up
    if (originalRequest?.url?.includes('/login/token/refresh')) {
      Object.values(config.STORAGE).forEach((key) => localStorage.removeItem(key));
      window.location.href = config.API.AUTHORIZATION_URL + '/login?redirect_url=' + encodeURIComponent(window.location.origin + config.CALLBACK);
      return Promise.reject(error);
    }

    // Another refresh is already in progress → queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (originalRequest?.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest!);
      });
    }

    originalRequest!._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem(config.STORAGE.REFRESH_TOKEN);
      if (!refreshToken) throw new Error('Refresh token not found');

      // Use raw axios to avoid interceptor loop
      const { data } = await axios.post<{
        access_token: string;
        refresh_token: string;
        email: string;
        user: string;
      }>(
        `${config.API.AUTHORIZATION_URL}/login/token/refresh`,
        { refresh_token: refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );

      localStorage.setItem(config.STORAGE.ACCESS_TOKEN, data.access_token);
      localStorage.setItem(config.STORAGE.REFRESH_TOKEN, data.refresh_token);
      localStorage.setItem(config.STORAGE.USER_EMAIL, data.email);
      localStorage.setItem(config.STORAGE.USER_FULLNAME, data.user);

      processQueue(null, data.access_token);

      if (originalRequest?.headers) {
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
      }
      return api(originalRequest!);
    } catch (refreshError) {
      processQueue(refreshError, null);
      Object.values(config.STORAGE).forEach((key) => localStorage.removeItem(key));
      window.location.href = config.API.AUTHORIZATION_URL + '/login?redirect_url=' + encodeURIComponent(window.location.origin + config.CALLBACK);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;

