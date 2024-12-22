import { User } from '@/types/User';
import { api } from './defaultApi';

export const login = async (email: string, password: string) => {
  const response = await api.post<{ accessToken: string; refreshToken: string }>('/Auth/login', {
    email,
    password,
  });
  return response.data;
};

export const register = async (email: string, password: string, userName: string) => {
  const response = await api.post<{ accessToken: string; refreshToken: string }>('/Auth/register', {
    email,
    password,
    userName,
  });
  return response.data;
};

export const refreshToken = async (accessToken: string, refreshToken: string) => {
  const response = await api.post<{ accessToken: string; refreshToken: string }>('/Auth/refresh', {
    accessToken,
    refreshToken,
  });
  return response.data;
};

export const getCurrentUser = async (accessToken: string): Promise<User> => {
  const response = await api.get<User>('/Auth/current-user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
