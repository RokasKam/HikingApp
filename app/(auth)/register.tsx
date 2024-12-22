import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { validateEmail, validatePassword } from '@/services/validation';
import { CustomButton, CustomInputField, CustomLink, CustomTitle } from '@/components';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const { register, isLoading } = useAuth();

  const handleRegister = async () => {
    setEmailError('');
    setPasswordError('');
    setUsernameError('');

    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError(
        'Password must have at least one number, one uppercase letter, one lowercase letter, and one special character',
      );
      isValid = false;
    }

    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    }

    if (!isValid) return;

    await register(email, password, username);
  };

  return (
    <View style={styles.container}>
      <CustomTitle>Register</CustomTitle>
      <CustomInputField
        label="Username"
        value={username}
        onChangeText={setUsername}
        errorMessage={usernameError}
      />
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
      <CustomButton onPress={handleRegister} loading={isLoading}>
        Register
      </CustomButton>
      <CustomLink href="/(auth)/login">Already have an account? Login here</CustomLink>
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
