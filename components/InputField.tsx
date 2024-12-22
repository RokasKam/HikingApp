import React from 'react';
import { TextInput, HelperText } from 'react-native-paper';
import { KeyboardTypeOptions, StyleSheet } from 'react-native';

interface CustomInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  errorMessage?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onBlur?: () => void;
}

export const CustomInputField: React.FC<CustomInputFieldProps> = ({
  label,
  value,
  onChangeText,
  errorMessage = '',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  onBlur = () => {},
}) => (
  <>
    <TextInput
      style={styles.input}
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode="outlined"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      error={!!errorMessage}
      onBlur={onBlur}
    />
    {errorMessage && <HelperText type="error">{errorMessage}</HelperText>}
  </>
);

const styles = StyleSheet.create({
  input: {
    width: '100%',
    marginBottom: 16,
  },
});
