import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Path, Svg } from 'react-native-svg'

interface IProps {
  text?: string
  style?: object
  active?: boolean
  onPress?: () => void
}

const Separator: React.FC<IProps> = ({ text, style, active, onPress }) => {
  const rotation = useRef(new Animated.Value(active ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: active ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [active])

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  return (
    <TouchableOpacity
      style={[styles.separator, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{text}</Text>
      <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
        <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
          <Path
            d="M3.33337 10L8.00004 6L12.6667 10"
            stroke="#1C274C"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </TouchableOpacity>
  )
}

export default Separator

const styles = StyleSheet.create({
  separator: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    position: 'relative',
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
})
