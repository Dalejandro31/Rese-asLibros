// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext} from 'react';
import type { ReactNode } from 'react';
import { api } from '../api';
import type { AuthResult } from '../types/Auth';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string;
}

interface AuthContextType {
  token:           string | null;
  userId:          number | null;
  isAuthenticated: boolean;
  login:    (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout:   () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token,  setToken]  = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<number | null>(() => {
    const t = localStorage.getItem('token');
    if (!t) return null;
    try {
      const payload = jwtDecode<TokenPayload>(t);
      return Number(payload.sub);
    } catch {
      return null;
    }
  });

  const login = async (username: string, password: string) => {
    const { data } = await api.post<AuthResult>('/auth/login', { username, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    const payload = jwtDecode<TokenPayload>(data.token);
    setUserId(Number(payload.sub));
  };

  const register = async (username: string, email: string, password: string) => {
    const { data } = await api.post<AuthResult>('/auth/register', { username, email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    const payload = jwtDecode<TokenPayload>(data.token);
    setUserId(Number(payload.sub));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      userId,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};