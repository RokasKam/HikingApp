import { Hike } from '@/types/Hike';
import { api } from './defaultApi';
import { HikeWithRoutes } from '@/types/HikeWithRoutes';
import { RouteWithPoints } from '@/types/RouteWithPoints';
import { HikeRequest } from '@/types/HikeRequest';
import { RouteRequest } from '@/types/RouteRequest';
import { PointRequest } from '@/types/PointRequest';

export const getHikes = async (accessToken: string): Promise<Hike[]> => {
  const response = await api.get<Hike[]>('/Hikes', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const getUserHikes = async (accessToken: string): Promise<Hike[]> => {
  const response = await api.get<Hike[]>('/Hikes/creator-hikes', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const getHikeWithRoutes = async (accessToken: string, hikeId: string): Promise<HikeWithRoutes> => {
  const response = await api.get<HikeWithRoutes>(`/Hikes/${hikeId}/Routes`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const postHike = async (accessToken: string, hikeRequest: HikeRequest) => {
  const response = await api.post('/Hikes', hikeRequest, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const updateHike = async (accessToken: string, hikeId: string, hikeRequest: HikeRequest) => {
  const response = await api.put(`/Hikes/${hikeId}`, hikeRequest, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const deleteHike = async (accessToken: string, hikeId: string) => {
  const response = await api.delete(`/Hikes/${hikeId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const getRouteWithPoints = async (accessToken: string, routeId: string): Promise<RouteWithPoints> => {
  const response = await api.get<RouteWithPoints>(`/Routes/${routeId}/Points`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const postRoute = async (accessToken: string, routeRequest: RouteRequest) => {
  const response = await api.post('/Routes', routeRequest, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const updateRoute = async (accessToken: string, routeId: string, routeRequest: RouteRequest) => {
  const response = await api.put(`/Routes/${routeId}`, routeRequest, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const deleleRoute = async (accessToken: string, routeId: string) => {
  const response = await api.delete(`/Routes/${routeId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const postPoint = async (accessToken: string, pointRequest: PointRequest) => {
  const response = await api.post('/Points', pointRequest, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const updatePoint = async (accessToken: string, pointId: string, pointRequest: PointRequest) => {
  const response = await api.put(`/Points/${pointId}`, pointRequest, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const deletePoint = async (accessToken: string, pointId: string) => {
  const response = await api.delete(`/Points/${pointId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};