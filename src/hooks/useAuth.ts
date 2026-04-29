import { useState, useCallback } from 'react';
import { authService } from '../services/authService';

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone_number?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}

interface UseAuthReturn {
  customer: Customer | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation?: string;
    phone_number?: string;
    address?: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Customer>) => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [customer, setCustomer] = useState<Customer | null>(
    authService.getStoredCustomer()
  );
  const [token, setToken] = useState<string | null>(authService.getToken());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      password_confirmation?: string;
      phone_number?: string;
      address?: string;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await authService.register(data);
        setToken(result.token);
        setCustomer(result.customer);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.login(email, password);
      setToken(result.token);
      setCustomer(result.customer);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setCustomer(null);
    setToken(null);
    setError(null);
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<Customer>) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await authService.updateProfile(data);
        setCustomer(result.customer);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Update failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  return {
    customer,
    token,
    isLoading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated,
  };
};
