import React, { useEffect, useRef } from 'react'
import {
  Animated,
  PanResponder,
  StyleSheet
} from 'react-native'

type Props = {
  children: React.ReactNode
  isShownShortInfo: boolean
  threshold: number
  draggableElement: any
  blockOpacityElements?: {
    carSlider?: boolean
    seatSlider?: boolean
  }
}

export function OpacityLayer({
  children,
  isShownShortInfo,
  threshold,
  draggableElement,
  blockOpacityElements
}: Props) {
  const opacity = useRef(new Animated.Value(isShownShortInfo ? 1 : 0)).current
  const startY = useRef(0)
  const deltaY = useRef(0)
  const canMove = useRef(true)
  const initOpacity = useRef(isShownShortInfo ? 1 : 0)

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isShownShortInfo ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start()
  }, [isShownShortInfo])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const { carSlider, seatSlider } = blockOpacityElements || {}


        if (carSlider || seatSlider) {
          canMove.current = false
        } else {
          canMove.current = true
        }

        startY.current = evt.nativeEvent.pageY
      },

      onPanResponderMove: (evt) => {
        if (!canMove.current) return

        deltaY.current = evt.nativeEvent.pageY - startY.current

        if (!isShownShortInfo && deltaY.current < 0) return
        if (isShownShortInfo && deltaY.current > 0) return

        let newOpacity = Math.abs(deltaY.current) / threshold
        if (deltaY.current < 0) newOpacity = 1 - newOpacity

        newOpacity = Math.max(0, Math.min(1, newOpacity))

        opacity.setValue(newOpacity)
      },

      onPanResponderRelease: () => {
        const shouldToggle =
          Math.abs(deltaY.current) > threshold / 2

        if (shouldToggle) {
          const toValue = deltaY.current > 0 ? 1 : 0
          initOpacity.current = toValue

          Animated.timing(opacity, {
            toValue,
            duration: 200,
            useNativeDriver: true
          }).start()
        } else {
          Animated.timing(opacity, {
            toValue: initOpacity.current,
            duration: 200,
            useNativeDriver: true
          }).start()
        }

        canMove.current = false
      }
    })
  ).current

  return (
    <Animated.View
      style={[
        styles.opacityLayer,
        { opacity }
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  opacityLayer: {
    display: 'flex'
  }
})
