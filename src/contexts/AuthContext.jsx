import { useCallback, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/authService'
import { clearSession, getStoredUser, getToken, setSession } from '../services/authStorage'
import { onUnauthorized } from '../services/api'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken())
  const [user, setUser] = useState(() => getStoredUser())

  // Se qualquer chamada à API responder 401, a sessão é derrubada aqui.
  useEffect(() => {
    return onUnauthorized(() => {
      setToken(null)
      setUser(null)
    })
  }, [])

  const login = useCallback(async ({ matricula, senha }) => {
    const { token: newToken, user: loggedUser } = await authService.login({ matricula, senha })
    setSession(newToken, loggedUser)
    setToken(newToken)
    setUser(loggedUser)
    return loggedUser
  }, [])

  const register = useCallback(async ({ nome, matricula, senha }) => {
    return authService.register({ nome, matricula, senha })
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
