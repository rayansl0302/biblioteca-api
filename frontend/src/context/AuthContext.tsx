import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import * as authService from '../services/authService';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'biblioteca_token';
const USER_KEY = 'biblioteca_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const { token, user: loggedUser } = await authService.login(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return ctx;
}
