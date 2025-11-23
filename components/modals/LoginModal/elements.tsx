import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import BaseInput, { EInputStyles } from '../../Input';


interface InputProps {
  fieldWrapperStyle?: ViewStyle | ViewStyle[];
  [key: string]: any;
}

export function Input({
  fieldWrapperStyle,
  ...props
}: InputProps) {
  return (
    <BaseInput
      style={EInputStyles.Login}

      fieldWrapperStyle={[styles.loginFormInput, fieldWrapperStyle]}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  loginFormInput: {

    marginBottom: 16,
    width: '100%',
  },
})