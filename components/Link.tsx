import React from 'react';
import { StyleSheet } from 'react-native';
import { Href, Link } from 'expo-router';
import { Text } from 'react-native-paper';

interface CustomLinkProps {
  href: Href;
  children: string;
}

export const CustomLink: React.FC<CustomLinkProps> = ({ href, children }) => (
  <Link href={href} asChild>
    <Text style={styles.link}>{children}</Text>
  </Link>
);

const styles = StyleSheet.create({
  link: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 16,
  },
});
