import axios from 'axios';

// "/api" works in development (Vite proxy) and in production (Nginx proxy)
const api = axios.create({ baseURL: '/api' });

const TOKEN_KEY = 'softrate_admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Attach the JWT to every request when logged in
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is rejected on an admin call, log out and go to the login page
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    const isLoginCall = url.includes('/admin/login');
    if (err.response?.status === 401 && url.includes('/admin') && !isLoginCall) {
      clearToken();
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// Pulls a readable message out of an axios error
export const errorMessage = (err, fallback = 'Something went wrong. Please try again.') =>
  err.response?.data?.message || fallback;

export default api;
