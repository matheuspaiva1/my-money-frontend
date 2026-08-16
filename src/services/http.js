import axios from 'axios';

export const TOKEN_KEY = '@my-money:token';
export const USER_KEY = '@my-money:user';

// Rotas que não exigem Authorization e cujo 401 é erro de credenciais
// (não deve disparar logout automático).
const PUBLIC_ENDPOINTS = ['/users', '/login'];

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ENDPOINTS.includes(config.url);
  if (!isPublic) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isPublic = PUBLIC_ENDPOINTS.includes(error.config?.url);

    // Token ausente/expirado em rota autenticada: logout automático + volta pro login.
    if (status === 401 && !isPublic) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);

export default http;
