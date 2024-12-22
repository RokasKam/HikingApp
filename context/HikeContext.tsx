import React, { createContext, useContext, useState } from 'react';
import { useMutation, useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Hike } from '@/types/Hike';
import * as hikeApi from '../api/hikeApi';
import { HikeWithRoutes } from '@/types/HikeWithRoutes';
import { RouteWithPoints } from '@/types/RouteWithPoints';
import { HikeRequest } from '@/types/HikeRequest';
import { handleError } from '@/services/basic/axiosErrorHandler';
import { router } from 'expo-router';
import { RouteRequest } from '@/types/RouteRequest';
import { PointRequest } from '@/types/PointRequest';

interface HikesContextType {
  hikes: UseQueryResult<Hike[], Error>;
  hikeWithRoutes: UseQueryResult<HikeWithRoutes, Error>;
  setHikeId: (id: string) => void;
  routeWithPoints: UseQueryResult<RouteWithPoints, Error>;
  setRouteId: (id: string) => void;
  userHikes: UseQueryResult<Hike[], Error>;
  postHike: (hikeRequest: HikeRequest) => Promise<void>;
  updateHike: (hikeRequest: HikeRequest, hikeId: string) => Promise<void>;
  deleteHike: (hikeId: string) => Promise<void>;
  postRoute: (routeRequest: RouteRequest) => Promise<void>;
  updateRoute: (routeRequest: RouteRequest, routeId: string) => Promise<void>;
  deleteRoute: (routeId: string) => Promise<void>;
  hikeId: string | null;
  postPoint: (pointRequest: PointRequest) => Promise<void>;
  updatePoint: (pointRequest: PointRequest, pointId: string) => Promise<void>;
  deletePoint: (pointId: string) => Promise<void>;
  routeId: string | null;
}

const HikesContext = createContext<HikesContextType | undefined>(undefined);

export const useHikes = () => {
  const context = useContext(HikesContext);
  if (!context) {
    throw new Error('useHikes must be used within a HikesProvider');
  }
  return context;
};

