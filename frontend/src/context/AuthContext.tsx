'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, setToken as setLocalToken, removeToken as removeLocalToken } from '@/lib/auth-utils';
import { jwtDecode } from 'jwt-decode';
import { userApi } from '@/lib/api';

export type Role = 'USER' | 'SUPPORT_AGENT' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          // Verify token is not expired
          const decoded: any = jwtDecode(storedToken);
          if (decoded.exp * 1000 < Date.now()) {
            removeLocalToken();
            setToken(null);
            setUser(null);
          } else {
            setToken(storedToken);
            try {
              const res = await userApi.getProfile();
              setUser(res.data);
            } catch (err) {
              console.error("Failed to fetch user profile", err);
            }
          }
        } catch (e) {
          removeLocalToken();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, userData: User) => {
    setLocalToken(newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    removeLocalToken();
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
