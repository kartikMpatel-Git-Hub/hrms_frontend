import { createContext, useContext, useState, type ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginService } from '../api/AuthenticationService';
import type { LoginRequest } from '../type/Types';

export interface User {
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  login: (credentials: LoginRequest) => Promise<User>; 
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    mutateAsync: loginMutateAsync,
    isPending: isAuthenticating,
  } = useMutation({
    mutationFn: LoginService, 
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['login'] });
      localStorage.setItem("token",res.token)
      setUser({ email: res.email, role: res.role });
      setAuthError(null);
    },
    onError: (err: any) => {
      console.log(err);
      const msg =
        err?.error?.details ||
        'Login failed. Please try again.';
      setAuthError(msg);
      setUser(null);
    },
  });

  const login = async (credentials: LoginRequest) => {
    setAuthError(null);
    const res = await loginMutateAsync(credentials);
    return { email: res.email, role: res.role } as User;
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token")
      console.log("logout...");
    } catch {
    }
    setUser(null);
    setAuthError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAuthenticating,
    authError,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
``