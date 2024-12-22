import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface CustomTitleProps {
  children: string;
}

export const CustomTitle: React.FC<CustomTitleProps> = ({ children }) => (
  <Text style={styles.title}>{children}</Text>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Jaro',
  },
});
