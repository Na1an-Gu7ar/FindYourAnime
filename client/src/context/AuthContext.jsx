import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, registerUser, updateCurrentUser } from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('auth-token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  const persistSession = useCallback((session) => {
    localStorage.setItem('auth-token', session.token);
    setToken(session.token);
    setUser(session.user);
  }, []);

  const register = useCallback(
    async (payload) => {
      const session = await registerUser(payload);
      persistSession(session);
      return session;
    },
    [persistSession]
  );

  const login = useCallback(
    async (payload) => {
      const session = await loginUser(payload);
      persistSession(session);
      return session;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('auth-token');
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const { user: nextUser } = await updateCurrentUser(payload);
    setUser(nextUser);
    return nextUser;
  }, []);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { user: nextUser } = await getCurrentUser();
        if (active) setUser(nextUser);
      } catch {
        if (active) logout();
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, [logout, token]);

  const value = useMemo(
    () => ({ isAuthenticated: Boolean(token), loading, login, logout, register, token, updateProfile, user }),
    [loading, login, logout, register, token, updateProfile, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
