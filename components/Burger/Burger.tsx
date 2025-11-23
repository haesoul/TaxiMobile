import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface IBurgerProps {
  isOpen: boolean;
  onPress: () => void;
}

export function Burger({ isOpen, onPress }: IBurgerProps) {
  return (
    <TouchableOpacity style={styles.burgerButton} onPress={onPress}>
      <View style={[styles.burgerButtonLine, styles.burgerButtonLineM]} />
      <View
        style={[
          styles.burgerButtonLine,
          isOpen ? styles.burgerButtonLineL : styles.burgerButtonLineS,
        ]}
      />
    </TouchableOpacity>
  );
}

const RED = '#FF2400';

const styles = StyleSheet.create({
  burgerButton: {
    width: 32,
    height: 32,
    paddingVertical: 8,
    paddingHorizontal: 4.8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  burgerButtonLine: {
    height: 2,
    backgroundColor: RED,
    borderRadius: 1,
  },
  burgerButtonLineS: {
    width: '30%',
  },
  burgerButtonLineM: {
    width: '70%',
  },
  burgerButtonLineL: {
    width: '100%',
  },
});
