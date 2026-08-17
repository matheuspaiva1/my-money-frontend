import axios from 'axios'
import { clearSession, getToken } from './authStorage'

// Em dev as chamadas passam pelo proxy do Vite (mesma origem, sem CORS).
// Em produção usamos a URL real configurada em VITE_API_URL.
const baseURL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Assinantes notificados quando a sessão expira/é invalidada (401), para que
// o AuthContext possa limpar o estado em memória sem acoplamento circular.
const unauthorizedListeners = new Set()

export function onUnauthorized(listener) {
  unauthorizedListeners.add(listener)
  return () => unauthorizedListeners.delete(listener)
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession()
      unauthorizedListeners.forEach((listener) => listener())
    }
    return Promise.reject(error)
  },
)

/** Extrai a mensagem de erro no formato `{ message }` que a API sempre devolve. */
export function getApiErrorMessage(error, fallback = 'Não foi possível completar a ação. Tente novamente.') {
  return error?.response?.data?.message || fallback
}
