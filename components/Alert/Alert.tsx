

import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Intent } from './index'
interface IIntents {
  error: string
  warning: string
  success: string
  info: string
}
interface IAlertProps {
  intent: keyof IIntents;
  message: string;
  onClose: () => void
}

export default function Alert({ intent, message, onClose }: IAlertProps) {
  const intents: IIntents = {
    error: '#f44336',
    warning: '#ff9800',
    success: '#4caf50',
    info: '#2196f3',
  }

  const bgColor = intents[intent] || intents[Intent.SUCCESS]

  return (
    <TouchableOpacity
      style={[styles.alert, { backgroundColor: bgColor }]}
      onPress={onClose}
      activeOpacity={0.8}
    >
      <Text style={styles.closeBtn}>×</Text>
      <Text style={styles.message}>{message}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    color: 'white',
  },
  message: {
    color: 'white',
    flex: 1,
    fontSize: 16,
  },
  closeBtn: {
    marginLeft: 15,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
    lineHeight: 20,
    marginTop: 2,
  },
})