import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from 'react-query';
import * as SecureStore from 'expo-secure-store';
import * as authApi from '../api/authApi';
import { User } from '@/types/User';
import axios from 'axios';
import { Alert } from 'react-native';
import { handleError } from '@/services/basic/axiosErrorHandler';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userName: string) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => void;
  isLoggedIn: () => boolean;
  user: User | null;
  isLoading: boolean;
  accessToken: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const queryClient = new QueryClient();

// Utility function for secure token management
const setToken = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

const getToken = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};

const removeToken = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const loadTokens = async () => {
      const storedAccessToken = await getToken('accessToken');
      const storedRefreshToken = await getToken('refreshToken');
      if (storedAccessToken && storedRefreshToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setIsAuthenticated(true);
      }
    };
    loadTokens();
  }, []);

  const loginMutation = useMutation(
    (credentials: { email: string; password: string }) =>
      authApi.login(credentials.email, credentials.password),
    {
      onSuccess: async (data) => {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        await setToken('accessToken', data.accessToken);
        await setToken('refreshToken', data.refreshToken);
        setIsAuthenticated(true);
        router.replace('/(authenticated)');
      },
      onError: (error) => {
        handleError(error);
      },
    },
  );

  const registerMutation = useMutation(
    (userData: { email: string; password: string; userName: string }) =>
      authApi.register(userData.email, userData.password, userData.userName),
    {
      onSuccess: async (data) => {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        await setToken('accessToken', data.accessToken);
        await setToken('refreshToken', data.refreshToken);
        setIsAuthenticated(true);
        router.replace('/(authenticated)');
      },
      onError: (error) => {
        handleError(error);
      },
    },
  );

  const refreshMutation = useMutation(() => authApi.refreshToken(accessToken!, refreshToken!), {
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      await setToken('accessToken', data.accessToken);
      await setToken('refreshToken', data.refreshToken);
    },
    onError: () => {
      logout();
    },
  });

  const { data: user } = useQuery<User>('currentUser', () => authApi.getCurrentUser(accessToken!), {
    enabled: !!accessToken,
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        refreshMutation.mutate();
      }
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string, userName: string) => {
    await registerMutation.mutateAsync({ email, password, userName });
  };

  const refresh = async () => {
    await refreshMutation.mutateAsync();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccessToken(null);
    setRefreshToken(null);
    removeToken('accessToken');
    removeToken('refreshToken');
    queryClient.clear();
    router.replace('/(auth)/login');
  };

  const isLoggedIn = () => {
    return isAuthenticated;
  };

  const isLoading = loginMutation.isLoading || registerMutation.isLoading;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        logout,
        isLoggedIn,
        user: user || null,
        isLoading,
        refresh,
        accessToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProviderWithQuery: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};
