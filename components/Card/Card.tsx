import store from '@/state'
import React from 'react'
import { ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SITE_CONSTANTS from '../../siteConstants'
import SmartImage from '../SmartImage'

interface IProps {
  src?: ImageSourcePropType
  text?: string
  active?: boolean
  style?: any
  onPress?: () => void
  disabled?: boolean
  payment?: string
}

const Card: React.FC<IProps> = ({ src, text, active, style, onPress, disabled, payment }) => {
  SITE_CONSTANTS.init(store.getState().global.data);
  const color = active ? SITE_CONSTANTS.PALETTE.primary.dark : '#898888'

  return (
    <TouchableOpacity
      style={[styles.card, active && styles.cardActive, disabled && styles.cardDisabled, style]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.8}
    >
      {src && <SmartImage source={src} style={[styles.image, active && styles.imageActive]} />}
      <View style={[styles.separator, { borderColor: color }]} />
      {text && <Text style={[styles.text, { color }]}>{text}</Text>}
      {payment && <Text style={[styles.payment, { color: SITE_CONSTANTS.PALETTE.primary.light }]}>{payment}</Text>}
    </TouchableOpacity>
  )
}

export default Card

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 3,
    opacity: 1,
  },
  cardActive: {
    shadowColor: '#FF2400',
    shadowOpacity: 0.4,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  image: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    marginBottom: 8,
    tintColor: '#898888',
  },
  imageActive: {
    tintColor: undefined,
  },
  separator: {
    width: '68%',
    borderBottomWidth: 1,
    marginVertical: 4,
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 4,
  },
  payment: {
    fontWeight: '500',
    fontSize: 16,
    marginTop: 4,
  },
})
