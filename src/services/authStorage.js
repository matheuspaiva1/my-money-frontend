// Único módulo que toca localStorage — guarda apenas a sessão (token JWT +
// dados básicos do usuário devolvidos por POST /login), nunca dados de negócio.
const TOKEN_KEY = '@controle-horas:token'
const USER_KEY = '@controle-horas:user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
