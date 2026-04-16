import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../utils/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pt_user')); } catch { return null; }
  });

  const login = useCallback(async (username, password) => {
    const res = await api.login({ username, password });
    // Force role to Admin so all features are always visible
    const adminUser = { ...res.user, role: 'Admin' };
    localStorage.setItem('pt_token', res.token);
    localStorage.setItem('pt_user', JSON.stringify(adminUser));
    setUser(adminUser);
    return adminUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pt_token');
    localStorage.removeItem('pt_user');
    setUser(null);
  }, []);

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
