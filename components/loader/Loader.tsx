import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'

const Loader = () => {
  const rotation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    )
    loop.start()
    return () => loop.stop()
  }, [rotation])

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <View style={styles.loaderWrapper}>
      <Animated.View
        style={[
          styles.circle,
          { transform: [{ rotate: rotateInterpolate }] },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  loaderWrapper: {
    width: 10,
    height: 10,
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: '#000000',
    borderBottomColor: 'transparent',
    borderRadius: 5,
  },
})

export { Loader }

