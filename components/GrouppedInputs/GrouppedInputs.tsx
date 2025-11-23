import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface IProps {
  children?: React.ReactNode;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

const GroupedInputs: React.FC<IProps> = ({ label, style, children }) => {
  return (
    <View style={[styles.groupedInputs, style]}>
      {label && (
        <Text style={[styles.groupedInputs,styles.label]}>{label}:</Text>
      )}
      {children}
    </View>
  )
}

export default GroupedInputs

const styles = StyleSheet.create({
  groupedInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
    columnGap: 15,
    rowGap: 0,
  },
  label: {
    color: 'rgba(6, 46, 123, 1)',
    fontSize: 20,
    width: '100%',
    marginBottom: 15,
  }
})
