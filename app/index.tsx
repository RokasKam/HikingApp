import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import React from 'react';

export default function Index() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn()) {
    return <Redirect href="/(authenticated)/(hikes)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
