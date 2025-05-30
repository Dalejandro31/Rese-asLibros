// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api';
import type { AuthResult } from '../types/Auth';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string;
  unique_name: string;
}

interface AuthContextType {
  token: string | null;
  userId: number | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
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
  const [username, setUsername] = useState<string | null>(() => {
    const t = localStorage.getItem('token');
    if (!t) return null;
    try {
      const { unique_name } = jwtDecode<TokenPayload>(t);
      return unique_name;
    } catch {
      return null;
    }
  });

  const login = async (user: string, password: string) => {
    const { data } = await api.post<AuthResult>('/auth/login', { username: user, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    const payload = jwtDecode<TokenPayload>(data.token);
    setUserId(Number(payload.sub));
    setUsername(payload.unique_name);
  };

  const register = async (user: string, email: string, password: string) => {
    const { data } = await api.post<AuthResult>('/auth/register', { username: user, email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    const payload = jwtDecode<TokenPayload>(data.token);
    setUserId(Number(payload.sub));
    setUsername(payload.unique_name);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserId(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      userId,
      username,
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