import { Stack } from 'expo-router';

export default function HikesLayout() {
  return (
    <Stack screenOptions={{headerShown: false, gestureEnabled: true}}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
