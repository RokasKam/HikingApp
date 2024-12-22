import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { HikesProvider } from '@/context/HikeContext';

export default function AuthenticatedLayout() {
  const { isLoggedIn } = useAuth();
  const theme = useTheme();

  if (!isLoggedIn()) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <HikesProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.secondary,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.outline,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="(hikes)"
          options={{
            title: 'Hikes',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'trail-sign' : 'trail-sign-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            title: 'Your profile',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
            ),
          }}
        />
      </Tabs>
    </HikesProvider>
  );
}

