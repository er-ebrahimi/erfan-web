'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { clientEnv } from '@/env/client';

export interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  role: {
    id: number;
    name: string;
    description: string;
    type: string;
  };
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${clientEnv.NEXT_PUBLIC_API_URL}/api/auth/local`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.jwt);
        localStorage.setItem('auth_token', data.jwt);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error?.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        const response = await fetch(
          `${clientEnv.NEXT_PUBLIC_API_URL}/api/auth/local/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              email,
              password,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setToken(data.jwt);
          localStorage.setItem('auth_token', data.jwt);
          localStorage.setItem('auth_user', JSON.stringify(data.user));
          return { success: true };
        } else {
          return {
            success: false,
            error: data.error?.message || 'Registration failed',
          };
        }
      } catch (error) {
        return { success: false, error: 'Network error occurred' };
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }, []);

  const updateUser = useCallback(
    (userData: Partial<User>) => {
      setUser((prev) => (prev ? { ...prev, ...userData } : null));
      if (user) {
        localStorage.setItem(
          'auth_user',
          JSON.stringify({ ...user, ...userData })
        );
      }
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