export const HikesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const { accessToken, refresh } = useAuth();
  const [hikeId, setHikeId] = useState<string | null>(null);
  const [routeId, setRouteId] = useState<string | null>(null);
  
  const hikes = useQuery<Hike[], Error>(
    'hikes', 
    () => hikeApi.getHikes(accessToken!), 
    {
      enabled: !!accessToken,
      retry: false,
      onError: async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refresh();
          hikes.refetch();
        }
      }
    }
  );

  const userHikes = useQuery<Hike[], Error>(
    'userHikes', 
    () => hikeApi.getUserHikes(accessToken!), 
    {
      enabled: !!accessToken,
      retry: false,
      onError: async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refresh();
          hikes.refetch();
        }
      }
    }
  );

  const hikeWithRoutes = useQuery<HikeWithRoutes, Error>(
    ['hikeWithRoutes', hikeId], 
    () => hikeApi.getHikeWithRoutes(accessToken!, hikeId!),
    {
      enabled: !!accessToken && !!hikeId,
      retry: false,
      onError: async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refresh();
          hikeWithRoutes.refetch();
        }
      },
    }
  );

  const postHikeMutation = useMutation(
    (data: { hikeRequest: HikeRequest; }) =>
      hikeApi.postHike(accessToken!, data.hikeRequest),
    {
      onSuccess: async () => {
        router.back();
        hikes.refetch();
        userHikes.refetch();
        if (hikeId) {
          hikeWithRoutes.refetch();
        }
      },
      onError: async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refresh();
          postHikeMutation.mutate(postHikeMutation.variables!);
        } else {
          handleError(error);
        }
      },
    },
  );

  const updateHikeMutation = useMutation(
    (data: { hikeRequest: HikeRequest; hikeId: string; }) =>
      hikeApi.updateHike(accessToken!, data.hikeId, data.hikeRequest),
    {
      onSuccess: async () => {
        router.back();
        hikes.refetch();
        userHikes.refetch();
        if (hikeId) {
          hikeWithRoutes.refetch();
        }
      },
      onError: async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refresh();
          updateHikeMutation.mutate(updateHikeMutation.variables!);
        } else {
          handleError(error);
        }
      },
    },
  );

  const deleteHikeMutation = useMutation(
    (data: { hikeId: string; }) =>
      hikeApi.deleteHike(accessToken!, data.hikeId),
    {
      onSuccess: async () => {
        hikes.refetch();
        userHikes.refetch();
        router.back();
      },
      onError: async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refresh();
          deleteHikeMutation.mutate(updateHikeMutation.variables!);
        } else {
          handleError(error);
        }
      },
    },
  );

  const postHike = async (hikeRequest: HikeRequest) => {
    await postHikeMutation.mutateAsync({ hikeRequest });
  };

  const updateHike = async (hikeRequest: HikeRequest, hikeId: string) => {
    await updateHikeMutation.mutateAsync({ hikeRequest, hikeId});
  };

  const deleteHike = async (hikeId: string) => {
    await deleteHikeMutation.mutateAsync({ hikeId });
  };

  const routeWithPoints = useQuery<RouteWithPoints, Error>(
    ['RouteWithPoints', hikeId, routeId], 
    () => hikeApi.getRouteWithPoints(accessToken!, routeId!),
    {
      enabled: !!accessToken && !!hikeId && !!routeId,
      retry: false,
      onError: async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refresh();
          routeWithPoints.refetch();
        }
      },
    }
  );

  const postRouteMutation = useMutation(
    (data: { routeRequest: RouteRequest; }) =>
      hikeApi.postRoute(accessToken!, data.routeRequest),
    {
      onSuccess: async () => {
        router.back();
        hikeWithRoutes.refetch();
        if(routeId) {
          routeWithPoints.refetch();
        }
      },
      onError: async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refresh();
          postRouteMutation.mutate(postRouteMutation.variables!);
        } else {
          handleError(error);
        }
      },
    },
  );

  const updateRouteMutation = useMutation(
    (data: { routeRequest: RouteRequest; routeId: string; }) =>
      hikeApi.updateRoute(accessToken!, data.routeId, data.routeRequest),
    {
      onSuccess: async () => {
        router.back();
        hikeWithRoutes.refetch();
        if(routeId) {
          routeWithPoints.refetch();
        }
      },
      onError: async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refresh();
          updateRouteMutation.mutate(updateRouteMutation.variables!);
        } else {
          handleError(error);
        }
      },
    },
  );

  const deleteRouteMutation = useMutation(
    (data: { routeId: string; }) =>
      hikeApi.deleleRoute(accessToken!, data.routeId),
    {
      onSuccess: async () => {
        hikeWithRoutes.refetch();
        router.back();
      },
      onError: async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refresh();
          deleteRouteMutation.mutate(deleteRouteMutation.variables!);
        } else {
          handleError(error);
        }
      },
    },
  );

  const postRoute = async (routeRequest: RouteRequest) => {
    await postRouteMutation.mutateAsync({ routeRequest });
  };

  const updateRoute = async (routeRequest: RouteRequest, routeId: string) => {
    await updateRouteMutation.mutateAsync({ routeRequest, routeId});
  };

  const deleteRoute = async (routeId: string) => {
    await deleteRouteMutation.mutateAsync({ routeId });
  };

  const postPointMutation = useMutation(
    (data: { pointRequest: PointRequest; }) =>
      hikeApi.postPoint(accessToken!, data.pointRequest),
    {
      onSuccess: async () => {
        routeWithPoints.refetch();
        router.back();
      },
      onError: async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refresh();
          postPointMutation.mutate(postPointMutation.variables!);
        } else {
          handleError(error);
        }
      },
    },
  );

  const updatePointMutation = useMutation(
    (data: { pointRequest: PointRequest; pointId: string; }) =>
      hikeApi.updatePoint(accessToken!, data.pointId, data.pointRequest),
    {
      onSuccess: async () => {
        routeWithPoints.refetch();
        router.back();
      },
      onError: async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refresh();
          updatePointMutation.mutate(updatePointMutation.variables!);
        } else {
          handleError(error);
        }
      },
    },
  );

  const deletePointMutation = useMutation(
    (data: { pointId: string; }) =>
      hikeApi.deletePoint(accessToken!, data.pointId),
    {
      onSuccess: async () => {
        routeWithPoints.refetch();
      },
      onError: async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await refresh();
          deletePointMutation.mutate(deletePointMutation.variables!);
        } else {
          handleError(error);
        }
      },
    },
  );

  const postPoint = async (pointRequest: PointRequest) => {
    await postPointMutation.mutateAsync({ pointRequest });
  };

  const updatePoint = async (pointRequest: PointRequest, pointId: string) => {
    await updatePointMutation.mutateAsync({ pointRequest, pointId});
  };

  const deletePoint = async (pointId: string) => {
    await deletePointMutation.mutateAsync({ pointId });
  };

  return (
    <HikesContext.Provider value={{ hikes, hikeWithRoutes, setHikeId, routeWithPoints, setRouteId, userHikes, postHike, updateHike, deleteHike, postRoute, updateRoute, deleteRoute, hikeId, postPoint, updatePoint, deletePoint, routeId }}>
      {children}
    </HikesContext.Provider>
  );
};

