import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginService } from '../api/AuthenticationService';
import type { LoginRequest } from '../type/Types';

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isInitializing: boolean;
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
  const [isInitializing, setIsInitializing] = useState(true);
  const queryClient = useQueryClient();

  const {
    mutateAsync: loginMutateAsync,
    isPending: isAuthenticating,
  } = useMutation({
    mutationFn: LoginService, 
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['login'] });
      localStorage.setItem("token", res.token);
      const userData = { id: res.id, email: res.email, role: res.role };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setAuthError(null);
    },
    onError: (err: any) => {
      // console.log(err);
      const msg =
        err?.error?.details ||
        'Login failed. Please try again.';
      setAuthError(msg);
      setUser(null);
    },
  });

  // Check for existing token on component mount
  useEffect(() => {
    const checkExistingToken = () => {
      const token = localStorage.getItem("token");
      const userJson = localStorage.getItem("user");
      
      if (token && userJson) {
        try {
          const userData = JSON.parse(userJson);
          setUser(userData);
        } catch (error) {
          // console.error("Failed to parse user data from localStorage:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setIsInitializing(false);
    };

    checkExistingToken();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setAuthError(null);
    const res = await loginMutateAsync(credentials);
    return { id: res.id, email: res.email, role: res.role } as User;
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // console.log("logout...");
    } catch {
    }
    setUser(null);
    setAuthError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAuthenticating,
    isInitializing,
    authError,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
``