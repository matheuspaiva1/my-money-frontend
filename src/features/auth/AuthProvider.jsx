import { useCallback, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as authService from '../../services/authService';
import { TOKEN_KEY, USER_KEY } from '../../services/http';
import { AuthContext } from './authContext';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return !exp || exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    return isTokenValid(stored) ? stored : null;
  });
  const [user, setUser] = useState(() =>
    isTokenValid(localStorage.getItem(TOKEN_KEY)) ? readStoredUser() : null,
  );

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // O JWT expira em 1 dia (sem refresh token): agenda o logout automático
  // para o instante exato da expiração, além da checagem feita no mount.
  useEffect(() => {
    if (!token) return undefined;
    try {
      const { exp } = jwtDecode(token);
      if (!exp) return undefined;
      const msUntilExpiry = exp * 1000 - Date.now();
      // Sempre agenda via setTimeout (mesmo já expirado) em vez de chamar
      // clearSession() direto no corpo do efeito, evitando cascading renders.
      const timer = setTimeout(clearSession, Math.max(msUntilExpiry, 0));
      return () => clearTimeout(timer);
    } catch {
      const timer = setTimeout(clearSession, 0);
      return () => clearTimeout(timer);
    }
  }, [token, clearSession]);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => authService.register(payload), []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, register, logout }),
    [token, user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
