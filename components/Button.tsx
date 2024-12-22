import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface CustomButtonProps {
  onPress: () => void;
  loading?: boolean;
  children: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  loading = false,
  children,
}) => (
  <Button
    mode="contained"
    onPress={onPress}
    loading={loading}
    style={styles.button}
    contentStyle={styles.content}>
    {children}
  </Button>
);

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    width: '100%',
  },
  content: {
    height: 48,
  },
});
