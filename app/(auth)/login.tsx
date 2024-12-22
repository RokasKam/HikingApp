import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { AnimatedLogo, CustomButton, CustomInputField, CustomLink, CustomTitle } from '@/components';
import { validateEmail } from '@/services/validation';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    }

    if (!password) {
      setPasswordError('Password is required');
    }

    if (!email || !password || !validateEmail(email)) return;

    await login(email, password);
  };

  return (
    <View style={styles.container}>
      <AnimatedLogo />
      <CustomTitle>Login</CustomTitle>
      <CustomInputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        errorMessage={emailError}
      />
      <CustomInputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        errorMessage={passwordError}
      />
      <CustomButton onPress={handleLogin} loading={isLoading}>
        Login
      </CustomButton>
      <CustomLink href="/(auth)/register">Do not have an account? Register here</CustomLink>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
